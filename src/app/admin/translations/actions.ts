"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import { latinDigitsDeep } from "@/lib/format";
import { TRANSLATIONS_PATH } from "@/lib/translations";
import type { TranslationStatus } from "@/lib/types";

export type SaveState = { ok?: string; error?: string } | undefined;

const INTENT_STATUS: Record<string, TranslationStatus | null> = {
  save: null, // keep the current status
  publish: "published",
  revise: "revise",
  reject: "rejected",
  draft: "draft",
};

const INTENT_DONE: Record<string, string> = {
  save: "حُفظت التعديلات.",
  publish: "اعتُمدت المادة ونُشرت على الموقع.",
  revise: "أُعيدت المادة لإعادة الصياغة — ستُعالَج في التشغيل الأسبوعي القادم.",
  reject: "رُفضت المادة. تبقى محفوظة حتى لا يُعاد اختيار المصدر نفسه.",
  draft: "أُعيدت المادة إلى المراجعة وأُخفيت من الموقع.",
};

const str = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const orNull = (s: string) => (s === "" ? null : s);

/**
 * Saves the review form and, depending on the button pressed (`intent`),
 * moves the item to a new status. Returns a message instead of throwing:
 * Next.js masks thrown Server Action errors in production.
 */
export async function saveTranslation(id: string, _prev: SaveState, form: FormData): Promise<SaveState> {
  if (!(await isAdmin())) return { error: "غير مصرّح" };

  const intent = str(form, "intent") || "save";
  if (!(intent in INTENT_STATUS)) return { error: "إجراء غير معروف" };

  const body = form
    .getAll("body")
    .map((p) => String(p ?? "").trim())
    .filter(Boolean);
  const title = str(form, "title");
  const slug = str(form, "slug").toLowerCase();
  const reviewNote = str(form, "review_note");

  if (!title) return { error: "العنوان مطلوب." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "مُعرّف الرابط بالإنجليزية الصغيرة والأرقام والشرطة فقط، مثال: formative-assessment-guide" };
  }
  if (intent === "publish" && body.length === 0) return { error: "لا يمكن نشر مادة بلا نص." };
  if (intent === "revise" && !reviewNote) {
    return { error: "اكتب في «ملاحظات المراجعة» ما المطلوب تعديله، ثم اضغط «إعادة صياغة»." };
  }

  const row: Record<string, unknown> = latinDigitsDeep({
    title,
    slug,
    original_title: orNull(str(form, "original_title")),
    excerpt: orNull(str(form, "excerpt")),
    category: orNull(str(form, "category")),
    mode: str(form, "mode") === "full" ? "full" : "summary",
    source_name: orNull(str(form, "source_name")),
    source_url: orNull(str(form, "source_url")),
    author: orNull(str(form, "author")),
    source_date: orNull(str(form, "source_date")),
    license: orNull(str(form, "license")),
    license_url: orNull(str(form, "license_url")),
    review_note: orNull(reviewNote),
    body,
  });

  const nextStatus = INTENT_STATUS[intent];
  if (nextStatus) row.status = nextStatus;
  // Taking an item off the site clears its date, so a later re-publish is dated
  // the day it actually went back up.
  if (nextStatus && nextStatus !== "published") row.published_at = null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("translations").update(row).eq("id", id).select("slug");
  if (error) {
    if (error.code === "23505") return { error: "مُعرّف الرابط أو رابط المصدر مستخدم في مادة أخرى." };
    return { error: error.message };
  }
  if (!data || data.length === 0) return { error: "لم يتم الحفظ — تحقق من الصلاحيات." };

  revalidatePath("/admin/translations");
  revalidatePath(`/admin/translations/${id}`);
  revalidatePath(TRANSLATIONS_PATH);
  revalidatePath(`${TRANSLATIONS_PATH}/${slug}`);
  revalidatePath("/");
  return { ok: INTENT_DONE[intent] };
}
