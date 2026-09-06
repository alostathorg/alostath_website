"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import { getCollection, type Collection } from "./config";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "media";

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("غير مصرّح");
}

function coerce(collection: Collection, form: FormData) {
  const row: Record<string, unknown> = {};
  let phases: unknown = undefined;

  for (const field of collection.fields) {
    if (field.name === "phases") {
      // Pseudo-field on awards → synced to award_timeline_phases separately.
      const raw = String(form.get("phases") ?? "").trim();
      phases = raw ? JSON.parse(raw) : [];
      continue;
    }
    const raw = form.get(field.name);
    switch (field.type) {
      case "boolean":
        row[field.name] = form.get(field.name) === "on";
        break;
      case "number": {
        const s = String(raw ?? "").trim();
        row[field.name] = s === "" ? 0 : Number(s);
        break;
      }
      case "tags":
        row[field.name] = String(raw ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "lines":
        row[field.name] = String(raw ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "json":
      case "repeater": {
        const s = String(raw ?? "").trim();
        row[field.name] = s === "" ? [] : JSON.parse(s);
        break;
      }
      case "keyvalue": {
        const s = String(raw ?? "").trim();
        row[field.name] = s === "" ? {} : JSON.parse(s);
        break;
      }
      default: {
        const s = String(raw ?? "");
        // Optional date/url fields become null when blank.
        row[field.name] = s.trim() === "" && (field.name.endsWith("_at") || field.name.endsWith("_url"))
          ? null
          : s;
      }
    }
  }
  return { row, phases };
}

/**
 * Postgres speaks English to the editor otherwise. The one error editors hit
 * in practice is a unique-key collision — two names that transliterate to the
 * same slug, or a partner/press asset saved twice — so that one names the
 * field to change. Postgres reports the column as `Key (slug)=(x) already
 * exists.`; when that is missing, the collection's slug (or its first field)
 * is the unique column by construction.
 */
function friendlyDbError(
  collection: Collection,
  error: { code?: string; message: string; details?: string | null },
): string {
  if (error.code === "23505") {
    const col = /Key \(([^)]+)\)/.exec(error.details ?? "")?.[1]?.split(",")[0]?.trim();
    const field =
      collection.fields.find((f) => f.name === col) ??
      collection.fields.find((f) => f.name === "slug") ??
      collection.fields[0];
    return `«${field.label}» مستخدم من قبل في سجل آخر — غيّره ثم احفظ مجدداً.`;
  }
  return error.message;
}

/**
 * Returns `{ error }` for a database rejection instead of throwing: Next.js
 * masks thrown Server Action errors in production, so a thrown message would
 * reach the editor as a generic English notice.
 */
export async function saveRecord(slug: string, id: string | null, form: FormData): Promise<{ error: string } | undefined> {
  await requireAdmin();
  const collection = getCollection(slug);
  if (!collection) throw new Error("مجموعة غير معروفة");
  const supabase = await createClient();

  const { row, phases } = coerce(collection, form);

  let recordId = id;
  if (id) {
    const { error } = await supabase.from(collection.table).update(row).eq("id", id);
    if (error) return { error: friendlyDbError(collection, error) };
  } else {
    const { data, error } = await supabase.from(collection.table).insert(row).select("id").single();
    if (error) return { error: friendlyDbError(collection, error) };
    recordId = data.id;
  }

  // Awards: replace timeline phases.
  if (collection.table === "awards" && Array.isArray(phases) && recordId) {
    await supabase.from("award_timeline_phases").delete().eq("award_id", recordId);
    if (phases.length) {
      await supabase.from("award_timeline_phases").insert(
        (phases as Record<string, unknown>[]).map((p, i) => ({
          award_id: recordId,
          label: p.label ?? "",
          date_text: p.date_text ?? null,
          state: p.state ?? "next",
          tag_text: p.tag_text ?? null,
          sort_order: i + 1,
        })),
      );
    }
  }

  revalidatePath("/", "layout");
  redirect(`/admin/collections/${slug}`);
}

export async function deleteRecord(slug: string, id: string) {
  await requireAdmin();
  const collection = getCollection(slug);
  if (!collection) throw new Error("مجموعة غير معروفة");
  const supabase = await createClient();
  const { error } = await supabase.from(collection.table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath(`/admin/collections/${slug}`);
}

export async function togglePublished(slug: string, id: string, next: boolean) {
  await requireAdmin();
  const collection = getCollection(slug);
  if (!collection) throw new Error("مجموعة غير معروفة");
  if (!collection.fields.some((f) => f.name === "published")) throw new Error("لا يدعم النشر");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(collection.table)
    .update({ published: next })
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("لم يتم تحديث العنصر — تحقق من الصلاحيات.");
  revalidatePath("/", "layout");
  revalidatePath(`/admin/collections/${slug}`);
}

export async function deleteRegistration(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("registrations").delete().eq("id", id);
  revalidatePath("/admin/registrations");
}

export async function saveSettings(key: string, form: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const raw = String(form.get("value") ?? "").trim();
  const value = raw ? JSON.parse(raw) : {};
  const { error } = await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

/** Uploads a file to Storage and returns its public URL. */
export async function uploadMedia(form: FormData): Promise<{ url?: string; error?: string }> {
  if (!(await isAdmin())) return { error: "غير مصرّح" };
  const file = form.get("file") as File | null;
  if (!file || file.size === 0) return { error: "لم يتم اختيار ملف" };
  const supabase = await createClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
