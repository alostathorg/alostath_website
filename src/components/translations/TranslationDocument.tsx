import type { Translation } from "@/lib/types";
import { formatArabicDate } from "@/lib/format";
import {
  MACHINE_NOTE,
  TRANSLATIONS_PATH,
  TRANSLATIONS_TITLE,
  formatCount,
  languageLabel,
  licenseOf,
  modeLabel,
  paragraphs,
  sourceOf,
} from "@/lib/translations";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ostath.sa";

/**
 * One translation laid out as an A4 document — the thing that becomes a PDF.
 * Used by the review PDF (draft watermark, numbered paragraphs, optional
 * bilingual columns), the weekly bundle (several of these, one per page run)
 * and the visitor PDF (no watermark).
 *
 * Paragraph numbers are the same ones the review screen shows, so a colleague
 * can write «الفقرة 4» and the editor finds it at a glance.
 */
export default function TranslationDocument({
  t,
  bilingual = false,
  anchor,
  index,
}: {
  t: Translation;
  bilingual?: boolean;
  /** id for the bundle's table of contents to link to. */
  anchor?: string;
  /** Position in a bundle (1-based), shown in the running head. */
  index?: number;
}) {
  const body = paragraphs(t.body);
  const original = paragraphs(t.original_body);
  const src = sourceOf(t);
  const lic = licenseOf(t);
  const published = t.status === "published";
  const url = published ? new URL(`${TRANSLATIONS_PATH}/${t.slug}`, SITE).toString() : null;
  const twoCol = bilingual && original.length > 0;
  const rows = twoCol ? Math.max(body.length, original.length) : body.length;

  const meta: { k: string; v: React.ReactNode }[] = [
    { k: "المصدر", v: src.name ?? "—" },
    ...(t.author ? [{ k: "المؤلف", v: t.author }] : []),
    ...(t.source_date ? [{ k: "تاريخ النشر الأصلي", v: t.source_date }] : []),
    { k: "لغة الأصل", v: languageLabel(t.source_language) },
    { k: "الرخصة", v: lic.name ?? "—" },
    { k: "عدد الكلمات", v: formatCount(t.word_count) },
    published
      ? { k: "تاريخ النشر", v: formatArabicDate(t.published_at) }
      : { k: "الدفعة", v: formatArabicDate(t.batch_date) },
  ];

  return (
    <article className="tp-doc" id={anchor}>
      <header className="tp-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tp-logo" src="/assets/alostath-logo.png" alt="مؤسسة الأستاذ" />
        <div className="tp-head-text">
          <strong>{TRANSLATIONS_TITLE}</strong>
          <span>مبادرة «مليون كلمة» — مؤسسة الأستاذ</span>
        </div>
        {index != null && <span className="tp-head-index">{index}</span>}
      </header>

      <div className="tp-kicker">
        <span className="tp-chip is-gold">{modeLabel(t.mode)}</span>
        {t.category && <span className="tp-chip">{t.category}</span>}
      </div>

      <h1 className="tp-title">{t.title}</h1>
      {t.original_title && <div className="tp-orig" dir="ltr">{t.original_title}</div>}
      {t.excerpt && <p className="tp-excerpt">{t.excerpt}</p>}

      <dl className="tp-meta">
        {meta.map((m) => (
          <div key={m.k}>
            <dt>{m.k}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>

      <p className="tp-note">
        {MACHINE_NOTE}.
        {t.mode === "summary"
          ? " هذا ملخّص مترجم يعرض أبرز ما في المادة الأصلية؛ للنص الكامل يُرجى الرجوع إلى المصدر."
          : " النص ترجمة كاملة للمادة الأصلية المنشورة برخصة مفتوحة تسمح بالترجمة."}
      </p>

      {twoCol ? (
        <div className="tp-bi">
          <div className="tp-bi-head">
            <span />
            <span>الترجمة العربية</span>
            <span dir="ltr">Original</span>
          </div>
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="tp-bi-row">
              <span className="tp-n">{i + 1}</span>
              <p className="tp-bi-ar">{body[i] ?? ""}</p>
              <p className="tp-bi-en" dir="ltr">{original[i] ?? ""}</p>
            </div>
          ))}
        </div>
      ) : (
        <ol className="tp-body">
          {body.map((p, i) => (
            <li key={i}>
              <span className="tp-n" aria-hidden>{i + 1}</span>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      )}

      <footer className="tp-foot">
        {src.href && (
          <div>
            <span>المادة الأصلية:</span>{" "}
            <a href={src.href} dir="ltr">{src.href}</a>
          </div>
        )}
        {lic.name && (
          <div>
            <span>الرخصة:</span>{" "}
            {lic.href ? <a href={lic.href} dir="ltr">{lic.name}</a> : <bdi>{lic.name}</bdi>}
          </div>
        )}
        {url && (
          <div>
            <span>على موقع المؤسسة:</span>{" "}
            <a href={url} dir="ltr">{url}</a>
          </div>
        )}
      </footer>
    </article>
  );
}
