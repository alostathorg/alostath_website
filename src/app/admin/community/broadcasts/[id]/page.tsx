import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAwards, getInitiatives, getPosts } from "@/lib/queries";
import { emailConfigured, siteUrl } from "@/lib/email";
import { BROADCAST_STATUS_LABEL } from "@/lib/community";
import type { CommunityBroadcast } from "@/lib/types";
import { deleteBroadcast } from "../../actions";
import BroadcastForm, { type ContentSource } from "../BroadcastForm";
import SendPanel from "../SendPanel";

export const dynamic = "force-dynamic";

/**
 * Turns published content into ready-to-send drafts. This is the point of the
 * whole feature — "reach them once we publish anything related to them" — so
 * composing a message about a new award should not mean retyping it.
 */
async function contentSources(): Promise<ContentSource[]> {
  const site = siteUrl();
  const [awards, initiatives, posts] = await Promise.all([getAwards(), getInitiatives(), getPosts()]);

  return [
    ...awards.map((a) => ({
      id: `award-${a.slug}`,
      group: "الجوائز",
      label: a.name,
      subject: a.name,
      body: [a.tagline, a.overview, a.goal].filter((x): x is string => Boolean(x)),
      ctaLabel: "تعرّف على الجائزة",
      ctaUrl: `${site}/awards/${a.slug}`,
    })),
    ...initiatives.map((i) => ({
      id: `initiative-${i.slug}`,
      group: "المبادرات",
      label: i.name,
      subject: i.name,
      body: [i.tagline, i.overview, i.goal].filter((x): x is string => Boolean(x)),
      ctaLabel: "تعرّف على المبادرة",
      ctaUrl: `${site}/initiatives/${i.slug}`,
    })),
    ...posts.map((p) => ({
      id: `post-${p.slug}`,
      group: "المدونة",
      label: p.title,
      subject: p.title,
      body: [p.excerpt, ...(p.body ?? []).slice(0, 2)].filter((x): x is string => Boolean(x)),
      ctaLabel: "اقرأ المقال",
      ctaUrl: `${site}/blog/${p.slug}`,
    })),
  ];
}

export default async function BroadcastEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("community_broadcasts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const b = data as CommunityBroadcast;

  const locked = b.status === "sent";
  const sources = locked ? [] : await contentSources();

  return (
    <div>
      <Link href="/admin/community/broadcasts" className="admin-back">← العودة إلى الرسائل</Link>

      <div className="admin-head">
        <div>
          <h1 className="admin-title">{b.subject}</h1>
          <p className="admin-subtitle">
            {BROADCAST_STATUS_LABEL[b.status]}
            {b.recipient_count > 0 ? ` · ${b.sent_count} من ${b.recipient_count} مستلم` : ""}
          </p>
        </div>
        {b.status === "draft" && (
          <form action={deleteBroadcast.bind(null, b.id)}>
            <button type="submit" className="admin-btn admin-btn-danger">حذف المسودة</button>
          </form>
        )}
      </div>

      {b.error && <div className="admin-error">{b.error}</div>}

      {locked && (
        <div className="admin-card">
          <p className="admin-card-hint" style={{ margin: 0 }}>
            أُرسلت هذه الرسالة، ولذلك لا يمكن تعديلها — يبقى نصّها هنا للرجوع إليه.
          </p>
        </div>
      )}

      <BroadcastForm broadcast={b} sources={sources} locked={locked} />

      <SendPanel
        id={b.id}
        status={b.status}
        recipientCount={b.recipient_count}
        sentCount={b.sent_count}
        failedCount={b.failed_count}
        emailReady={emailConfigured()}
      />
    </div>
  );
}
