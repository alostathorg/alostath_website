"use client";

import { useState } from "react";
import type { BrandPartner } from "@/lib/types";
import { BRAND_CATEGORIES, categoryLabel, text } from "@/lib/brandPartners";
import PartnerCard from "./PartnerCard";

/**
 * The directory with its filters: a category row (only categories that have
 * a published brand), and a switch for brands that carry a teacher offer.
 * Filtering runs in the browser so the page stays statically generated.
 */
export default function PartnersDirectory({ partners }: { partners: BrandPartner[] }) {
  const [cat, setCat] = useState("all");
  const [offersOnly, setOffersOnly] = useState(false);
  const cats = BRAND_CATEGORIES.filter((c) => partners.some((p) => p.category === c));
  const withOffer = partners.filter((p) => text(p.teacher_offer)).length;
  const shown = partners
    .filter((p) => cat === "all" || p.category === cat)
    .filter((p) => !offersOnly || text(p.teacher_offer));

  return (
    <>
      <div className="pt-toolbar">
        {cats.length > 1 && (
          <div className="pt-chips" role="tablist" aria-label="تصفية حسب الفئة">
            {[["all", "الكل"], ...cats.map((c) => [c, categoryLabel(c)])].map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={cat === key}
                className={`chip${cat === key ? " is-active" : ""}`}
                onClick={() => setCat(key)}
              >
                {label}
                <span className="chip-n">{key === "all" ? partners.length : partners.filter((p) => p.category === key).length}</span>
              </button>
            ))}
          </div>
        )}
        {withOffer > 0 && withOffer < partners.length && (
          <label className="pt-switch">
            <input type="checkbox" checked={offersOnly} onChange={(e) => setOffersOnly(e.target.checked)} />
            <span className="pt-switch-track" aria-hidden />
            بعروضٍ خاصة للمعلّم
          </label>
        )}
      </div>
      {shown.length > 0 ? (
        <div className="pt-grid">
          {shown.map((p) => (
            <PartnerCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p className="pt-none">لا توجد علاماتٌ تطابق هذا الاختيار.</p>
      )}
    </>
  );
}
