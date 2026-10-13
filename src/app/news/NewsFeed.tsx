"use client";

import { useState } from "react";
import type { NewsItem } from "@/lib/types";
import { dateParts } from "@/lib/format";
import { NEWS_KINDS, NEWS_KIND_LABELS } from "@/lib/news";
import NewsRow from "./NewsRow";

/**
 * The /news feed with its type filter, grouped under month headings so it
 * reads as a record kept over time. Filtering happens in the browser so the
 * page stays statically generated (ISR); a type with no published items is
 * not offered as a tab, and the tabs disappear when only one type exists.
 */
export default function NewsFeed({ items }: { items: NewsItem[] }) {
  const [kind, setKind] = useState<string>("all");
  const present = NEWS_KINDS.filter((k) => items.some((n) => n.kind === k));
  const shown = kind === "all" ? items : items.filter((n) => n.kind === kind);

  const groups: { label: string; items: NewsItem[] }[] = [];
  for (const n of shown) {
    const d = dateParts(n.published_at);
    const label = d ? `${d.month} ${d.year}` : "دون تاريخ";
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(n);
    else groups.push({ label, items: [n] });
  }

  return (
    <>
      {present.length > 1 && (
        <div className="nw-filter" role="tablist" aria-label="تصفية الأخبار حسب النوع">
          {[["all", "الكل"] as const, ...present.map((k) => [k, NEWS_KIND_LABELS[k]] as const)].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={kind === key}
              className={`nw-tab${kind === key ? " is-active" : ""}`}
              onClick={() => setKind(key)}
            >
              {key !== "all" && <span className={`nw-tab-dot is-${key}`} aria-hidden />}
              {label}
            </button>
          ))}
        </div>
      )}
      {groups.map((g) => (
        <section key={g.label} className="nw-group" aria-label={g.label}>
          <h2 className="nw-month">{g.label}</h2>
          {g.items.map((n) => (
            <NewsRow key={n.id} item={n} />
          ))}
        </section>
      ))}
    </>
  );
}
