const AR_DATE = new Intl.DateTimeFormat("ar", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Formats an ISO date (yyyy-mm-dd) as an Arabic long date; empty string if null. */
export function formatArabicDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : AR_DATE.format(d);
}
