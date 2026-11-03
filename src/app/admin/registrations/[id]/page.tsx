import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate, latinDigitsDeep } from "@/lib/format";
import {
  REG_TYPE_LABEL,
  REVIEW_STATUS_CLASS,
  REVIEW_STATUS_LABEL,
  replyMailto,
  reviewStatusOf,
  whatsappNumber,
} from "@/lib/registrations";
import RegStatusControl from "../RegStatusControl";
import RegNoteForm from "../RegNoteForm";
import RegDeleteButton from "../RegDeleteButton";
import CopyButton from "../../CopyButton";
import { Icon } from "../../icons";

export const dynamic = "force-dynamic";

type Reg = Record<string, string | boolean | null>;

const TIME = new Intl.DateTimeFormat("ar-u-nu-latn", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Riyadh" });
const when = (iso: string) => `${formatArabicDate(iso.slice(0, 10))} · ${TIME.format(new Date(iso))}`;

function Row({ k, v, ltr, copy }: { k: string; v: React.ReactNode; ltr?: boolean; copy?: string }) {
  return (
    <div className="admin-deflist-row">
      <dt>{k}</dt>
      <dd className={ltr ? "admin-cell-ltr" : undefined}>
        {v || <span className="admin-nil">—</span>}
        {v && copy && <CopyButton value={copy} label={`نسخ ${k}`} />}
      </dd>
    </div>
  );
}

export default async function RegistrationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("registrations").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const r = latinDigitsDeep(data as Reg) as Reg;
  const s = (k: string) => (typeof r[k] === "string" ? (r[k] as string) : "");

  // Migration 0006 adds the follow-up columns; until it runs, the page still
  // shows everything and explains why the controls are missing.
  const reviewReady = "review_status" in r;
  const status = reviewStatusOf({ review_status: s("review_status") });

  const [{ data: order }, { data: sameSender }] = await Promise.all([
    supabase.from("registrations").select("id").order("created_at", { ascending: false }).limit(500),
    s("email")
      ? supabase
          .from("registrations")
          .select("id, program_name, program_type, created_at")
          .eq("email", s("email"))
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as Reg[] }),
  ]);
  const ids = (order ?? []).map((o) => o.id as string);
  const at = ids.indexOf(id);
  const newer = at > 0 ? ids[at - 1] : null;
  const older = at >= 0 && at < ids.length - 1 ? ids[at + 1] : null;
  const others = latinDigitsDeep((sameSender ?? []) as Reg[]) as Reg[];

  const who = s("name") || s("email") || "طلب بدون اسم";
  const mailto = replyMailto({ email: s("email"), name: s("name"), program_name: s("program_name"), message: s("message") });
  const wa = s("phone") ? whatsappNumber(s("phone")) : null;

  return (
    <div className="admin-reg">
      <div className="admin-reg-nav">
        <Link href="/admin/registrations" className="admin-back">
          {Icon.back}
          العودة إلى الطلبات
        </Link>
        {ids.length > 1 && at >= 0 && (
          <div className="admin-pager" aria-label="التنقّل بين الطلبات">
            <span className="admin-pager-pos">{at + 1} من {ids.length}</span>
            {newer ? (
              <Link href={`/admin/registrations/${newer}`} className="admin-iconbtn" aria-label="الطلب الأحدث" title="الأحدث">{Icon.back}</Link>
            ) : (
              <span className="admin-iconbtn is-disabled" aria-hidden="true">{Icon.back}</span>
            )}
            {older ? (
              <Link href={`/admin/registrations/${older}`} className="admin-iconbtn" aria-label="الطلب الأقدم" title="الأقدم">{Icon.chevron}</Link>
            ) : (
              <span className="admin-iconbtn is-disabled" aria-hidden="true">{Icon.chevron}</span>
            )}
          </div>
        )}
      </div>

      <div className="admin-head">
        <div>
          <h1 className="admin-title">{who}</h1>
          <div className="admin-head-meta">
            <span className="admin-badge is-type">{REG_TYPE_LABEL[s("program_type")] ?? (s("program_type") || "—")}</span>
            {reviewReady && (
              <span className={`admin-badge ${REVIEW_STATUS_CLASS[status]}`}>
                <span className="dot" />
                {REVIEW_STATUS_LABEL[status]}
              </span>
            )}
            {s("created_at") && <span className="admin-head-time">{Icon.clock}{when(s("created_at"))}</span>}
          </div>
        </div>
        <RegDeleteButton id={id} name={s("name") || undefined} redirectTo="/admin/registrations" variant="button" />
      </div>

      {/* Primary ways to answer — the reason the team opened this page. */}
      {(mailto || s("phone")) && (
        <div className="admin-reg-actions">
          {mailto && (
            <a href={mailto} className="admin-btn admin-btn-primary">
              {Icon.mail}
              الرد بالبريد
            </a>
          )}
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="admin-btn admin-btn-ghost">
              {Icon.whatsapp}
              واتساب
            </a>
          )}
          {s("phone") && (
            <a href={`tel:${s("phone")}`} className="admin-btn admin-btn-ghost">
              {Icon.phone}
              اتصال
            </a>
          )}
        </div>
      )}

      <div className="admin-reg-grid">
        <div className="admin-reg-main">
          {s("message") && (
            <div className="admin-card" data-order="1">
              <h2 className="admin-card-title">الرسالة</h2>
              <div className="admin-message" dir="auto">{s("message")}</div>
            </div>
          )}

          <div className="admin-card" data-order="3">
            <h2 className="admin-card-title">بيانات الطلب</h2>
            <dl className="admin-deflist is-single">
              <Row k="الاسم" v={s("name")} />
              <Row
                k="البريد الإلكتروني"
                v={s("email") && <a href={`mailto:${s("email")}`}>{s("email")}</a>}
                copy={s("email")}
                ltr
              />
              <Row k="الجوال" v={s("phone") && <a href={`tel:${s("phone")}`}>{s("phone")}</a>} copy={s("phone")} ltr />
              <Row k="البرنامج" v={s("program_name")} />
              <Row k="النوع" v={REG_TYPE_LABEL[s("program_type")] ?? s("program_type")} />
              {s("category") && <Row k="الفئة / المسار" v={s("category")} />}
              {s("status") && <Row k="مرحلة البرنامج عند التقديم" v={s("status")} />}
              <Row k="الموافقة على الشروط" v={r.consent ? "نعم" : "لا"} />
              <Row k="تاريخ الإرسال" v={s("created_at") && when(s("created_at"))} />
            </dl>
          </div>
        </div>

        <aside className="admin-reg-side">
          <div className="admin-card" data-order="2">
            <h2 className="admin-card-title">حالة المتابعة</h2>
            {reviewReady ? (
              <>
                <p className="admin-card-hint">
                  {s("handled_at") ? `آخر تحديث: ${when(s("handled_at"))}` : "لم تتم متابعة هذا الطلب بعد."}
                </p>
                <RegStatusControl id={id} status={status} />
              </>
            ) : (
              <p className="admin-card-hint" style={{ margin: 0 }}>
                لتفعيل الحالات والملاحظات، طبّق الترحيل <code>0006_registrations_review.sql</code> على قاعدة البيانات.
              </p>
            )}
          </div>

          {reviewReady && (
            <div className="admin-card" data-order="4">
              <h2 className="admin-card-title">ملاحظة داخلية</h2>
              <p className="admin-card-hint">للفريق فقط — لا تصل إلى المرسِل.</p>
              <RegNoteForm id={id} note={s("admin_note")} />
            </div>
          )}

          {others.length > 0 && (
            <div className="admin-card" data-order="5">
              <h2 className="admin-card-title">طلبات أخرى من نفس المرسِل</h2>
              <ul className="admin-mini-list">
                {others.map((o) => (
                  <li key={o.id as string}>
                    <Link href={`/admin/registrations/${o.id}`} className="admin-mini-link">
                      <span>{(o.program_name as string) || REG_TYPE_LABEL[(o.program_type as string) ?? ""] || "—"}</span>
                      <span className="admin-mini-date">{formatArabicDate(String(o.created_at).slice(0, 10))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
