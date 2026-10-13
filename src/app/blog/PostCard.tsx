import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatArabicDate, readingTime } from "@/lib/format";

/**
 * One article, in one of two cuts: `lead` is the magazine cover story — the
 * photograph beside a large headline — and the default is the grid card.
 */
export default function PostCard({ post, lead = false, headingLevel = 2 }: { post: BlogPost; lead?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link href={`/blog/${post.slug}`} className={`bl-card${lead ? " is-lead" : ""}`}>
      <div className="bl-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.cover_url ?? "/assets/alostath-logo.png"} alt="" loading={lead ? "eager" : "lazy"} />
        {post.category && <span className="bl-card-cat">{post.category}</span>}
      </div>
      <div className="bl-card-body">
        {lead && <span className="bl-card-kicker">المقال الأحدث</span>}
        <H className="bl-card-title">{post.title}</H>
        {post.excerpt && <p className="bl-card-excerpt">{post.excerpt}</p>}
        <div className="bl-card-foot">
          <span>{formatArabicDate(post.published_at)}</span>
          <span className="bl-dot" aria-hidden />
          <span>{readingTime(post.body)}</span>
          <span className="bl-card-go" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
