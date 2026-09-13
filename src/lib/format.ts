// The site speaks Arabic in Western (Latin) digits — 0-9, never ٠-٩ or ۰-۹ —
// and that holds for every surface: pages, the dashboard, emails, the CSV
// export, and the rows stored in between. Four things enforce it:
//
//   • `ar-u-nu-latn` pins Intl's numbering system, so a browser whose ICU
//     defaults `ar` to `arab` still formats dates with Latin digits.
//   • `toLatinDigits` rewrites a single string that came from a keyboard.
//   • `latinDigitsDeep` applies that rewrite across a whole row — used on both
//     sides of the database, so what is written is already normalised and what
//     was written before the rule existed is normalised on the way out.
//   • `latinDigitsField` rewrites a form field as it is typed, so a teacher on
//     an Arabic keyboard sees the site's digits in the box, and validators that
//     expect 0-9 (a phone number, سنوات الخبرة) accept what they typed.
//
// Identifiers and addresses are the exception throughout: a slug, an id, a
// token, an email or a URL is looked up or dialled, not read, and rewriting a
// character inside one would break the very thing it points at.

const AR_DATE = new Intl.DateTimeFormat("ar-u-nu-latn", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Arabic-Indic digits (U+0660-0669), Extended Arabic-Indic / Persian digits
// (U+06F0-06F9), and the three signs that travel with them: ٪ percent,
// ٫ decimal separator, ٬ thousands separator.
const EASTERN_NUMERALS = /[٠-٩۰-۹٪٫٬]/g;
const SIGNS: Record<string, string> = { "٪": "%", "٫": ".", "٬": "," };

/** Keys that hold an identifier or an address rather than copy. */
const IDENTIFIER_KEYS = new Set(["id", "slug", "email", "token"]);
const IDENTIFIER_SUFFIXES = ["_id", "_slug", "_url"];
const isIdentifierKey = (key: string) =>
  IDENTIFIER_KEYS.has(key) || IDENTIFIER_SUFFIXES.some((s) => key.endsWith(s));

/** A value that is an address — including the schemeless `//host/path` form. */
const ADDRESS = /^(?:https?:|mailto:|tel:|\/\/)/i;

/** Rewrites Arabic-Indic digits as Western ones; other characters pass through. */
export function toLatinDigits<T>(input: T): T {
  if (typeof input !== "string") return input;
  return input.replace(EASTERN_NUMERALS, (c) =>
    SIGNS[c] ?? String(c.charCodeAt(0) & 0x0f),
  ) as unknown as T;
}

/**
 * `toLatinDigits` over a whole row (or array of rows) from the database, in
 * either direction. Numbers, booleans, nulls and dates pass through untouched —
 * only strings are rewritten, and only those that are copy rather than an
 * identifier or an address.
 */
export function latinDigitsDeep<T>(value: T): T {
  if (typeof value === "string") {
    return (ADDRESS.test(value) ? value : toLatinDigits(value)) as unknown as T;
  }
  if (Array.isArray(value)) return value.map(latinDigitsDeep) as unknown as T;
  // Object.fromEntries defines each key as a plain data property. A `for` loop
  // with `out[k] = …` would not: a jsonb column holding a literal "__proto__"
  // key would hit the inherited setter, silently dropping the key and swapping
  // the rebuilt object's prototype.
  if (value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, isIdentifierKey(k) ? v : latinDigitsDeep(v)]),
    ) as T;
  }
  return value;
}

/**
 * Rewrites a text field in place when Arabic-Indic digits are typed into it.
 * The replacement is one character for one, so the caret is put back exactly
 * where it was; the value is only touched when it actually changes, which keeps
 * this off the path of ordinary Arabic typing.
 */
export function latinDigitsField(target: EventTarget | null): void {
  if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return;
  // A password is not copy, and url/email fields hold addresses.
  if (target instanceof HTMLInputElement && ["password", "url", "email"].includes(target.type)) return;
  if (isIdentifierKey(target.name) || ADDRESS.test(target.value)) return;

  const latin = toLatinDigits(target.value);
  if (latin === target.value) return;

  const { selectionStart, selectionEnd } = target;
  // Written through the native setter rather than `target.value = …`: React
  // replaces that property on the element to remember the last value it saw, so
  // assigning to it would also update React's record — the change event it is
  // about to handle would then look like a no-op, and a controlled field (the
  // broadcast composer, the settings editor) would swallow the character.
  const setValue = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), "value")?.set;
  if (setValue) setValue.call(target, latin);
  else target.value = latin;
  if (selectionStart !== null && selectionEnd !== null) {
    target.setSelectionRange(selectionStart, selectionEnd);
  }
}

/** Formats an ISO date (yyyy-mm-dd) as an Arabic long date; empty string if null. */
export function formatArabicDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  // `-u-nu-latn` already pins the numbering system; toLatinDigits is the
  // fallback for a runtime that ignores the extension and formats with `arab`.
  return isNaN(d.getTime()) ? "" : toLatinDigits(AR_DATE.format(d));
}
