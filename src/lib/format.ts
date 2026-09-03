// The site renders Arabic copy with Western (Latin) digits — 0-9, never ٠-٩.
// Two things enforce that: `ar-u-nu-latn` pins Intl's numbering system so a
// browser whose ICU defaults `ar` to `arab` still formats dates with Latin
// digits, and `toLatinDigits` normalises text that came from the CMS, where an
// editor's keyboard may have produced Arabic-Indic digits.

const AR_DATE = new Intl.DateTimeFormat("ar-u-nu-latn", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Arabic-Indic (U+0660-0669) and Extended Arabic-Indic / Persian (U+06F0-06F9).
const EASTERN_DIGITS = /[٠-٩۰-۹]/g;

/** Rewrites Arabic-Indic digits as Western ones; other characters pass through. */
export function toLatinDigits<T>(input: T): T {
  if (typeof input !== "string") return input;
  return input.replace(EASTERN_DIGITS, (d) =>
    String(d.charCodeAt(0) & 0x0f),
  ) as unknown as T;
}

/** Formats an ISO date (yyyy-mm-dd) as an Arabic long date; empty string if null. */
export function formatArabicDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  // `-u-nu-latn` already pins the numbering system; toLatinDigits is the
  // fallback for a runtime that ignores the extension and formats with `arab`.
  return isNaN(d.getTime()) ? "" : toLatinDigits(AR_DATE.format(d));
}
