// Outbound email for مجتمع الأستاذ.
//
// Talks to the Resend REST API over plain `fetch` rather than pulling in the
// SDK — this repo deliberately keeps its dependency list to five packages, and
// the two endpoints we need are a POST each.
//
// Nothing here throws on a missing key: `next build` and local dev run without
// secrets, exactly like publicClient() in lib/supabase/public.ts. Callers get a
// structured `{ok:false, error}` instead.

import type { CommunityBroadcast, CommunityMember } from "@/lib/types";

const API = "https://api.resend.com";

// Brand values are inlined as literals: email clients don't support CSS custom
// properties, so the tokens in styles/tokens/colors.css can't be referenced.
const C = {
  olive900: "#1E2814",
  olive500: "#4E5B30",
  gold500: "#BF9B2F",
  ink: "#23271A",
  inkMuted: "#4F5443",
  inkSubtle: "#868B73",
  canvas: "#FFFFFF",
  surface: "#F8F9F4",
  hairline: "#E6E8DD",
  inkInverse: "#F4F6EE",
};

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function fromAddress(): string {
  // Strip wrapping quotes — the value contains spaces and angle brackets, so
  // it is usually quoted in .env, same defensive trim as lib/supabase/public.ts.
  const raw = process.env.COMMUNITY_FROM_EMAIL?.trim().replace(/^["']|["']$/g, "");
  return raw || "مجتمع الأستاذ <community@ostath.sa>";
}

/** Absolute site origin, needed for unsubscribe links inside emails. */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

/** Human-facing page: asks for confirmation before unsubscribing. */
export function unsubscribeUrl(token: string): string {
  return `${siteUrl()}/community/unsubscribe?t=${encodeURIComponent(token)}`;
}

/**
 * RFC 8058 one-click target. Kept separate from the page above and POST-only on
 * purpose: link-scanners (Outlook Safe Links and friends) prefetch every URL in
 * an email, so a GET that unsubscribes would silently drop members who never
 * clicked anything.
 */
export function unsubscribePostUrl(token: string): string {
  return `${siteUrl()}/api/community/unsubscribe?t=${encodeURIComponent(token)}`;
}

async function post(path: string, body: unknown): Promise<{ ok: boolean; status: number; json: unknown }> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* empty or non-JSON body — the status alone is enough */
  }
  return { ok: res.ok, status: res.status, json };
}

function errorText(status: number, json: unknown): string {
  const msg =
    json && typeof json === "object" && "message" in json
      ? String((json as { message: unknown }).message)
      : null;
  return msg ?? `Resend responded ${status}`;
}

function payload(m: EmailMessage) {
  return { from: fromAddress(), to: [m.to], subject: m.subject, html: m.html, headers: m.headers };
}

