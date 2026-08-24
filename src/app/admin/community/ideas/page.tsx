import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate } from "@/lib/format";
import { IDEA_STATUS_LABEL } from "@/lib/community";
import type { CommunityIdea, IdeaStatus } from "@/lib/types";
import { saveIdeaNote } from "../actions";
import IdeaControls from "./IdeaControls";

export const dynamic = "force-dynamic";

const TABS: { key: string; label: string }[] = [
  { key: "", label: "الكل" },
  { key: "new", label: IDEA_STATUS_LABEL.new },
  { key: "reviewing", label: IDEA_STATUS_LABEL.reviewing },
  { key: "accepted", label: IDEA_STATUS_LABEL.accepted },
  { key: "archived", label: IDEA_STATUS_LABEL.archived },
];

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus = "" } = await searchParams;
  const status = TABS.some((t) => t.key === rawStatus) ? rawStatus : "";
  const supabase = await createClient();

  let query = supabase
    .from("community_ideas")
    .select("*, initiatives(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(300);
  if (status) query = query.eq("status", status);

  const { data, count } = await query;
  const ideas = (data ?? []) as (CommunityIdea & { initiatives: { name: string } | null })[];

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">أفكار المجتمع</h1>
          <p className="admin-subtitle">
            ما يصل من المعلّمين عبر «شارك فكرتك» — {count ?? ideas.length} فكرة. الفكرة المُبرزة تظهر
            ضمن «أصوات المجتمع» على صفحة المجتمع.
          </p>
        </div>
      </div>

      <div className="admin-filterbar">
        <div className="admin-tabs">
          {TABS.map((t) => (
            <Link
              key={t.key || "all"}
              href={t.key ? `/admin/community/ideas?status=${t.key}` : "/admin/community/ideas"}
              className={`admin-tab${status === t.key ? " is-active" : ""}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty" style={{ margin: 0 }}>
            {status ? "لا توجد أفكار في هذه الحالة." : "لم تصل أي فكرة بعد."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {ideas.map((idea) => (
            <article key={idea.id} className="admin-card">
              <div className="admin-idea-head">
                <div>
                  <h2 className="admin-card-title" style={{ marginBottom: 6 }}>{idea.title}</h2>
                  <div className="admin-idea-meta">
                    <span>{idea.name || "بدون اسم"}</span>
                    {idea.email && <a className="admin-cell-ltr" href={`mailto:${idea.email}`}>{idea.email}</a>}
                    <span>{formatArabicDate(idea.created_at.slice(0, 10))}</span>
                    {idea.initiatives?.name && <span className="admin-badge is-type">{idea.initiatives.name}</span>}
                    {idea.topic && <span className="admin-badge is-type">{idea.topic}</span>}
                    {idea.featured && <span className="admin-badge is-pub"><span className="dot" />مُبرزة</span>}
                    {idea.member_id && (
                      <Link href={`/admin/community/${idea.member_id}`} className="admin-edit">عضو في المجتمع</Link>
                    )}
                  </div>
                </div>
                <IdeaControls
                  id={idea.id}
                  title={idea.title}
                  status={idea.status as IdeaStatus}
                  featured={idea.featured}
                />
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.95, color: "var(--text-body)", margin: "18px 0 0", whiteSpace: "pre-wrap" }}>
                {idea.body}
              </p>

              <form action={saveIdeaNote.bind(null, idea.id)} style={{ marginTop: 18 }}>
                <label className="admin-label sm" htmlFor={`note-${idea.id}`}>ملاحظة الفريق</label>
                <div className="admin-idea-note">
                  <input
                    className="admin-input"
                    id={`note-${idea.id}`}
                    name="admin_note"
                    defaultValue={idea.admin_note ?? ""}
                    placeholder="مثال: مناسبة لمبادرة ناصية — عُرضت على الفريق."
                  />
                  <button type="submit" className="admin-btn admin-btn-ghost admin-btn-sm">حفظ</button>
                </div>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
