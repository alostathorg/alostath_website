// «الأخبار» — shared vocabulary for the news section. The public pages, the
// home page, the nav and the admin collection all read from here so a rename
// or a new news type is a one-file change.

import type { NewsItem } from "@/lib/types";
import { normalizeExternalUrl, hostnameOf, text } from "@/lib/brandPartners";

/** The nav / section label. */
export const NEWS_NAV_LABEL = "الأخبار";

/** Public route of the section. */
export const NEWS_PATH = "/news";

export const NEWS_KIND_LABELS: Record<string, string> = {
  news: "أخبار المؤسسة",
  announcement: "إعلانات",
  media: "في الإعلام",
};
export const NEWS_KINDS = Object.keys(NEWS_KIND_LABELS);

export const newsKindLabel = (key: string | null | undefined) =>
  NEWS_KIND_LABELS[key ?? ""] ?? NEWS_KIND_LABELS.news;

/**
 * Where a media-coverage item points: the original story, safe to render as an
 * outbound href, with the outlet name to show beside it. `href` is null when no
 * usable link was entered; the name falls back to the link's hostname.
 */
export function sourceFor(n: Pick<NewsItem, "source_name" | "source_url">) {
  const href = normalizeExternalUrl(n.source_url);
  return { href, name: text(n.source_name) ?? hostnameOf(href) };
}
