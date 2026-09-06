import Link from "next/link";
import type { BrandPartner } from "@/lib/types";
import { ctaFor, monogramOf, text } from "@/lib/brandPartners";

/** ↗ glyph appended to every outbound button so a teacher knows they are leaving the site. */
export function ExternalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/**
 * The brand mark, contained inside whatever well wraps it (card well, hero
 * plate, closing plate). Any aspect ratio works because the well sets max
 * width/height and the image keeps its own proportions. No logo → monogram.
 */
export function PartnerLogo({ partner, eager = false }: { partner: Pick<BrandPartner, "name" | "logo_url">; eager?: boolean }) {
  const src = text(partner.logo_url);
  if (!src) {
    return <span className="bp-monogram" aria-hidden>{monogramOf(partner.name)}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={partner.name} loading={eager ? "eager" : "lazy"} decoding="async" />
  );
}

/**
 * The outbound CTA — one source of truth for where it goes and what it says.
 * `fallback` decides what renders when the brand has no usable URL yet:
 *   "disabled" → an inert «الرابط قريباً» pill (hero),
 *   "contact"  → a link to /contact (closing band),
 *   "none"     → nothing (offer panel).
 */
export function PartnerCta({
  partner,
  className,
  fallback = "contact",
}: {
  partner: Pick<BrandPartner, "cta_url" | "website_url" | "cta_label" | "name">;
  className: string;
  fallback?: "disabled" | "contact" | "none";
}) {
  const { href, label } = ctaFor(partner);
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} bp-ext`}
        aria-label={`${label} — يفتح في نافذة جديدة`}
      >
        {label}
        <ExternalIcon />
      </a>
    );
  }
  if (fallback === "none") return null;
  if (fallback === "disabled") {
    // A status pill in the button's footprint — not a control, so no aria-disabled.
    return <span className={`${className} bp-cta-soon`}>الرابط قريباً</span>;
  }
  return (
    <Link href="/contact" className={className}>
      اسأل عن هذا الشريك
    </Link>
  );
}
