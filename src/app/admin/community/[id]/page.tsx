import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate } from "@/lib/format";
import { IDEA_STATUS_LABEL, MEMBER_STATUS_LABEL } from "@/lib/community";
import type { CommunityIdea, CommunityMember, MemberStatus } from "@/lib/types";
import { saveMemberNote } from "../actions";
import MemberStatusSelect from "../MemberStatusSelect";
import MemberDeleteButton from "../MemberDeleteButton";

export const dynamic = "force-dynamic";

function Row({ k, v, ltr }: { k: string; v: React.ReactNode; ltr?: boolean }) {
  return (
    <div className="admin-deflist-row">
      <dt>{k}</dt>
      <dd className={ltr ? "admin-cell-ltr" : undefined}>{v || <span style={{ color: "var(--ink-subtle)" }}>—</span>}</dd>
    </div>
  );
}

export default async function MemberDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("community_members").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const m = data as CommunityMember;

  const { data: ideaRows } = await supabase
    .from("community_ideas")
    .select("*")
    .eq("member_id", id)
    .order("created_at", { ascending: false });
  const ideas = (ideaRows ?? []) as CommunityIdea[];

  return (
    <div>
      <Link href="/admin/community" className="admin-back">← العودة إلى الأعضاء</Link>

      <div className="admin-head">
        <div>
          <h1 className="admin-title">{m.full_name}</h1>
          <p className="admin-subtitle">
            انضمّ في {formatArabicDate(m.created_at.slice(0, 10))} · {MEMBER_STATUS_LABEL[m.status]}
            {m.wants_updates ? " · يستقبل الرسائل" : " · لا يستقبل الرسائل"}
          </p>
        </div>
        <span className="admin-rowactions">
          <MemberStatusSelect id={m.id} status={m.status as MemberStatus} />
          <MemberDeleteButton id={m.id} name={m.full_name} />
        </span>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">بيانات العضو</h2>
        <dl className="admin-deflist">
          <Row k="البريد الإلكتروني" v={<a href={`mailto:${m.email}`}>{m.email}</a>} ltr />
          <Row k="رقم الجوال" v={m.phone} ltr />
          <Row k="المنطقة" v={m.region} />
          <Row k="المدينة" v={m.city} />
          <Row k="المرحلة الدراسية" v={m.school_stage} />
          <Row k="التخصص" v={m.specialization} />
          <Row k="سنوات الخبرة" v={m.years_experience !== null ? String(m.years_experience) : ""} />
          <Row k="جهة العمل" v={m.workplace} />
          <Row
            k="الاهتمامات"
            v={m.interests?.length ? <span className="admin-chiprow">{m.interests.map((i) => <span key={i} className="admin-badge is-type">{i}</span>)}</span> : ""}
          />
          <Row
            k="أوجه المساهمة"
            v={m.contribution?.length ? <span className="admin-chiprow">{m.contribution.map((i) => <span key={i} className="admin-badge is-type">{i}</span>)}</span> : ""}
          />
          <Row k="مصدر التسجيل" v={m.source} />
        </dl>
        {m.bio && (
          <>
            <h3 className="admin-section-title" style={{ marginTop: 24 }}>نبذة</h3>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--text-muted)", margin: 0, whiteSpace: "pre-wrap" }}>{m.bio}</p>
          </>
        )}
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">ملاحظة داخلية</h2>
        <p className="admin-card-hint">لا تظهر هذه الملاحظة للعضو — للفريق فقط.</p>
        <form action={saveMemberNote.bind(null, m.id)}>
          <div className="admin-field is-wide">
            <textarea className="admin-textarea" name="admin_note" rows={4} defaultValue={m.admin_note ?? ""} placeholder="مثال: رشّحه فريق الجوائز للتحكيم." />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary">حفظ الملاحظة</button>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">أفكاره ({ideas.length})</h2>
        {ideas.length === 0 ? (
          <p className="admin-card-hint" style={{ margin: 0 }}>لم يشارك هذا العضو أي فكرة بعد.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {ideas.map((idea) => (
              <li key={idea.id} className="admin-idea-mini">
                <div>
                  <strong>{idea.title}</strong>
                  <span className="admin-badge is-type" style={{ marginInlineStart: 10 }}>{IDEA_STATUS_LABEL[idea.status]}</span>
                </div>
                <span style={{ color: "var(--ink-subtle)", fontSize: 13, whiteSpace: "nowrap" }}>
                  {formatArabicDate(idea.created_at.slice(0, 10))}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/community/ideas" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ marginTop: 16 }}>
          إدارة الأفكار
        </Link>
      </div>
    </div>
  );
}
