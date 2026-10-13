import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { formatArabicDate } from "@/lib/format";
import { NEWS_PATH, newsKindLabel, sourceFor } from "@/lib/news";

const FALLBACK_COVER = "/assets/alostath-logo.png";

/**
 * One news card. `wide` is the pinned item at the top of /news: image beside
 * the text instead of above it. Media coverage names its outlet in the footer,
 * so a reader knows before clicking that the story was told elsewhere first.
 */
export default function NewsCard({ item, wide = false }: { item: NewsItem; wide?: boolean }) {
  const source = item.kind === "media" ? sourceFor(item).name : null;
  return (
    <Link href={`${NEWS_PATH}/${item.slug}`} className={`news-card${wide ? " is-wide" : ""}`}>
      <div className="news-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.cover_url ?? FALLBACK_COVER} alt={item.title} loading={wide ? undefined : "lazy"} />
      </div>
      <div className="news-card-body">
        <div className="news-card-meta">
          <span className={`badge ${item.kind === "announcement" ? "badge-gold" : item.kind === "media" ? "badge-sage" : "badge-olive"}`}>
            {newsKindLabel(item.kind)}
          </span>
          {item.pinned && wide && <span className="news-card-pin">مثبّت</span>}
        </div>
        <h3 className="news-card-title">{item.title}</h3>
        {item.excerpt && <p className="news-card-excerpt">{item.excerpt}</p>}
        <div className="news-card-foot">
          <span>{formatArabicDate(item.published_at)}</span>
          {source && (
            <>
              <span className="bl-dot" aria-hidden />
              <span>{source}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
