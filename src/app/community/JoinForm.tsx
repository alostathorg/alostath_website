"use client";

import { useState } from "react";
import { CONTRIBUTIONS, INTERESTS, REGIONS, SCHOOL_STAGES, rpcErrorMessage } from "@/lib/community";
import { validEmail, validPhone } from "@/lib/validate";

/**
 * The join form for مجتمع الأستاذ.
 *
 * Deliberately a real React component rather than another branch of the
 * innerHTML modal in SiteChrome.tsx: fourteen fields, two chip pickers and a
 * per-field error state are past what that imperative flow can carry. It reuses
 * the modal's .reg-* classes so it still looks like the rest of the site.
 *
 * It also does NOT swallow failures. The three existing public forms catch and
 * show success regardless, which makes a dropped submission invisible to both
 * the visitor and the team — here a failed join says so.
 */

type Errors = Partial<Record<"full_name" | "email" | "phone" | "consent", string>>;

function Chips({
  options,
  value,
  onToggle,
}: {
  options: readonly string[];
  value: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="cm-chips">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            className={`cm-chip${on ? " is-on" : ""}`}
            aria-pressed={on}
            onClick={() => onToggle(o)}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export default function JoinForm() {
  const [interests, setInterests] = useState<string[]>([]);
  const [contribution, setContribution] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<null | "created" | "updated">(null);

  const toggle = (setter: (fn: (prev: string[]) => string[]) => void) => (v: string) =>
    setter((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (n: string) => String(fd.get(n) ?? "").trim();

    const payload = {
      full_name: get("full_name"),
      email: get("email"),
      phone: get("phone"),
      city: get("city"),
      region: get("region"),
      school_stage: get("school_stage"),
      specialization: get("specialization"),
      years_experience: get("years_experience"),
      workplace: get("workplace"),
      bio: get("bio"),
      interests,
      contribution,
      consent: fd.get("consent") === "on",
      wants_updates: fd.get("wants_updates") === "on",
      source: "community-page",
    };

    const next: Errors = {};
    if (!payload.full_name) next.full_name = "الرجاء إدخال الاسم الكامل.";
    if (!validEmail(payload.email)) next.email = "الرجاء إدخال بريد إلكتروني صحيح.";
    if (payload.phone && !validPhone(payload.phone)) next.phone = "الرجاء إدخال رقم جوال صحيح.";
    if (!payload.consent) next.consent = "يجب الموافقة على الشروط للمتابعة.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = document.querySelector(".cm-panel .reg-field.has-error input, .cm-panel .reg-field.has-error select");
      (first as HTMLElement | null)?.focus();
      return;
    }

    setFailure(null);
    setPending(true);
    try {
      const res = await fetch("/api/community/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFailure(rpcErrorMessage(json?.error));
        return;
      }
      setDone(json?.status === "updated" ? "updated" : "created");
    } catch {
      setFailure("تعذّر الاتصال بالخادم — تحقّق من اتصالك ثم أعد المحاولة.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="cm-panel">
        <div className="cm-done">
          <div className="ic">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h3>{done === "updated" ? "حدّثنا بياناتك!" : "أهلاً بك في مجتمع الأستاذ!"}</h3>
          <p>
            {done === "updated"
              ? "أنت عضوٌ معنا بالفعل، وقد حدّثنا بياناتك بنجاح. سنصل إليك بكل جديد يخصّك."
              : "سعدنا بانضمامك — ستصلك أخبار الجوائز والمبادرات والمجلس أولاً بأول، وسندعوك للمساهمة بأفكارك."}
          </p>
          <a href="#idea" className="btn btn-secondary btn-md">شارك فكرتك الآن</a>
        </div>
      </div>
    );
  }

  const field = (key: keyof Errors) => `reg-field${errors[key] ? " has-error" : ""}`;

  return (
    <div className="cm-panel">
      <div className="cm-panel-head">
        <div className="eyebrow" style={{ color: "var(--gold-600)", marginBottom: 12 }}>الانضمام</div>
        <h2>انضمّ إلى مجتمع الأستاذ</h2>
        <p>
          أخبِرنا عنك قليلاً حتى نصل إليك بما يهمّك تحديداً — لا نُرسل إلا ما يستحقّ وقتك، ويمكنك
          إلغاء الاشتراك بضغطةٍ واحدة في أي وقت.
        </p>
      </div>

      {failure && <p className="cm-alert txt-plain" role="alert">{failure}</p>}

      <form onSubmit={onSubmit} noValidate>
        <div className="cm-grid">
          <div className={field("full_name")}>
            <label className="reg-label" htmlFor="cm-name">الاسم الكامل</label>
            <input className="reg-input" id="cm-name" name="full_name" type="text" placeholder="مثال: سارة المطيري" />
            <div className="reg-error">{errors.full_name}</div>
          </div>

          <div className={field("email")}>
            <label className="reg-label" htmlFor="cm-email">البريد الإلكتروني</label>
            <input className="reg-input" id="cm-email" name="email" type="email" dir="ltr" placeholder="name@example.com" />
            <div className="reg-error">{errors.email}</div>
          </div>

          <div className={field("phone")}>
            <label className="reg-label" htmlFor="cm-phone">رقم الجوال <span className="cm-optional">(اختياري)</span></label>
            <input className="reg-input" id="cm-phone" name="phone" type="tel" dir="ltr" placeholder="05xxxxxxxx" />
            <div className="reg-error">{errors.phone}</div>
          </div>

          <div className="reg-field">
            <label className="reg-label" htmlFor="cm-region">المنطقة</label>
            <select className="reg-input" id="cm-region" name="region" defaultValue="">
              <option value="">اختر المنطقة</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="reg-field">
            <label className="reg-label" htmlFor="cm-city">المدينة <span className="cm-optional">(اختياري)</span></label>
            <input className="reg-input" id="cm-city" name="city" type="text" placeholder="مثال: الرياض" />
          </div>

          <div className="reg-field">
            <label className="reg-label" htmlFor="cm-stage">المرحلة الدراسية</label>
            <select className="reg-input" id="cm-stage" name="school_stage" defaultValue="">
              <option value="">اختر المرحلة</option>
              {SCHOOL_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="reg-field">
            <label className="reg-label" htmlFor="cm-spec">التخصص</label>
            <input className="reg-input" id="cm-spec" name="specialization" type="text" placeholder="مثال: اللغة العربية" />
          </div>

          <div className="reg-field">
            <label className="reg-label" htmlFor="cm-years">سنوات الخبرة</label>
            <input className="reg-input" id="cm-years" name="years_experience" type="number" min={0} max={60} placeholder="مثال: 8" />
          </div>

          <div className="reg-field is-wide">
            <label className="reg-label" htmlFor="cm-workplace">جهة العمل <span className="cm-optional">(اختياري)</span></label>
            <input className="reg-input" id="cm-workplace" name="workplace" type="text" placeholder="مثال: مدرسة الأمير سلطان الابتدائية" />
          </div>

          <div className="reg-field is-wide">
            <span className="reg-label">ما الذي يهمّك متابعته؟</span>
            <Chips options={INTERESTS} value={interests} onToggle={toggle(setInterests)} />
          </div>

          <div className="reg-field is-wide">
            <span className="reg-label">كيف تودّ المساهمة؟</span>
            <Chips options={CONTRIBUTIONS} value={contribution} onToggle={toggle(setContribution)} />
          </div>

          <div className="reg-field is-wide">
            <label className="reg-label" htmlFor="cm-bio">نبذة عنك <span className="cm-optional">(اختياري)</span></label>
            <textarea className="reg-input" id="cm-bio" name="bio" rows={4} placeholder="حدّثنا عن تجربتك في الميدان، أو عمّا تودّ الإسهام فيه." />
          </div>
        </div>

        <div className="reg-field">
          <label className="reg-consent">
            <input type="checkbox" name="wants_updates" defaultChecked />
            <span>أرغب في استلام أخبار المؤسسة وجوائزها ومبادراتها عبر البريد الإلكتروني.</span>
          </label>
        </div>

        <div className={field("consent")}>
          <label className="reg-consent">
            <input type="checkbox" name="consent" />
            <span>أوافق على استخدام بياناتي للتواصل معي بخصوص برامج مؤسسة الأستاذ.</span>
          </label>
          <div className="reg-error">{errors.consent}</div>
        </div>

        <button type="submit" className={`btn btn-primary btn-lg reg-submit${pending ? " is-pending" : ""}`} disabled={pending}>
          {pending ? "جارٍ الإرسال…" : "انضمّ إلى المجتمع"}
        </button>
        <p className="reg-note">لن نشارك بياناتك مع أي جهة خارجية.</p>
      </form>
    </div>
  );
}
