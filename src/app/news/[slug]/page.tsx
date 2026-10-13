import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { DetailPager, SectionHead } from "@/components/DetailKit";
import { getNews, getNewsItem } from "@/lib/queries";
import { formatArabicDate } from "@/lib/format";
import { NEWS_NAV_LABEL, NEWS_PATH, newsKindLabel, sourceFor } from "@/lib/news";
import NewsRow from "../NewsRow";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ostath.sa";

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  return { title: item?.title ?? NEWS_NAV_LABEL, description: item?.excerpt ?? undefined };
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, all] = await Promise.all([getNewsItem(slug), getNews()]);
  if (!item) notFound();

  // The pager walks the timeline, not the pinned-first list order.
  const timeline = [...all].sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  const idx = timeline.findIndex((n) => n.slug === item.slug);
  const newer = idx > 0 ? timeline[idx - 1] : null;
  const older = idx !== -1 && idx < timeline.length - 1 ? timeline[idx + 1] : null;
  const more = timeline.filter((n) => n.slug !== item.slug).slice(0, 3);

  const source = item.kind === "media" ? sourceFor(item) : null;
  const url = new URL(`${NEWS_PATH}/${item.slug}`, SITE).toString();
  const share = [
    {
      key: "x",
      label: "شارك على إكس",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(url)}`,
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
      href: `https://wa.me/?text=${encodeURIComponent(`${item.title} — ${url}`)}`,
      icon: <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.13-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12s-.64.8-.78.97c-.15.16-.29.18-.53.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.32.08-.16.04-.3-.02-.42l-.76-1.83c-.2-.47-.4-.4-.55-.41h-.47a.9.9 0 0 0-.65.3 2.73 2.73 0 0 0-.85 2.03c0 1.2.87 2.35.99 2.51.12.16 1.71 2.61 4.15 3.66 1.55.67 2.15.72 2.92.61.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29z" />,
    },
  ];
  return (
    <PageShell active="news">
      <div className="read-bar" data-read-progress aria-hidden>
        <span />
      </div>

      <PageHero
        crumbs={[{ label: NEWS_NAV_LABEL, href: NEWS_PATH }, { label: item.title }]}
        eyebrow={newsKindLabel(item.kind)}
        title={item.title}
        image={item.cover_url}
        lede={item.excerpt || undefined}
        meta={
          <div className="bl-hero-meta">
            <span>{formatArabicDate(item.published_at)}</span>
            {source?.name && (
              <>
                <span className="bl-dot" aria-hidden />
                <span>{source.name}</span>
              </>
            )}
          </div>
        }
      />

      <div className="nw-wrap nw-item">
        <article className="nw-item-main" data-read-target>
          {source?.name && (
            <div className="nw-source">
              <span className="nw-source-ico" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg>
              </span>
              <div>
                <div className="nw-source-k">نُشر هذا الخبر في</div>
                <div className="nw-source-v">{source.name}</div>
              </div>
              {source.href && (
                <a href={source.href} className="btn btn-primary btn-md" target="_blank" rel="noopener noreferrer">
                  اقرأ الخبر في مصدره ↗
                </a>
              )}
            </div>
          )}

          {item.body.length > 0 && (
            <div className="nw-prose">
              {item.body.map((para, i) => (
                <p key={i}>
                  {/* A wire-style dateline opens the foundation's own releases. */}
                  {i === 0 && item.kind !== "media" && item.published_at && (
                    <span className="nw-dateline">{formatArabicDate(item.published_at)} — </span>
                  )}
                  {para}
                </p>
              ))}
            </div>
          )}

          <div className="bl-after nw-after">
            <Link href={NEWS_PATH} className="arrow-link">
              <span className="arrow-link__a" aria-hidden>→</span>
              العودة إلى الأخبار
            </Link>
          </div>
        </article>

        <aside className="nw-facts" aria-label="بيانات الخبر">
          <dl>
            <div><dt>النوع</dt><dd><span className={`nw-kind is-${item.kind ?? "news"}`}>{newsKindLabel(item.kind)}</span></dd></div>
            <div><dt>التاريخ</dt><dd>{formatArabicDate(item.published_at)}</dd></div>
            {source?.name && <div><dt>المصدر</dt><dd>{source.name}</dd></div>}
          </dl>
          <div className="nw-facts-share">
            <span>شارك الخبر</span>
            <div>
              {share.map((s) => (
                <a key={s.key} className="bl-share-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>
          <Link href="/press" className="nw-facts-press">
            <span>
              <strong>للإعلاميين</strong>
              الملف الإعلامي والهوية البصرية
            </span>
            <span aria-hidden>←</span>
          </Link>
        </aside>
      </div>

      {more.length > 0 && (
        <section className="dp-shade" data-reveal="1">
          <div className="dp-sec">
            <SectionHead eyebrow="أخبار أخرى" title="آخر الأخبار" />
            <div className="nw-more" data-reveal-group>
              {more.map((n) => (
                <NewsRow key={n.id} item={n} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="dp-sec" style={{ paddingBottom: "clamp(56px,7vw,84px)" }}>
        <DetailPager
          all={{ href: NEWS_PATH, label: "كل الأخبار" }}
          prev={newer ? { href: `${NEWS_PATH}/${newer.slug}`, label: "الخبر الأحدث", title: newer.title } : null}
          next={older ? { href: `${NEWS_PATH}/${older.slug}`, label: "الخبر السابق", title: older.title } : null}
        />
      </section>
    </PageShell>
  );
}
