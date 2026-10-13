import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getPosts } from "@/lib/queries";
import BlogIndex from "./BlogIndex";

export const revalidate = 60;
export const metadata: Metadata = { title: "المدونة" };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <PageShell active="blog">
      <PageHero
        eyebrow="مقالات وقراءات"
        title="مدونة الأستاذ"
        lede="قراءاتٌ وتحليلاتٌ ومستجدّاتٌ حول مكانة المعلّم، ومبادرات المنظومة وأثرها في خدمة التعليم."
      />

      <section className="bl-wrap bl-index">
        {posts.length === 0 ? (
          <div className="bl-empty">
            <span className="bl-empty-ico" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            </span>
            <h2>المقالات في الطريق</h2>
            <p>لم تُنشر مقالات بعد — تابعنا لتصلك أولى القراءات.</p>
          </div>
        ) : (
          <BlogIndex posts={posts} />
        )}
      </section>
    </PageShell>
  );
}
