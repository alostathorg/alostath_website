import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import { latinDigitsDeep } from "@/lib/format";
import { REG_TYPE_LABEL, REVIEW_STATUS_LABEL, isReviewStatus, reviewStatusOf } from "@/lib/registrations";

export const dynamic = "force-dynamic";

type Reg = Record<string, string | boolean | null>;
const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

const COLUMNS: { header: string; get: (r: Reg) => string }[] = [
  { header: "الاسم", get: (r) => str(r.name) },
  { header: "البريد الإلكتروني", get: (r) => str(r.email) },
  { header: "الجوال", get: (r) => str(r.phone) },
  { header: "النوع", get: (r) => REG_TYPE_LABEL[str(r.program_type)] ?? str(r.program_type) },
  { header: "البرنامج", get: (r) => str(r.program_name) },
  { header: "الفئة", get: (r) => str(r.category) },
  { header: "الرسالة", get: (r) => str(r.message) },
  { header: "حالة المتابعة", get: (r) => REVIEW_STATUS_LABEL[reviewStatusOf({ review_status: str(r.review_status) })] },
  { header: "ملاحظة داخلية", get: (r) => str(r.admin_note) },
  { header: "تاريخ الإرسال", get: (r) => str(r.created_at).slice(0, 10) },
];

/** RFC 4180 quoting. Every field is quoted so Arabic commas never split a cell. */
const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;

// Admin-only CSV export of الطلبات والاشتراكات, honouring the same search,
// status and type filters as the inbox the button was pressed on.
export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const type = url.searchParams.get("type") ?? "";
  const rawStatus = url.searchParams.get("status") ?? "";
  const status = isReviewStatus(rawStatus) ? rawStatus : "";

  const supabase = await createClient();
  const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("registrations export failed —", error.message);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const rows = ((latinDigitsDeep(data) ?? []) as Reg[]).filter((r) => {
    const st = reviewStatusOf({ review_status: str(r.review_status) });
    if (status ? st !== status : st === "archived") return false;
    if (type && r.program_type !== type) return false;
    if (q && !["name", "email", "phone", "program_name", "message", "category", "admin_note"].some((k) => str(r[k]).toLowerCase().includes(q))) {
      return false;
    }
    return true;
  });

  const csv = [
    COLUMNS.map((c) => cell(c.header)).join(","),
    ...rows.map((r) => COLUMNS.map((c) => cell(c.get(r))).join(",")),
  ].join("\r\n");

  // The UTF-8 BOM is what makes Excel read Arabic correctly instead of mojibake.
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="alostath-registrations.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
