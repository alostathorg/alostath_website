import Link from "next/link";

/**
 * The four pieces a detail page is composed from.
 *
 * Each of the four detail pages (award, initiative, post, partner) used to
 * hand-roll its own chapter headings — the same thirteen-pixel gold eyebrow
 * inline-styled a dozen times — and its own prev/next pager, inline SVG arrows
 * and all. They now share these, so a change to the rhythm of a detail page is
 * one edit rather than four, and no page can drift.
 *
 *   SectionHead   numbered chapter head: the spine the page is strung on
 *   DetailFigure  the editorial plate that shows the photograph
 *   Monument      the dark statement block, cut from the hero's material
 *   DetailPager   prev · all · next, on a hairline
 *
 * Styles live in the «Detail-page composition» block of design-system.css.
 */

export type Tone = "gold" | "sage";

/** `3` → `03`. The site sets Western digits everywhere; see lib/format.ts. */
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A chapter head. `index` prints the mono numeral chip that indexes the page —
 * omit it for a closing statement, which isn't a chapter. `title` is optional
 * too: a chapter whose content is one paragraph needs only the kicker line.
 */
export function SectionHead({
  index,
  eyebrow,
  title,
  tone = "gold",
  center = false,
  onDark = false,
}: {
  index?: number;
  eyebrow: string;
  title?: React.ReactNode;
  tone?: Tone;
  center?: boolean;
  onDark?: boolean;
}) {
  const cls = [
    "dp-head",
    tone === "sage" && !onDark ? "is-sage" : "",
    center ? "is-center" : "",
    onDark ? "on-dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={cls}>
      <div className="dp-head-kicker">
        {index !== undefined && <span className="dp-head-num">{pad(index)}</span>}
        <span className="dp-head-eyebrow">{eyebrow}</span>
        <span className="dp-head-rule" aria-hidden />
      </div>
      {title && <h2 className="dp-head-title">{title}</h2>}
    </header>
  );
}

/**
 * The photograph, finally. Awards and initiatives carry a `hero_image_url`
 * that only their index page ever showed; this mounts it on the tinted shelf
 * the listing rows use, captioned.
 *
 * `mark` sets a contained logo on a light well instead of cropping it to the
 * letterbox — مُشير has a wordmark where the others have a photograph.
 */
export function DetailFigure({
  src,
  alt,
  caption,
  tone = "gold",
  mark = false,
  ratio,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  tone?: Tone;
  mark?: boolean;
  /** CSS aspect-ratio for the plate. Defaults to the 2.1/1 letterbox. */
  ratio?: string;
}) {
  return (
    <figure
      className={`dp-figure${tone === "sage" ? " is-sage" : ""}`}
      style={ratio ? ({ ["--dp-figure-ratio" as string]: ratio }) : undefined}
    >
      <div className="dp-figure-mount">
        <div className={`dp-figure-plate media-zoom${mark ? " is-mark" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
      {caption && <figcaption className="dp-figcaption">{caption}</figcaption>}
    </figure>
  );
}

/**
 * The dark statement block. Same gradient, gold horizon, orb and masked
 * watermark as the hero, so a page that has been light for two screens returns
 * to the brand's stage exactly once — for the thing worth stopping on (الهدف,
 * تكاملٌ وطني, الخطوة التالية).
 */
export function Monument({
  head,
  quote,
  note,
  actions,
  fine,
  media,
  tone = "gold",
  center = false,
}: {
  /** Usually a <SectionHead onDark />. */
  head?: React.ReactNode;
  quote: React.ReactNode;
  note?: React.ReactNode;
  actions?: React.ReactNode;
  /** Small print under the actions — the الإعلامات disclaimer, say. */
  fine?: React.ReactNode;
  /** Anything that sits above the head — the partner's logo plate. */
  media?: React.ReactNode;
  tone?: Tone;
  center?: boolean;
}) {
  const cls = ["dp-monument", tone === "sage" ? "is-sage" : "", center ? "is-center" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      <span className="dp-monument-orb" aria-hidden />
      {media}
      <div className="dp-monument-in">
        {head}
        <p className="dp-monument-q">{quote}</p>
        {note && <p className="dp-monument-note">{note}</p>}
      </div>
      {actions && <div className="dp-monument-actions">{actions}</div>}
      {fine && <p className="dp-monument-fine">{fine}</p>}
    </div>
  );
}

function Chevron({ back }: { back: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points={back ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
    </svg>
  );
}

export type PagerLink = { href: string; label: string; title: string };

/**
 * The closing rail: previous on the inline-start, the way back to the listing
 * in the middle, next on the inline-end. Either side may be absent — a page
 * with a single sibling still gets a rail rather than one lonely card.
 */
export function DetailPager({
  prev,
  next,
  all,
}: {
  prev?: PagerLink | null;
  next?: PagerLink | null;
  all: { href: string; label: string };
}) {
  if (!prev && !next) return null;
  return (
    <nav className="dp-rail" aria-label="تصفّح الصفحات">
      {prev ? (
        <Link href={prev.href} className="dp-pager is-prev">
          <span className="dp-pager-arrow">
            <Chevron back />
          </span>
          <span className="dp-pager-text">
            <div className="k">{prev.label}</div>
            <div className="t">{prev.title}</div>
          </span>
        </Link>
      ) : null}

      <Link href={all.href} className="dp-rail-all">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        {all.label}
      </Link>

      {next ? (
        <Link href={next.href} className="dp-pager is-next">
          <span className="dp-pager-text">
            <div className="k">{next.label}</div>
            <div className="t">{next.title}</div>
          </span>
          <span className="dp-pager-arrow">
            <Chevron back={false} />
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
