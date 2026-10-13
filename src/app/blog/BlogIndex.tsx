"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/types";
import PostCard from "./PostCard";

/**
 * The magazine: a category filter, the newest article as the cover story,
 * and the rest on the grid. Filtering runs in the browser so the page stays
 * statically generated; the filter only appears once there are two
 * categories to choose between.
 */
export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [cat, setCat] = useState("all");
  const cats = [...new Set(posts.map((p) => p.category).filter((c): c is string => !!c))];
  const shown = cat === "all" ? posts : posts.filter((p) => p.category === cat);
  const [lead, ...rest] = shown;

  return (
    <>
      {cats.length > 1 && (
        <div className="bl-filter" role="tablist" aria-label="تصفية المقالات حسب التصنيف">
          {[["all", "كل المقالات"], ...cats.map((c) => [c, c])].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={cat === key}
              className={`bl-chip${cat === key ? " is-active" : ""}`}
              onClick={() => setCat(key)}
            >
              {label}
              <span className="bl-chip-n">{key === "all" ? posts.length : posts.filter((p) => p.category === key).length}</span>
            </button>
          ))}
        </div>
      )}
      {lead && <PostCard key={lead.id} post={lead} lead />}
      {rest.length > 0 && (
        <div className="bl-grid">
          {rest.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </>
  );
}
