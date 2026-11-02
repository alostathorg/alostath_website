import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate, latinDigitsDeep } from "@/lib/format";
import {
  STATUS_LABELS,
  STATUSES,
  TRANSLATIONS_PATH,
  WORDS_GOAL,
  formatCount,
  goalPercent,
  modeLabel,
  sourceOf,
} from "@/lib/translations";
import type { Translation, TranslationStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Row = Pick<
  Translation,
  | "id" | "slug" | "title" | "original_title" | "excerpt" | "mode" | "category" | "source_name" | "source_url"
  | "word_count" | "status" | "review_note" | "batch_date" | "published_at" | "cover_url"
>;

const BADGE: Record<TranslationStatus, string> = {
  draft: "is-soon",
  revise: "is-type",
  rejected: "is-closed",
  published: "is-pub",
};

export default async function TranslationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: raw = "draft" } = await searchParams;
  const status = (STATUSES as string[]).includes(raw) ? (raw as TranslationStatus) : "draft";
  const supabase = await createClient();

  const [{ data }, { data: all }] = await Promise.all([
    supabase
      .from("translations")
      .select("id, slug, title, original_title, excerpt, mode, category, source_name, source_url, word_count, status, review_note, batch_date, published_at, cover_url")
      .eq("status", status)
      .order(status === "published" ? "published_at" : "batch_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(300),
    supabase.from("translations").select("status, word_count"),
  ]);

  const rows = latinDigitsDeep((data ?? []) as Row[]);
  const counts: Record<string, number> = {};
  let words = 0;
  for (const r of (all ?? []) as { status: string; word_count: number }[]) {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
    if (r.status === "published") words += r.word_count;
  }
  const pct = goalPercent(words);

  // Drafts are reviewed a week at a time, so they are grouped by the run that
  // produced them — each group carries its own bundled PDF.
  const groups: { date: string; items: Row[] }[] = [];
  for (const r of rows) {
    const key = status === "published" ? "" : r.batch_date;
    const last = groups[groups.length - 1];
    if (last && last.date === key) last.items.push(r);
    else groups.push({ date: key, items: [r] });
  }

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">الترجمات — مليون كلمة</h1>
          <p className="admin-subtitle">
            تصل المسودات كل أحد من المهمة الأسبوعية. راجع كل مادة، شارك ملف PDF مع الزملاء عند الحاجة، ثم اعتمدها أو
            أعدها لإعادة الصياغة. لا يظهر على الموقع إلا ما تعتمده.
          </p>
        </div>
        <Link href={TRANSLATIONS_PATH} target="_blank" className="admin-btn admin-btn-ghost admin-btn-sm">
          عرض القسم على الموقع ↗
        </Link>
      </div>

      <div className="admin-card tr-goal">
        <div className="tr-goal-figures">
          <div>
            <div className="tr-goal-k">كلمات منشورة</div>
            <div className="tr-goal-v">{formatCount(words)}</div>
          </div>
          <div>
            <div className="tr-goal-k">الهدف</div>
            <div className="tr-goal-v is-muted">{formatCount(WORDS_GOAL)}</div>
          </div>
          <div>
            <div className="tr-goal-k">مواد منشورة</div>
            <div className="tr-goal-v is-muted">{formatCount(counts.published ?? 0)}</div>
          </div>
        </div>
        <div className="tr-goal-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="tr-goal-pct">{pct}% من المليون</div>
      </div>

      <div className="admin-filterbar">
        <div className="admin-tabs">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/translations?status=${s}`}
              className={`admin-tab${status === s ? " is-active" : ""}`}
            >
              {STATUS_LABELS[s]}
              <span className="tr-tab-count">{formatCount(counts[s] ?? 0)}</span>
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty" style={{ margin: 0 }}>
            {status === "draft"
              ? "لا توجد مسودات بانتظار المراجعة. تصل الدفعة التالية صباح الأحد."
              : "لا توجد مواد في هذه الحالة."}
          </p>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.date || "all"} className="tr-batch">
            {g.date && (
              <div className="tr-batch-head">
                <h2 className="admin-card-title" style={{ margin: 0 }}>
                  دفعة {formatArabicDate(g.date)} <span className="tr-batch-n">· {formatCount(g.items.length)} مواد</span>
                </h2>
                {g.items.length > 1 && (
                  <a
                    href={`/print/translations/batch/${g.date}?status=${status}`}
                    target="_blank"
                    rel="noopener"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    PDF مجمّع للدفعة
                  </a>
                )}
              </div>
            )}

            <div className="tr-list">
              {g.items.map((t) => {
                const src = sourceOf(t);
                return (
                  <article key={t.id} className="admin-card tr-item">
                    <Link href={`/admin/translations/${t.id}`} className="tr-item-thumb" aria-hidden tabIndex={-1}>
                      {t.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.cover_url} alt="" loading="lazy" />
                      ) : (
                        <span>بدون صورة</span>
                      )}
                    </Link>
                    <div className="tr-item-main">
                      <div className="tr-item-badges">
                        <span className={`admin-badge ${BADGE[t.status]}`}><span className="dot" />{STATUS_LABELS[t.status]}</span>
                        <span className="admin-badge is-type">{modeLabel(t.mode)}</span>
                        {t.category && <span className="admin-badge is-type">{t.category}</span>}
                      </div>
                      <h3 className="tr-item-title">
                        <Link href={`/admin/translations/${t.id}`}>{t.title}</Link>
                      </h3>
                      {t.original_title && <div className="tr-item-orig" dir="ltr">{t.original_title}</div>}
                      {t.excerpt && <p className="tr-item-excerpt">{t.excerpt}</p>}
                      {t.status === "revise" && t.review_note && (
                        <p className="tr-item-note"><strong>ملاحظة إعادة الصياغة:</strong> {t.review_note}</p>
                      )}
                      <div className="tr-item-meta">
                        {src.name && <span>{src.name}</span>}
                        <span>{formatCount(t.word_count)} كلمة</span>
                        {t.published_at && <span>نُشرت {formatArabicDate(t.published_at)}</span>}
                      </div>
                    </div>
                    <div className="tr-item-actions">
                      <Link href={`/admin/translations/${t.id}`} className="admin-btn admin-btn-primary admin-btn-sm">
                        {t.status === "draft" ? "مراجعة" : "فتح"}
                      </Link>
                      <a href={`/print/translations/${t.id}`} target="_blank" rel="noopener" className="admin-btn admin-btn-ghost admin-btn-sm">
                        PDF
                      </a>
                      {t.status === "published" && (
                        <a href={`${TRANSLATIONS_PATH}/${t.slug}`} target="_blank" rel="noopener" className="admin-btn admin-btn-ghost admin-btn-sm">
                          على الموقع ↗
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
