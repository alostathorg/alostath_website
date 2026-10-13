import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getNews } from "@/lib/queries";
import { NEWS_NAV_LABEL } from "@/lib/news";
import NewsCard from "./NewsCard";
import NewsFeed from "./NewsFeed";

export const revalidate = 60;
export const metadata: Metadata = {
  title: NEWS_NAV_LABEL,
  description: "آخر أخبار مؤسسة الأستاذ وإعلاناتها، وما تناولته وسائل الإعلام عن المؤسسة وبرامجها.",
};

export default async function NewsPage() {
  const news = await getNews();
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

      <section className="news-section">
        {news.length === 0 ? (
          <p className="news-empty">لا توجد أخبار منشورة بعد.</p>
        ) : (
          <>
            {lead && (
              <div className="news-lead" data-reveal="1">
                <NewsCard item={lead} wide />
              </div>
            )}
            {rest.length > 0 && <NewsFeed items={rest} />}
          </>
        )}
      </section>
    </PageShell>
  );
}
