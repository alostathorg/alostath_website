import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Public endpoint: writes an interest/registration/contact/newsletter row.
// RLS allows anon INSERT into `registrations` (and nothing else), so we use the
// standard anon-scoped server client — no service role needed here.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const program_name = String(body.program_name ?? "").trim();
  if (!program_name) {
    return NextResponse.json({ error: "program_name required" }, { status: 400 });
  }

  const row = {
    program_name,
    program_type: body.program_type ? String(body.program_type) : null,
    status: body.status ? String(body.status) : null,
    name: body.name ? String(body.name) : null,
    email: body.email ? String(body.email) : null,
    phone: body.phone ? String(body.phone) : null,
    category: body.category ? String(body.category) : null,
    message: body.message ? String(body.message) : null,
    consent: Boolean(body.consent),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("registrations").insert(row);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
