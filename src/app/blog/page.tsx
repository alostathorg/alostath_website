import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getPosts } from "@/lib/queries";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = { title: "المدونة" };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <PageShell active="blog">
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" aria-hidden style={{ position: "absolute", top: "50%", left: -60, transform: "translateY(-50%)", width: "min(820px,72%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "104px 32px 64px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16 }}>مقالات وأخبار</div>
          <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.15, margin: 0, maxWidth: "18ch" }}>مدونة الأستاذ</h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "24px 0 0", maxWidth: "64ch" }}>قراءاتٌ وتحليلاتٌ ومستجدّاتٌ حول مكانة المعلّم، ومبادرات المنظومة وأثرها في خدمة التعليم.</p>
        </div>
      </section>

      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "64px 32px 96px" }}>
        {posts.length === 0 ? (
          <p style={{ fontSize: 18, color: "var(--text-muted)", textAlign: "center" }}>لا توجد مقالات منشورة بعد.</p>
        ) : (
          <div className="blog-grid" data-reveal="1">
            {posts.map((p) => (
              <Link key={p.id} className="blog-card" href={`/blog/${p.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="blog-card-img" src={p.cover_url ?? "/assets/alostath-logo.png"} alt={p.title} />
                <div className="blog-card-body">
                  <div className="blog-card-cat">{p.category}</div>
                  <h2 className="blog-card-title">{p.title}</h2>
                  <p className="blog-card-excerpt">{p.excerpt}</p>
                  <div className="blog-card-date">{formatArabicDate(p.published_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
