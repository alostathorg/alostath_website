import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import { formatArabicDate, latinDigitsDeep } from "@/lib/format";
import { MACHINE_NOTE, STATUSES, STATUS_LABELS, TRANSLATIONS_TITLE, formatCount, modeLabel } from "@/lib/translations";
import type { Translation, TranslationStatus } from "@/lib/types";
import PrintFrame from "@/components/translations/PrintFrame";
import TranslationDocument from "@/components/translations/TranslationDocument";

// The weekly bundle: every item of one run in one PDF, behind a cover with a
// numbered index, so the editor sends one file instead of five.
export const dynamic = "force-dynamic";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  return {
    title: { absolute: `مسودات الترجمة — دفعة ${ISO_DATE.test(date) ? date : ""}` },
    robots: { index: false, follow: false },
  };
}

export default async function TranslationBatchPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { date } = await params;
  const { status: raw = "draft" } = await searchParams;
  if (!ISO_DATE.test(date)) notFound();
  if (!(await isAdmin())) redirect(`/admin/login?next=${encodeURIComponent(`/print/translations/batch/${date}`)}`);
  const status = (STATUSES as string[]).includes(raw) ? (raw as TranslationStatus) : "draft";

  const supabase = await createClient();
  const { data } = await supabase
    .from("translations")
    .select("*")
    .eq("batch_date", date)
    .eq("status", status)
    .order("created_at", { ascending: true });
  const items = latinDigitsDeep((data ?? []) as Translation[]);
  if (items.length === 0) notFound();

  const words = items.reduce((n, t) => n + t.word_count, 0);

  return (
    <PrintFrame draft={status !== "published"}>
      <section className="tp-doc tp-cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tp-cover-logo" src="/assets/alostath-logo.png" alt="مؤسسة الأستاذ" />
        <div className="tp-cover-k">{TRANSLATIONS_TITLE} — مبادرة «مليون كلمة»</div>
        <h1 className="tp-cover-title">
          {status === "published" ? "المواد المنشورة" : "مسودات للمراجعة"}
        </h1>
        <div className="tp-cover-date">دفعة {formatArabicDate(date)}</div>
        <div className="tp-cover-stats">
          <div><strong>{formatCount(items.length)}</strong><span>مواد</span></div>
          <div><strong>{formatCount(words)}</strong><span>كلمة</span></div>
          <div><strong>{STATUS_LABELS[status]}</strong><span>الحالة</span></div>
        </div>

        <h2 className="tp-index-title">الفهرس</h2>
        <ol className="tp-index">
          {items.map((t, i) => (
            <li key={t.id}>
              <span className="tp-n">{i + 1}</span>
              <a href={`#tr-${i + 1}`}>
                <strong>{t.title}</strong>
                <span>
                  {[t.category, modeLabel(t.mode), `${formatCount(t.word_count)} كلمة`].filter(Boolean).join(" · ")}
                </span>
              </a>
            </li>
          ))}
        </ol>

        <p className="tp-cover-note">
          {MACHINE_NOTE}. فقرات كل مادة مرقّمة؛ يُرجى الإشارة إلى رقم المادة ورقم الفقرة عند إرسال الملاحظات، مثل: «المادة 2
          — الفقرة 4».
        </p>
      </section>

      {items.map((t, i) => (
        <TranslationDocument key={t.id} t={t} anchor={`tr-${i + 1}`} index={i + 1} />
      ))}
    </PrintFrame>
  );
}
