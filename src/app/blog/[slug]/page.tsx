import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { DetailPager, SectionHead } from "@/components/DetailKit";
import { getPost, getPosts } from "@/lib/queries";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ostath.sa";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post?.title ?? "المدونة", description: post?.excerpt ?? undefined };
}

/**
 * Reading time, in the Arabic a reader would say it: دقيقة واحدة، دقيقتان،
 * ثلاث→عشر دقائق، then back to the singular for eleven and up. 180 words a
 * minute is the usual figure for Arabic prose.
 */
function readingTime(body: string[]): string {
  const words = body.join(" ").trim().split(/\s+/).filter(Boolean).length;
  const min = Math.max(1, Math.round(words / 180));
  if (min === 1) return "قراءة في دقيقة واحدة";
  if (min === 2) return "قراءة في دقيقتين";
  if (min <= 10) return `قراءة في ${min} دقائق`;
  return `قراءة في ${min} دقيقة`;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  // getPosts() is newest first, so the *previous* article is the next one down.
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx !== -1 && idx < all.length - 1 ? all[idx + 1] : null;
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  const url = new URL(`/blog/${post.slug}`, SITE).toString();
  const share = [
    {
      key: "x",
      label: "شارك على إكس",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`,
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
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${url}`)}`,
      icon: <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.13-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12s-.64.8-.78.97c-.15.16-.29.18-.53.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.32.08-.16.04-.3-.02-.42l-.76-1.83c-.2-.47-.4-.4-.55-.41h-.47a.9.9 0 0 0-.65.3 2.73 2.73 0 0 0-.85 2.03c0 1.2.87 2.35.99 2.51.12.16 1.71 2.61 4.15 3.66 1.55.67 2.15.72 2.92.61.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29z" />,
    },
  ];

  return (
    <PageShell active="blog">
      {/* The line under the header edge that tracks how far into the article
          the reader is. Wired up in SiteChrome. */}
      <div className="read-bar" data-read-progress aria-hidden>
        <span />
      </div>

      <PageHero
        crumbs={[{ label: "المدونة", href: "/blog" }, { label: post.title }]}
        eyebrow={post.category}
        title={post.title}
        image={post.cover_url}
        imageOpacity={0.34}
        lede={post.excerpt || undefined}
        meta={<div className="ph-date">{formatArabicDate(post.published_at)}</div>}
      />

      <article className="post-wrap" data-read-target>
        <div className="post-meta">
          {post.category && <span className="post-meta-chip">{post.category}</span>}
          <span className="post-meta-item">{formatArabicDate(post.published_at)}</span>
          <span className="post-meta-dot" aria-hidden />
          <span className="post-meta-item">{readingTime(post.body)}</span>
          <div className="post-meta-share">
            {share.map((s) => (
              <a
                key={s.key}
                className="post-share-btn"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{s.icon}</svg>
              </a>
            ))}
          </div>
        </div>

        <div className="post-rule" aria-hidden />

        <div className="post-body">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="post-end">
          <Link href="/blog" className="arrow-link">
            <span className="arrow-link__a" aria-hidden>→</span>
            العودة إلى المدونة
          </Link>
          <div className="post-meta-share">
            {share.map((s) => (
              <a
                key={s.key}
                className="post-share-btn"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{s.icon}</svg>
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* MORE — the article no longer ends in a dead end */}
      {more.length > 0 && (
        <section className="dp-shade" data-reveal="1">
          <div className="dp-sec">
            <SectionHead eyebrow="اقرأ أيضاً" title="من المدونة" />
            <div className="blog-grid is-fit" data-reveal-group>
              {more.map((p) => (
                <Link key={p.id} className="blog-card" href={`/blog/${p.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="blog-card-img" src={p.cover_url ?? "/assets/alostath-logo.png"} alt={p.title} loading="lazy" />
                  <div className="blog-card-body">
                    <div className="blog-card-cat">{p.category}</div>
                    <h3 className="blog-card-title">{p.title}</h3>
                    <p className="blog-card-excerpt">{p.excerpt}</p>
                    <div className="blog-card-date">{formatArabicDate(p.published_at)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RAIL */}
      <section className="dp-sec" style={{ paddingBottom: "clamp(56px,7vw,84px)" }}>
        <DetailPager
          all={{ href: "/blog", label: "كل المقالات" }}
          prev={newer ? { href: `/blog/${newer.slug}`, label: "المقال الأحدث", title: newer.title } : null}
          next={older ? { href: `/blog/${older.slug}`, label: "المقال السابق", title: older.title } : null}
        />
      </section>
    </PageShell>
  );
}
