import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validate";

// RFC 8058 one-click unsubscribe target, referenced by the List-Unsubscribe
// header on every broadcast. POST only — see unsubscribePostUrl() in lib/email
// for why a GET here would be actively harmful.
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("t");
  if (!token || !isUuid(token)) return NextResponse.json({ error: "invalid token" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("community_unsubscribe", { t: token, resubscribe: false });

  if (error) {
    console.error("community_unsubscribe failed —", error.message);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
  const result = (data ?? {}) as { ok?: boolean };
  if (!result.ok) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
