"use client";

import { useState } from "react";
import type { Translation } from "@/lib/types";
import { TRANSLATION_CATEGORIES, formatCount } from "@/lib/translations";
import TranslationRow from "./TranslationRow";

/**
 * The /translations list with its category filter. Filtering happens in the
 * browser so the page stays statically generated (ISR); a category with
 * nothing published is not offered, and the bar disappears when only one
 * category exists.
 */
export default function TranslationsFeed({ items }: { items: Translation[] }) {
  const [cat, setCat] = useState<string>("all");
  const present = TRANSLATION_CATEGORIES.filter((c) => items.some((t) => t.category === c));
  const shown = cat === "all" ? items : items.filter((t) => t.category === cat);
  const count = (c: string) => items.filter((t) => t.category === c).length;

  return (
    <>
      {present.length > 1 && (
        <div className="tl-filter" role="tablist" aria-label="تصفية الترجمات حسب التصنيف">
          <button type="button" role="tab" aria-selected={cat === "all"} className={`tl-tab${cat === "all" ? " is-active" : ""}`} onClick={() => setCat("all")}>
            الكل<span className="tl-tab-n">{formatCount(items.length)}</span>
          </button>
          {present.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={cat === c} className={`tl-tab${cat === c ? " is-active" : ""}`} onClick={() => setCat(c)}>
              {c}<span className="tl-tab-n">{formatCount(count(c))}</span>
            </button>
          ))}
        </div>
      )}
      <div>
        {shown.map((t) => (
          <TranslationRow key={t.id} item={t} />
        ))}
      </div>
    </>
  );
}
