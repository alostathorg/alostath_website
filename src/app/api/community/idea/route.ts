import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { latinDigitsDeep } from "@/lib/format";

// Public endpoint: a teacher submits an idea, optionally attached to a specific
// initiative. Validation, the per-address hourly cap, and resolving the
// initiative slug all live in the `community_idea_submit` RPC.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const supabase = await createClient();
  // An accepted idea is showcased on /community, so it arrives in the site's
  // digits — `initiative_slug` is an identifier and passes through untouched.
  const { data, error } = await supabase.rpc("community_idea_submit", { payload: latinDigitsDeep(body) });

  if (error) {
    console.error("community_idea_submit failed —", error.message);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const result = (data ?? {}) as { ok?: boolean; error?: string };
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "unknown" }, { status: result.error === "rate_limited" ? 429 : 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
