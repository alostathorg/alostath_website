import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { DetailPager, SectionHead } from "@/components/DetailKit";
import { getTranslation, getTranslations } from "@/lib/queries";
import { formatArabicDate, readingTime } from "@/lib/format";
import {
  MACHINE_NOTE,
  TRANSLATIONS_NAV_LABEL,
  TRANSLATIONS_PATH,
  formatCount,
  languageLabel,
  licenseOf,
  modeLabel,
  paragraphs,
  sourceOf,
} from "@/lib/translations";
import TranslationRow from "../TranslationRow";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ostath.sa";

export async function generateStaticParams() {
  const items = await getTranslations();
  return items.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslation(slug);
  return {
    title: t?.title ?? TRANSLATIONS_NAV_LABEL,
    description: t?.excerpt ?? undefined,
    openGraph: t?.cover_url ? { images: [{ url: t.cover_url, width: 1600, height: 900, alt: t.cover_alt ?? t.title }] } : undefined,
  };
}

export default async function TranslationItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [t, all] = await Promise.all([getTranslation(slug), getTranslations()]);
  if (!t) notFound();

  const body = paragraphs(t.body);
  const src = sourceOf(t);
  const lic = licenseOf(t);
  const idx = all.findIndex((x) => x.slug === t.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx !== -1 && idx < all.length - 1 ? all[idx + 1] : null;
  // Related reading: same category first, then the newest of the rest.
  const others = all.filter((x) => x.slug !== t.slug);
  const more = [...others.filter((x) => x.category && x.category === t.category), ...others.filter((x) => x.category !== t.category)].slice(0, 3);

  const url = new URL(`${TRANSLATIONS_PATH}/${t.slug}`, SITE).toString();
  const share = [
    {
      key: "x",
      label: "شارك على إكس",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(t.title)}&url=${encodeURIComponent(url)}`,
      icon: <path d="M18.9 2H22l-7 8 8.3 12h-6.5l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.7l4.6 6.7L18.9 2zm-1.1 18h1.8L7.3 3.9H5.4L17.8 20z" />,
    },
    {
      key: "linkedin",
      label: "شارك على لينكدإن",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9z" />,
    },
    {
      key: "whatsapp",
      label: "شارك على واتساب",
      href: `https://wa.me/?text=${encodeURIComponent(`${t.title} — ${url}`)}`,
      icon: <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.13-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12s-.64.8-.78.97c-.15.16-.29.18-.53.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.32.08-.16.04-.3-.02-.42l-.76-1.83c-.2-.47-.4-.4-.55-.41h-.47a.9.9 0 0 0-.65.3 2.73 2.73 0 0 0-.85 2.03c0 1.2.87 2.35.99 2.51.12.16 1.71 2.61 4.15 3.66 1.55.67 2.15.72 2.92.61.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29z" />,
    },
  ];

  return (
    <PageShell active="translations">
      <div className="read-bar" data-read-progress aria-hidden>
        <span />
      </div>

      <PageHero
        size="lg"
        crumbs={[{ label: TRANSLATIONS_NAV_LABEL, href: TRANSLATIONS_PATH }, { label: t.title }]}
        eyebrow={t.category ?? modeLabel(t.mode)}
        title={t.title}
        image={t.cover_url}
        lede={t.excerpt || undefined}
        meta={
          <div className="bl-hero-meta">
            <span>{modeLabel(t.mode)}</span>
            {src.name && (
              <>
                <span className="bl-dot" aria-hidden />
                <span>عن {src.name}</span>
              </>
            )}
            <span className="bl-dot" aria-hidden />
            <span>{readingTime(body)}</span>
          </div>
        }
      />

      <div className="tl-wrap tl-item">
        <article data-read-target>
          {t.cover_url && (
            <figure className="tl-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.cover_url} alt={t.cover_alt ?? ""} />
              {t.cover_credit && <figcaption>{t.cover_credit}</figcaption>}
            </figure>
          )}
          {t.original_title && <p className="tl-orig-title" dir="ltr">{t.original_title}</p>}

          <div className="tl-notice">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
            <span>
              <strong>{MACHINE_NOTE}.</strong>{" "}
              {t.mode === "summary"
                ? "هذا ملخّص مترجم يعرض أبرز ما في المادة الأصلية؛ للنص الكامل يُرجى الرجوع إلى المصدر."
                : "النص ترجمة كاملة لمادة منشورة برخصة مفتوحة تسمح بترجمتها."}
            </span>
          </div>

          <div className="tl-prose">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {(src.name || src.href) && (
            <div className="tl-source">
              <span className="tl-source-ico" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              </span>
              <div>
                <div className="tl-source-k">المادة الأصلية{t.author ? ` — ${t.author}` : ""}</div>
                <div className="tl-source-v">{src.name ?? src.href}</div>
                {lic.name && (
                  <div className="tl-source-lic">
                    الرخصة:{" "}
                    {lic.href ? (
                      <a href={lic.href} target="_blank" rel="noopener noreferrer" dir="ltr">{lic.name}</a>
                    ) : (
                      <bdi>{lic.name}</bdi>
                    )}
                  </div>
                )}
              </div>
              {src.href && (
                <a href={src.href} className="btn btn-primary btn-md" target="_blank" rel="noopener noreferrer">
                  اقرأ الأصل ↗
                </a>
              )}
            </div>
          )}

          <div className="bl-after nw-after">
            <Link href={TRANSLATIONS_PATH} className="arrow-link">
              <span className="arrow-link__a" aria-hidden>→</span>
              العودة إلى الترجمات
            </Link>
          </div>
        </article>

        <aside className="tl-facts" aria-label="بيانات المادة">
          <dl>
            {t.category && <div><dt>التصنيف</dt><dd>{t.category}</dd></div>}
            <div><dt>النوع</dt><dd>{modeLabel(t.mode)}</dd></div>
            <div><dt>عدد الكلمات</dt><dd>{formatCount(t.word_count)} كلمة</dd></div>
            <div><dt>لغة الأصل</dt><dd>{languageLabel(t.source_language)}</dd></div>
            {t.published_at && <div><dt>تاريخ النشر</dt><dd>{formatArabicDate(t.published_at)}</dd></div>}
          </dl>
          <a href={`${TRANSLATIONS_PATH}/${t.slug}/print`} target="_blank" rel="noopener" className="btn btn-secondary btn-md">
            تحميل PDF
          </a>
          <div className="tl-facts-share">
            <span>شارك المادة</span>
            <div>
              {share.map((s) => (
                <a key={s.key} className="bl-share-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {more.length > 0 && (
        <section className="dp-shade" data-reveal="1">
          <div className="dp-sec">
            <SectionHead eyebrow="اقرأ أيضاً" title="ترجمات أخرى" />
            <div>
              {more.map((x) => (
                <TranslationRow key={x.id} item={x} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="dp-sec" style={{ paddingBottom: "clamp(56px,7vw,84px)" }}>
        <DetailPager
          all={{ href: TRANSLATIONS_PATH, label: "كل الترجمات" }}
          prev={newer ? { href: `${TRANSLATIONS_PATH}/${newer.slug}`, label: "الأحدث", title: newer.title } : null}
          next={older ? { href: `${TRANSLATIONS_PATH}/${older.slug}`, label: "الأقدم", title: older.title } : null}
        />
      </section>
    </PageShell>
  );
}