export async function sendEmail(m: EmailMessage): Promise<SendResult> {
  if (!emailConfigured()) return { ok: false, error: "RESEND_API_KEY غير مضبوط" };
  try {
    const { ok, status, json } = await post("/emails", payload(m));
    if (!ok) return { ok: false, error: errorText(status, json) };
    const id = json && typeof json === "object" && "id" in json ? String((json as { id: unknown }).id) : undefined;
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Sends up to 100 messages in one API call (Resend's batch limit), which keeps
 * a large broadcast inside the provider's request-rate budget.
 *
 * The batch endpoint is all-or-nothing, so a single malformed address would
 * sink 99 good ones — on failure we fall back to individual sends and report
 * per-recipient results. Order of the returned array matches the input.
 */
export async function sendBatch(messages: EmailMessage[]): Promise<SendResult[]> {
  if (!messages.length) return [];
  if (!emailConfigured()) return messages.map(() => ({ ok: false, error: "RESEND_API_KEY غير مضبوط" }));

  try {
    const { ok, status, json } = await post("/emails/batch", messages.map(payload));
    if (ok) {
      const data = json && typeof json === "object" && "data" in json ? (json as { data: unknown }).data : null;
      const ids = Array.isArray(data) ? data : [];
      return messages.map((_, i) => {
        const entry = ids[i];
        const id = entry && typeof entry === "object" && "id" in entry ? String((entry as { id: unknown }).id) : undefined;
        return { ok: true, id } as SendResult;
      });
    }
    console.error("sendBatch: batch call failed, retrying individually —", errorText(status, json));
  } catch (err) {
    console.error("sendBatch: batch call threw, retrying individually —", (err as Error).message);
  }

  const out: SendResult[] = [];
  for (const m of messages) out.push(await sendEmail(m));
  return out;
}

// ── Templates ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Shared RTL shell. Table-based and inline-styled because Outlook and most
 * Arabic webmail clients strip <style> blocks and ignore flex/grid.
 */
function shell(opts: { preheader?: string | null; body: string; footer: string }): string {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مؤسسة الأستاذ</title></head>
<body style="margin:0;padding:0;background:${C.surface};">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.surface};padding:28px 12px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${C.canvas};border:1px solid ${C.hairline};border-radius:16px;overflow:hidden;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;">
    <tr><td style="background:${C.olive900};padding:26px 30px;text-align:right;">
      <div style="color:${C.gold500};font-size:12px;font-weight:600;letter-spacing:.4px;">مجتمع الأستاذ</div>
      <div style="color:${C.inkInverse};font-size:19px;font-weight:700;padding-top:5px;">مؤسسة الأستاذ</div>
    </td></tr>
    <tr><td style="padding:32px 30px;text-align:right;color:${C.ink};">
${opts.body}
    </td></tr>
    <tr><td style="border-top:1px solid ${C.hairline};background:${C.surface};padding:20px 30px;text-align:right;color:${C.inkSubtle};font-size:12px;line-height:1.9;">
${opts.footer}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 6px;"><tr><td style="background:${C.olive500};border-radius:10px;">
  <a href="${esc(url)}" style="display:inline-block;padding:13px 26px;color:${C.inkInverse};font-size:15px;font-weight:600;text-decoration:none;">${esc(label)}</a>
</td></tr></table>`;
}

function paragraphs(lines: string[]): string {
  return lines
    .filter((l) => l.trim())
    .map((l) => `<p style="margin:0 0 15px;font-size:15px;line-height:1.95;color:${C.inkMuted};">${esc(l)}</p>`)
    .join("\n");
}

export function renderWelcomeEmail(member: { full_name: string; token: string }): { subject: string; html: string } {
  const subject = "أهلاً بك في مجتمع الأستاذ";
  const html = shell({
    preheader: "شكراً لانضمامك — سنصل إليك أولاً بكل جديد.",
    body: `
<h1 style="margin:0 0 14px;font-size:23px;font-weight:700;color:${C.ink};">أهلاً ${esc(member.full_name)} 👋</h1>
${paragraphs([
  "سعدنا بانضمامك إلى «مجتمع الأستاذ» — المساحة التي نجمع فيها المعلّمين والمعلّمات حول برامج المؤسسة وجوائزها ومبادراتها.",
  "من الآن فصاعداً ستصلك أخبار الجوائز والمبادرات والمجلس أولاً بأول، وستُدعى للمساهمة بأفكارك في تطوير ما نعمل عليه.",
  "وإن كانت لديك فكرة تودّ مشاركتنا إياها الآن، فبابنا مفتوح.",
])}
${button("شارك فكرتك", `${siteUrl()}/community#idea`)}`,
    footer: `أُرسلت هذه الرسالة إلى عضو في مجتمع الأستاذ.<br>
<a href="${esc(unsubscribeUrl(member.token))}" style="color:${C.inkSubtle};">إلغاء الاشتراك</a> · مؤسسة الأستاذ`,
  });
  return { subject, html };
}

export function renderBroadcastEmail(
  broadcast: Pick<CommunityBroadcast, "subject" | "preheader" | "body" | "cta_label" | "cta_url">,
  member: Pick<CommunityMember, "full_name" | "token">,
): { subject: string; html: string; headers: Record<string, string> } {
  const unsub = unsubscribeUrl(member.token);
  const html = shell({
    preheader: broadcast.preheader,
    body: `
<h1 style="margin:0 0 8px;font-size:23px;font-weight:700;color:${C.ink};">${esc(broadcast.subject)}</h1>
<p style="margin:0 0 20px;font-size:14px;color:${C.inkSubtle};">مرحباً ${esc(member.full_name)}،</p>
${paragraphs(broadcast.body ?? [])}
${broadcast.cta_label && broadcast.cta_url ? button(broadcast.cta_label, broadcast.cta_url) : ""}`,
    footer: `تصلك هذه الرسالة لأنك عضو في مجتمع الأستاذ.<br>
<a href="${esc(unsub)}" style="color:${C.inkSubtle};">إلغاء الاشتراك بضغطة واحدة</a> · مؤسسة الأستاذ`,
  });

  return {
    subject: broadcast.subject,
    html,
    // RFC 8058 — lets Gmail/Outlook render a native unsubscribe control, which
    // materially protects sender reputation.
    headers: {
      "List-Unsubscribe": `<${unsubscribePostUrl(member.token)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
