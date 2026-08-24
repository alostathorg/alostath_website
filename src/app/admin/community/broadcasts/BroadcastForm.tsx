"use client";

import { useState, useTransition } from "react";
import { INTERESTS, REGIONS, SCHOOL_STAGES } from "@/lib/community";
import { saveBroadcast } from "../actions";
import type { BroadcastAudience, CommunityBroadcast } from "@/lib/types";

export interface ContentSource {
  id: string;
  group: string;
  label: string;
  subject: string;
  body: string[];
  ctaLabel: string;
  ctaUrl: string;
}

function ChipGroup({
  name,
  legend,
  hint,
  options,
  selected,
  disabled,
}: {
  name: string;
  legend: string;
  hint: string;
  options: readonly string[];
  selected: string[];
  disabled?: boolean;
}) {
  const [value, setValue] = useState<string[]>(selected);
  return (
    <fieldset className="admin-audience">
      <legend className="admin-label">{legend}</legend>
      <p className="admin-hint" style={{ margin: "0 0 10px" }}>{hint}</p>
      <div className="cm-chips">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              className={`cm-chip${on ? " is-on" : ""}`}
              aria-pressed={on}
              disabled={disabled}
              onClick={() => setValue((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]))}
            >
              {o}
            </button>
          );
        })}
      </div>
      {value.map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
    </fieldset>
  );
}

export default function BroadcastForm({
  broadcast,
  sources,
  locked,
}: {
  broadcast: CommunityBroadcast;
  sources: ContentSource[];
  locked: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [subject, setSubject] = useState(broadcast.subject);
  const [preheader, setPreheader] = useState(broadcast.preheader ?? "");
  const [body, setBody] = useState((broadcast.body ?? []).join("\n"));
  const [ctaLabel, setCtaLabel] = useState(broadcast.cta_label ?? "");
  const [ctaUrl, setCtaUrl] = useState(broadcast.cta_url ?? "");

  const audience = (broadcast.audience ?? {}) as BroadcastAudience;
  const groups = Array.from(new Set(sources.map((s) => s.group)));

  function applySource(id: string) {
    const s = sources.find((x) => x.id === id);
    if (!s) return;
    setSubject(s.subject);
    setBody(s.body.join("\n"));
    setCtaLabel(s.ctaLabel);
    setCtaUrl(s.ctaUrl);
    setSaved(false);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const form = new FormData(e.currentTarget);
    start(async () => {
      try {
        await saveBroadcast(broadcast.id, form);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ غير متوقع");
      }
    });
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="admin-error">{error}</div>}

      {!locked && sources.length > 0 && (
        <div className="admin-card">
          <h2 className="admin-card-title">استيراد من المحتوى</h2>
          <p className="admin-card-hint">
            اختر جائزةً أو مبادرةً أو مقالاً منشوراً، فتُملأ الرسالة تلقائياً بعنوانه ونبذته ورابطه —
            ثم عدّل ما تشاء قبل الإرسال.
          </p>
          <select className="admin-select" defaultValue="" onChange={(e) => applySource(e.target.value)}>
            <option value="">اختر محتوى…</option>
            {groups.map((g) => (
              <optgroup key={g} label={g}>
                {sources.filter((s) => s.group === g).map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      <div className="admin-card">
        <h2 className="admin-card-title">نص الرسالة</h2>
        <div className="admin-form-grid">
          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="b-subject">عنوان الرسالة</label>
            <input className="admin-input" id="b-subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={locked} />
            <p className="admin-hint">هذا ما يظهر في صندوق بريد العضو.</p>
          </div>

          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="b-preheader">النص التمهيدي</label>
            <input className="admin-input" id="b-preheader" name="preheader" value={preheader} onChange={(e) => setPreheader(e.target.value)} disabled={locked} placeholder="سطر قصير يظهر بجانب العنوان في بعض تطبيقات البريد." />
          </div>

          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="b-body">النص</label>
            <textarea className="admin-textarea" id="b-body" name="body" rows={10} value={body} onChange={(e) => setBody(e.target.value)} disabled={locked} />
            <p className="admin-hint">اكتب كل فقرة في سطر مستقل — تماماً كما في نص المقال.</p>
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="b-cta-label">نص الزر</label>
            <input className="admin-input" id="b-cta-label" name="cta_label" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} disabled={locked} placeholder="مثال: تعرّف على الجائزة" />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="b-cta-url">رابط الزر</label>
            <input className="admin-input is-ltr" dir="ltr" id="b-cta-url" name="cta_url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} disabled={locked} placeholder="https://…" />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">الشريحة المستهدفة</h2>
        <p className="admin-card-hint">
          اترك الكل فارغاً لإرسالها إلى جميع الأعضاء الفعّالين الموافقين على استلام الرسائل. أي اختيار
          يضيّق الشريحة.
        </p>
        <ChipGroup name="interests" legend="الاهتمامات" hint="يصل إلى من اختار أحد هذه الاهتمامات." options={INTERESTS} selected={audience.interests ?? []} disabled={locked} />
        <ChipGroup name="regions" legend="المناطق" hint="يصل إلى أعضاء هذه المناطق فقط." options={REGIONS} selected={audience.regions ?? []} disabled={locked} />
        <ChipGroup name="stages" legend="المراحل الدراسية" hint="يصل إلى معلّمي هذه المراحل فقط." options={SCHOOL_STAGES} selected={audience.stages ?? []} disabled={locked} />
      </div>

      {!locked && (
        <div className="admin-actionbar">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
            {pending ? "جارٍ الحفظ…" : "حفظ المسودة"}
          </button>
          {saved && <span className="admin-hint">تم الحفظ.</span>}
        </div>
      )}
    </form>
  );
}
