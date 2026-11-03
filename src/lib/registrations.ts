// الطلبات والاشتراكات — labels shared by the inbox, the detail page, the
// overview and the CSV export, so the same row reads the same everywhere.

export const REG_TYPE_LABEL: Record<string, string> = {
  award: "جائزة",
  initiative: "مبادرة",
  council: "المجلس",
  newsletter: "نشرة بريدية",
  contact: "رسالة تواصل",
};

export const REVIEW_STATUSES = ["new", "in_progress", "done", "archived"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  new: "جديد",
  in_progress: "قيد المتابعة",
  done: "تمّت المعالجة",
  archived: "مؤرشف",
};

/** Badge class per status — reuses the dashboard's existing badge tones. */
export const REVIEW_STATUS_CLASS: Record<ReviewStatus, string> = {
  new: "is-soon",
  in_progress: "is-open",
  done: "is-pub",
  archived: "is-draft",
};

export const isReviewStatus = (s: unknown): s is ReviewStatus =>
  typeof s === "string" && (REVIEW_STATUSES as readonly string[]).includes(s);

/** A row written before migration 0006 has no review_status — it counts as new. */
export const reviewStatusOf = (r: { review_status?: string | null }): ReviewStatus =>
  isReviewStatus(r.review_status) ? r.review_status : "new";

/**
 * A phone number as wa.me wants it: digits only, with the country code.
 * Saudi numbers are typed locally (05xxxxxxxx or 5xxxxxxxx), so those get 966;
 * anything already international (or from elsewhere) passes through as digits.
 */
export function whatsappNumber(phone: string): string | null {
  let d = phone.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  else if (/^05\d{8}$/.test(d)) d = "966" + d.slice(1);
  else if (/^5\d{8}$/.test(d)) d = "966" + d;
  d = d.replace(/\D/g, "");
  return d.length >= 8 ? d : null;
}

/** mailto: link that opens a reply with a subject and the original message quoted. */
export function replyMailto(r: {
  email?: string | null;
  name?: string | null;
  program_name?: string | null;
  message?: string | null;
}): string | null {
  if (!r.email) return null;
  const subject = `بخصوص: ${r.program_name || "طلبك"} — مؤسسة الأستاذ`;
  const greeting = r.name ? `مرحباً ${r.name}،` : "مرحباً،";
  const quoted = r.message
    ? `\n\n\n— رسالتك:\n${r.message.split("\n").map((l) => `> ${l}`).join("\n")}`
    : "";
  const body = `${greeting}\n\n${quoted}`;
  return `mailto:${r.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
