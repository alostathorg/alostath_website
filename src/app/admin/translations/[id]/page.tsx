import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate, latinDigitsDeep } from "@/lib/format";
import { STATUS_LABELS, formatCount, languageLabel } from "@/lib/translations";
import type { Translation } from "@/lib/types";
import TranslationEditor from "./TranslationEditor";

export const dynamic = "force-dynamic";

export default async function TranslationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("translations").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const t = latinDigitsDeep(data as Translation);

  return (
    <div>
      <Link href={`/admin/translations?status=${t.status}`} className="admin-back">→ الترجمات</Link>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">مراجعة ترجمة</h1>
          <p className="admin-subtitle">
            {STATUS_LABELS[t.status]} · دفعة {formatArabicDate(t.batch_date)} · {formatCount(t.word_count)} كلمة · مترجمة من{" "}
            {languageLabel(t.source_language)}
          </p>
          <p className="admin-hint" style={{ marginTop: 4 }}>ملف PDF يُنشأ من آخر نسخة محفوظة — احفظ تعديلاتك قبل تحميله.</p>
        </div>
        <div className="admin-rowactions">
          <a href={`/print/translations/${t.id}`} target="_blank" rel="noopener" className="admin-btn admin-btn-ghost admin-btn-sm">
            تحميل PDF
          </a>
          {t.original_body.length > 0 && (
            <a href={`/print/translations/${t.id}?bilingual=1`} target="_blank" rel="noopener" className="admin-btn admin-btn-ghost admin-btn-sm">
              PDF ثنائي اللغة
            </a>
          )}
        </div>
      </div>

      <TranslationEditor item={t} />
    </div>
  );
}
