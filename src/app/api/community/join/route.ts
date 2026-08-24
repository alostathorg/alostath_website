import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emailConfigured, renderWelcomeEmail, sendEmail } from "@/lib/email";

// Public endpoint: joins (or updates) a مجتمع الأستاذ membership.
//
// Unlike /api/register — which inserts straight into a table anon may write —
// nothing here touches `community_members` directly. The `community_join`
// SECURITY DEFINER function owns validation, length caps, the flood guard and
// the upsert-on-email, so the membership list is never exposed to the anon key.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("community_join", { payload: body });

  if (error) {
    console.error("community_join failed —", error.message);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const result = (data ?? {}) as { ok?: boolean; error?: string; status?: string; token?: string | null; name?: string };
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "unknown" }, { status: result.error === "rate_limited" ? 429 : 400 });
  }

  // Welcome only a genuinely new member: a repeat submission is a profile
  // update, and the RPC withholds the token in that case by design.
  if (result.status === "created" && result.token && emailConfigured()) {
    const mail = renderWelcomeEmail({ full_name: result.name ?? "", token: result.token });
    const sent = await sendEmail({ to: String(body.email ?? "").trim(), ...mail });
    if (!sent.ok) console.error("welcome email failed —", sent.error);
  }

  return NextResponse.json({ ok: true, status: result.status }, { status: 201 });
}
