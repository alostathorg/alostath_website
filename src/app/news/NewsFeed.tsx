"use client";

import { useState } from "react";
import type { NewsItem } from "@/lib/types";
import { NEWS_KINDS, NEWS_KIND_LABELS } from "@/lib/news";
import NewsCard from "./NewsCard";

/**
 * The /news grid with its type filter. Filtering happens in the browser so the
 * page stays statically generated (ISR); a type with no published items is not
 * offered as a tab, and the tabs disappear entirely when only one type exists.
 */
export default function NewsFeed({ items }: { items: NewsItem[] }) {
  const [kind, setKind] = useState<string>("all");
  const present = NEWS_KINDS.filter((k) => items.some((n) => n.kind === k));
  const shown = kind === "all" ? items : items.filter((n) => n.kind === kind);

  return (
    <>
      {present.length > 1 && (
        <div className="news-filter" role="tablist" aria-label="تصفية الأخبار حسب النوع">
          <div className="seg-tabs">
            {[["all", "الكل"] as const, ...present.map((k) => [k, NEWS_KIND_LABELS[k]] as const)].map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={kind === key}
                className={`seg-tab${kind === key ? " is-active" : ""}`}
                onClick={() => setKind(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="news-grid">
        {shown.map((n) => (
          <NewsCard key={n.id} item={n} />
        ))}
      </div>
    </>
  );
}
