import Link from "next/link";
import type { BrandPartner } from "@/lib/types";
import { PARTNERS_PATH, blurbFor, categoryLabel, ctaFor, pricingLabel, text } from "@/lib/brandPartners";
import { PartnerLogo } from "./PartnerBits";

/**
 * A brand in the directory. When the brand has a teacher offer it hangs off
 * the card as a voucher — perforated edge, the offer, and its code — because
 * the offer is what a teacher came to the page for.
 */
export default function PartnerCard({ p }: { p: BrandPartner }) {
  const offer = text(p.teacher_offer);
  const code = text(p.offer_code);
  const { hostname } = ctaFor(p);
  return (
    <Link href={`${PARTNERS_PATH}/${p.slug}`} className={`pt-card${p.featured ? " is-featured" : ""}`}>
      <div className="pt-well">
        <PartnerLogo partner={p} />
        <span className="pt-cat">{categoryLabel(p.category)}</span>
        {p.featured && <span className="pt-flag"><span className="live-dot" />شريك مميّز</span>}
      </div>
      <div className="pt-body">
        <div className="pt-title-row">
          <h3 className="pt-name">{p.name}</h3>
          <span className={`pt-price is-${p.pricing ?? "paid"}`}>{pricingLabel(p.pricing)}</span>
        </div>
        <p className="pt-tagline">{blurbFor(p)}</p>
        {offer && (
          <div className="pt-voucher">
            <span className="pt-voucher-k">عرض المعلّم</span>
            <strong>{offer}</strong>
            {code && <code dir="ltr">{code}</code>}
          </div>
        )}
        <div className="pt-foot">
          {hostname ? <span className="pt-domain" dir="ltr">{hostname}</span> : <span />}
          <span className="pt-go">
            تعرّف على الشريك
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
