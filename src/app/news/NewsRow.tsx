import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { dateParts } from "@/lib/format";
import { NEWS_PATH, newsKindLabel, sourceFor } from "@/lib/news";

/**
 * One line of the newsroom feed: the date set as a block, the type, the
 * headline and a thumbnail. Media coverage names its outlet, so a reader
 * knows before clicking that the story was told elsewhere first.
 */
export default function NewsRow({ item }: { item: NewsItem }) {
  const d = dateParts(item.published_at);
  const source = item.kind === "media" ? sourceFor(item).name : null;
  return (
    <Link href={`${NEWS_PATH}/${item.slug}`} className="nw-row">
      <div className="nw-row-date" aria-hidden>
        <span className="nw-row-day">{d?.day ?? "—"}</span>
        <span className="nw-row-month">{d?.month}</span>
      </div>
      <div className="nw-row-body">
        <div className="nw-row-meta">
          <span className={`nw-kind is-${item.kind ?? "news"}`}>{newsKindLabel(item.kind)}</span>
          {source && <span className="nw-row-source">{source}</span>}
        </div>
        <h3 className="nw-row-title">{item.title}</h3>
        {item.excerpt && <p className="nw-row-excerpt">{item.excerpt}</p>}
      </div>
      {item.cover_url && (
        <div className="nw-row-thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.cover_url} alt="" loading="lazy" />
        </div>
      )}
    </Link>
  );
}
