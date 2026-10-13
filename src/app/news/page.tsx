import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getNews, getSettings } from "@/lib/queries";
import { NEWS_NAV_LABEL } from "@/lib/news";
import NewsCard from "./NewsCard";
import NewsFeed from "./NewsFeed";

export const revalidate = 60;
export const metadata: Metadata = {
  title: NEWS_NAV_LABEL,
  description: "آخر أخبار مؤسسة الأستاذ وإعلاناتها، وما تناولته وسائل الإعلام عن المؤسسة وبرامجها.",
};

export default async function NewsPage() {
  const [news, settings] = await Promise.all([getNews(), getSettings()]);
  const email = (settings.contact as Record<string, string> | undefined)?.email ?? "contact@ostath.sa";
  // getNews() returns pinned items first; only the first one gets the wide card.
  const lead = news[0]?.pinned ? news[0] : null;
  const rest = lead ? news.slice(1) : news;

  return (
    <PageShell active="news">
      <PageHero
        eyebrow="المركز الإعلامي"
        title="أخبار الأستاذ"
        lede="آخر مستجدّات مؤسسة الأستاذ وإعلاناتها، وما تناولته وسائل الإعلام عن المؤسسة وبرامجها ومبادراتها."
      />

      <div className="nw-wrap nw-layout">
        <div className="nw-main">
          {news.length === 0 ? (
            <div className="nw-empty">
              <h2>لا توجد أخبار منشورة بعد</h2>
              <p>تابع حسابات المؤسسة لتصلك المستجدّات أولاً بأول.</p>
            </div>
          ) : (
            <>
              {lead && (
                <div className="nw-lead" data-reveal="1">
                  <NewsCard item={lead} wide />
                </div>
              )}
              {rest.length > 0 && <NewsFeed items={rest} />}
            </>
          )}
        </div>

        {/* The newsroom desk: what a journalist comes to the page for. */}
        <aside className="nw-desk" aria-label="للإعلاميين">
          <div className="nw-desk-card is-dark">
            <span className="nw-desk-k">للإعلاميين</span>
            <h2>الملف الإعلامي</h2>
            <p>الشعار والألوان والهوية البصرية وبيانات المؤسسة، جاهزةٌ للتحميل والاستخدام.</p>
            <Link href="/press" className="btn btn-secondary btn-md">الملف الإعلامي</Link>
          </div>
          <div className="nw-desk-card">
            <span className="nw-desk-k">التواصل الإعلامي</span>
            <a href={`mailto:${email}`} className="nw-desk-mail" dir="ltr">{email}</a>
            <p>للاستفسارات الصحفية وطلبات المقابلات والتغطيات.</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
