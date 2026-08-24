import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import { MEMBER_STATUS_LABEL, safeSearchTerm } from "@/lib/community";
import type { CommunityMember } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLUMNS: { key: string; header: string; get: (m: CommunityMember) => string }[] = [
  { key: "full_name", header: "الاسم", get: (m) => m.full_name },
  { key: "email", header: "البريد الإلكتروني", get: (m) => m.email },
  { key: "phone", header: "الجوال", get: (m) => m.phone ?? "" },
  { key: "region", header: "المنطقة", get: (m) => m.region ?? "" },
  { key: "city", header: "المدينة", get: (m) => m.city ?? "" },
  { key: "school_stage", header: "المرحلة الدراسية", get: (m) => m.school_stage ?? "" },
  { key: "specialization", header: "التخصص", get: (m) => m.specialization ?? "" },
  { key: "years_experience", header: "سنوات الخبرة", get: (m) => (m.years_experience ?? "").toString() },
  { key: "workplace", header: "جهة العمل", get: (m) => m.workplace ?? "" },
  { key: "interests", header: "الاهتمامات", get: (m) => (m.interests ?? []).join(" | ") },
  { key: "contribution", header: "أوجه المساهمة", get: (m) => (m.contribution ?? []).join(" | ") },
  { key: "status", header: "الحالة", get: (m) => MEMBER_STATUS_LABEL[m.status] ?? m.status },
  { key: "wants_updates", header: "يستقبل الرسائل", get: (m) => (m.wants_updates ? "نعم" : "لا") },
  { key: "created_at", header: "تاريخ الانضمام", get: (m) => m.created_at.slice(0, 10) },
];

/** RFC 4180 quoting. Every field is quoted so Arabic commas never split a cell. */
function cell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

// Admin-only CSV export of the membership list — the fallback channel when the
// team would rather send from their own tool than through the dashboard.
export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const rawStatus = url.searchParams.get("status") ?? "";
  const status = rawStatus in MEMBER_STATUS_LABEL ? rawStatus : "";

  const supabase = await createClient();
  let query = supabase.from("community_members").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const term = safeSearchTerm(q);
  if (term) {
    const like = `%${term}%`;
    query = query.or(
      `full_name.ilike.${like},email.ilike.${like},specialization.ilike.${like},workplace.ilike.${like},city.ilike.${like}`,
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("community export failed —", error.message);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const rows = (data ?? []) as CommunityMember[];
  const csv = [
    COLUMNS.map((c) => cell(c.header)).join(","),
    ...rows.map((m) => COLUMNS.map((c) => cell(c.get(m))).join(",")),
  ].join("\r\n");

  // The UTF-8 BOM is what makes Excel read Arabic correctly instead of mojibake.
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="alostath-community.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
