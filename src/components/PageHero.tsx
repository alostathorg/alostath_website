import Link from "next/link";

export type HeroCrumb = { label: string; href?: string };

/**
 * The one hero every page opens with.
 *
 * Before this component the site had three different heroes — a flat olive
 * band on the index pages, the gradient `.dp-hero` on the detail pages, and a
 * bespoke photo stage on the home page — each with its own padding, watermark
 * placement, type scale and eyebrow style. They are now a single stage in
 * three densities:
 *
 *   md  — index / standalone pages (الجوائز، المبادرات، المدونة، من نحن …)
 *   lg  — detail pages, which carry a breadcrumb, a badge and the facts card
 *   xl  — the home page, the only full-height one
 *
 * Everything else is a slot. A page supplies content, never chrome: the
 * gradient, the two light orbs, the brand watermark, the gold rule under the
 * title and the horizon hairline at the bottom edge are the component's.
 */
export default function PageHero({
  id,
  size = "md",
  tone = "gold",
  crumbs,
  eyebrow,
  live = false,
  badge,
  title,
  accent,
  titleMax,
  lede,
  note,
  meta,
  actions,
  below,
  aside,
  image,
  imageOpacity = 0.38,
  full = false,
  scrollCue,
}: {
  id?: string;
  /** Density. See the note above. */
  size?: "md" | "lg" | "xl";
  /** Accent hue for the eyebrow, the rule and the accent title line. */
  tone?: "gold" | "sage";
  crumbs?: HeroCrumb[];
  eyebrow?: React.ReactNode;
  /** Pulsing dot before the eyebrow — for things happening now. */
  live?: boolean;
  /** Custom pill markup in the eyebrow's place (detail pages). */
  badge?: React.ReactNode;
  title: React.ReactNode;
  /** Second title line, in the accent colour. */
  accent?: React.ReactNode;
  /** Override the title's measure when a short title would otherwise wrap. */
  titleMax?: string;
  lede?: React.ReactNode;
  /** Smaller supporting paragraph under the lede. */
  note?: React.ReactNode;
  /** Status chip or similar, between the lede and the buttons. */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** Full-width row under the buttons — jump pills, and the like. */
  below?: React.ReactNode;
  /** Inline-end column: the partner logo plate. */
  aside?: React.ReactNode;
  /** Background photograph, scrimmed for contrast behind the text column. */
  image?: string | null;
  imageOpacity?: number;
  /** Full-viewport stage. The home page only. */
  full?: boolean;
  /** href for the «تصفّح» cue at the bottom edge. */
  scrollCue?: string;
}) {
  return (
    <section
      id={id}
      data-hero
      data-size={size}
      data-tone={tone}
      {...(image ? { "data-photo": "" } : {})}
      className={`ph${full ? " ph-full" : ""}`}
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="ph-photo" src={image} alt="" aria-hidden style={{ opacity: imageOpacity }} />
      )}
      <span className="ph-orb ph-orb-gold" aria-hidden />
      <span className="ph-orb ph-orb-sage" aria-hidden />
      <span className="ph-mark" aria-hidden />

      <div className={`ph-inner hero-in${aside ? " ph-has-aside" : ""}`}>
        <div className="ph-col">
          {crumbs && crumbs.length > 0 && (
            <nav className="ph-crumbs" aria-label="مسار التصفّح">
              {crumbs.map((c, i) => (
                <span key={i} className="ph-crumb">
                  {i > 0 && (
                    <span className="ph-crumb-sep" aria-hidden>
                      /
                    </span>
                  )}
                  {c.href ? (
                    <Link href={c.href}>{c.label}</Link>
                  ) : (
                    <span aria-current="page">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {badge ?? (
            eyebrow && (
              <div className="ph-eyebrow">
                {live && <span className="live-dot" />}
                {eyebrow}
              </div>
            )
          )}

          <h1 className="ph-title" style={titleMax ? { maxWidth: titleMax } : undefined}>
            {title}
            {accent && <span className="ph-accent">{accent}</span>}
          </h1>

          <div className="ph-rule" />

          {lede && <p className="ph-lede">{lede}</p>}
          {note && <p className="ph-note">{note}</p>}
          {meta && <div className="ph-meta">{meta}</div>}
          {actions && <div className="ph-actions">{actions}</div>}
          {below && <div className="ph-below">{below}</div>}
        </div>

        {aside && <div className="ph-aside">{aside}</div>}
      </div>

      {scrollCue && (
        <a href={scrollCue} className="scroll-cue" aria-label="تصفّح للأسفل">
          <span>تصفّح</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M19 12l-7 7-7-7" />
          </svg>
        </a>
      )}
    </section>
  );
}
