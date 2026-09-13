import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getPosts } from "@/lib/queries";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = { title: "المدونة" };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <PageShell active="blog">
      <PageHero
        eyebrow="مقالات وأخبار"
        title="مدونة الأستاذ"
        lede="قراءاتٌ وتحليلاتٌ ومستجدّاتٌ حول مكانة المعلّم، ومبادرات المنظومة وأثرها في خدمة التعليم."
      />

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
