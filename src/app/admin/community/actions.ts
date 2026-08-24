"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import { emailConfigured, renderBroadcastEmail, sendBatch } from "@/lib/email";
import type { BroadcastAudience, CommunityBroadcast, IdeaStatus, MemberStatus } from "@/lib/types";

// Same guard as admin/actions.ts. Kept local rather than imported: exporting it
// from a "use server" module would publish it as a callable server action.
async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("غير مصرّح");
}

const MEMBERS = "/admin/community";
const IDEAS = "/admin/community/ideas";
const BROADCASTS = "/admin/community/broadcasts";

// ── Members ──────────────────────────────────────────────────────────────────

export async function setMemberStatus(id: string, status: MemberStatus) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("community_members")
    // A member the team marks inactive must also stop receiving broadcasts —
    // wants_updates is what the audience query filters on.
    .update({ status, ...(status === "active" ? {} : { wants_updates: false }) })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(MEMBERS);
  revalidatePath(`${MEMBERS}/${id}`);
}

export async function saveMemberNote(id: string, form: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const note = String(form.get("admin_note") ?? "").trim();
  const { error } = await supabase
    .from("community_members")
    .update({ admin_note: note || null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`${MEMBERS}/${id}`);
}

export async function deleteMember(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("community_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(MEMBERS);
}

// ── Ideas ────────────────────────────────────────────────────────────────────

export async function setIdeaStatus(id: string, status: IdeaStatus) {
  await requireAdmin();
  const supabase = await createClient();
  // Only an accepted idea may stay showcased, so demoting one also un-features it.
  const patch: Record<string, unknown> = { status };
  if (status !== "accepted") patch.featured = false;
  const { error } = await supabase.from("community_ideas").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(IDEAS);
  revalidatePath("/community");
}

export async function toggleIdeaFeatured(id: string, next: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  // Featuring implies acceptance — otherwise the public RLS filter hides it and
  // the toggle would silently do nothing.
  const patch: Record<string, unknown> = { featured: next };
  if (next) patch.status = "accepted";
  const { data, error } = await supabase.from("community_ideas").update(patch).eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("لم يتم تحديث الفكرة — تحقّق من الصلاحيات.");
  revalidatePath(IDEAS);
  revalidatePath("/community");
}

export async function saveIdeaNote(id: string, form: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const note = String(form.get("admin_note") ?? "").trim();
  const { error } = await supabase.from("community_ideas").update({ admin_note: note || null }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(IDEAS);
}

export async function deleteIdea(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("community_ideas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(IDEAS);
  revalidatePath("/community");
}

// ── Broadcasts ───────────────────────────────────────────────────────────────

function parseAudience(form: FormData): BroadcastAudience {
  const list = (name: string) =>
    form.getAll(name).map((v) => String(v)).filter(Boolean);
  return { interests: list("interests"), regions: list("regions"), stages: list("stages") };
}

export async function createBroadcast() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_broadcasts")
    .insert({ subject: "رسالة جديدة", body: [] })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  redirect(`${BROADCASTS}/${data.id}`);
}

export async function saveBroadcast(id: string, form: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const subject = String(form.get("subject") ?? "").trim();
  if (!subject) throw new Error("الرجاء كتابة عنوان الرسالة");

  const row = {
    subject,
    preheader: String(form.get("preheader") ?? "").trim() || null,
    // Same convention as blog_posts.body — one paragraph per line.
    body: String(form.get("body") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    cta_label: String(form.get("cta_label") ?? "").trim() || null,
    cta_url: String(form.get("cta_url") ?? "").trim() || null,
    audience: parseAudience(form),
  };

  const { error } = await supabase.from("community_broadcasts").update(row).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`${BROADCASTS}/${id}`);
  revalidatePath(BROADCASTS);
}

export async function deleteBroadcast(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("community_broadcasts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BROADCASTS);
  redirect(BROADCASTS);
}

/**
 * Resolves the audience into one row per recipient and marks the broadcast as
 * sending. Idempotent: re-running only adds members who weren't queued before,
 * and never re-queues someone already sent.
 */
export async function prepareBroadcast(id: string): Promise<{ queued: number; total: number }> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: broadcast, error: readErr } = await supabase
    .from("community_broadcasts")
    .select("*")
    .eq("id", id)
    .single();
  if (readErr || !broadcast) throw new Error("الرسالة غير موجودة");
  if (broadcast.status === "sent") throw new Error("سبق إرسال هذه الرسالة");
  if (!broadcast.subject?.trim() || !(broadcast.body as string[])?.length) {
    throw new Error("أكمل عنوان الرسالة ونصّها قبل الإرسال");
  }

  const audience = (broadcast.audience ?? {}) as BroadcastAudience;
  let q = supabase
    .from("community_members")
    .select("id")
    .eq("status", "active")
    .eq("wants_updates", true);
  if (audience.regions?.length) q = q.in("region", audience.regions);
  if (audience.stages?.length) q = q.in("school_stage", audience.stages);
  if (audience.interests?.length) q = q.overlaps("interests", audience.interests);

  const { data: members, error: audErr } = await q;
  if (audErr) throw new Error(audErr.message);
  if (!members?.length) throw new Error("لا يوجد أعضاء مطابقون لهذه الشريحة");

  const { error: insErr } = await supabase.from("community_broadcast_recipients").upsert(
    members.map((m: { id: string }) => ({ broadcast_id: id, member_id: m.id })),
    { onConflict: "broadcast_id,member_id", ignoreDuplicates: true },
  );
  if (insErr) throw new Error(insErr.message);

  const { count: total } = await supabase
    .from("community_broadcast_recipients")
    .select("*", { count: "exact", head: true })
    .eq("broadcast_id", id);
  const { count: queued } = await supabase
    .from("community_broadcast_recipients")
    .select("*", { count: "exact", head: true })
    .eq("broadcast_id", id)
    .eq("status", "queued");

  await supabase
    .from("community_broadcasts")
    .update({ status: "sending", recipient_count: total ?? 0, error: null })
    .eq("id", id);

  revalidatePath(`${BROADCASTS}/${id}`);
  return { queued: queued ?? 0, total: total ?? 0 };
}

/** Resend's batch endpoint takes at most 100 messages per call. */
const BATCH = 100;

type RecipientRow = {
  member_id: string;
  community_members: {
    full_name: string;
    email: string;
    token: string;
  } | null;
};

/**
 * Sends the next batch of queued recipients and reports progress. The caller
 * (SendPanel) loops until `remaining` hits zero.
 *
 * Chunking this way means no single request can outlive a serverless function
 * timeout, and because progress is persisted per recipient, an interrupted send
 * resumes exactly where it stopped — nobody is emailed twice.
 */
export async function sendBroadcastBatch(
  id: string,
): Promise<{ sent: number; failed: number; remaining: number; done: boolean }> {
  await requireAdmin();
  if (!emailConfigured()) throw new Error("لم يُضبط مفتاح RESEND_API_KEY على الخادم");

  const supabase = await createClient();

  const { data: broadcast, error: readErr } = await supabase
    .from("community_broadcasts")
    .select("*")
    .eq("id", id)
    .single();
  if (readErr || !broadcast) throw new Error("الرسالة غير موجودة");

  const { data: rows, error: qErr } = await supabase
    .from("community_broadcast_recipients")
    .select("member_id, community_members(full_name, email, token)")
    .eq("broadcast_id", id)
    .eq("status", "queued")
    .limit(BATCH);
  if (qErr) throw new Error(qErr.message);

  const recipients = ((rows ?? []) as unknown as RecipientRow[]).filter((r) => r.community_members?.email);

  if (recipients.length) {
    const results = await sendBatch(
      recipients.map((r) => {
        const m = r.community_members!;
        const mail = renderBroadcastEmail(broadcast as CommunityBroadcast, m);
        return { to: m.email, subject: mail.subject, html: mail.html, headers: mail.headers };
      }),
    );

    const sentIds = recipients.filter((_, i) => results[i]?.ok).map((r) => r.member_id);
    if (sentIds.length) {
      await supabase
        .from("community_broadcast_recipients")
        .update({ status: "sent", sent_at: new Date().toISOString(), error: null })
        .eq("broadcast_id", id)
        .in("member_id", sentIds);
    }
    // Failures are rare, so per-row updates are fine and preserve the exact
    // provider error against the member it belongs to.
    for (let i = 0; i < recipients.length; i++) {
      const r = results[i];
      if (r?.ok) continue;
      await supabase
        .from("community_broadcast_recipients")
        .update({ status: "failed", error: r && !r.ok ? r.error : "unknown" })
        .eq("broadcast_id", id)
        .eq("member_id", recipients[i].member_id);
    }
  }

  // Rows whose member row vanished mid-send can never be delivered — retiring
  // them keeps the loop from spinning forever on an unreachable queue.
  const orphans = ((rows ?? []) as unknown as RecipientRow[])
    .filter((r) => !r.community_members?.email)
    .map((r) => r.member_id);
  if (orphans.length) {
    await supabase
      .from("community_broadcast_recipients")
      .update({ status: "failed", error: "no email on record" })
      .eq("broadcast_id", id)
      .in("member_id", orphans);
  }

  const tally = async (status: string) => {
    const { count } = await supabase
      .from("community_broadcast_recipients")
      .select("*", { count: "exact", head: true })
      .eq("broadcast_id", id)
      .eq("status", status);
    return count ?? 0;
  };
  const [sent, failed, remaining] = await Promise.all([tally("sent"), tally("failed"), tally("queued")]);

  const done = remaining === 0;
  await supabase
    .from("community_broadcasts")
    .update({
      sent_count: sent,
      failed_count: failed,
      status: done ? (sent > 0 ? "sent" : "failed") : "sending",
      sent_at: done && sent > 0 ? new Date().toISOString() : broadcast.sent_at,
    })
    .eq("id", id);

  revalidatePath(`${BROADCASTS}/${id}`);
  revalidatePath(BROADCASTS);
  return { sent, failed, remaining, done };
}
