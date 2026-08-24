// Shared form validators. These were originally inline in SiteChrome.tsx; the
// community forms need the same rules, so they live here rather than being
// copy-pasted a third time.

export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const validPhone = (v: string) => /^[0-9+\-\s]{7,}$/.test(v);

/** A malformed token would fail the uuid cast in Postgres and surface as a 500. */
export const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
