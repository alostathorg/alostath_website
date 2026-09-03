"use client";

import { useEffect, useState } from "react";
import { rpcErrorMessage } from "@/lib/community";
import { validEmail } from "@/lib/validate";

/**
 * «شارك فكرتك» — a teacher proposes an idea, optionally against a specific
 * initiative (initiative pages link here with ?initiative=<slug>).
 *
 * The slug is read from window.location on mount rather than via
 * useSearchParams/searchParams, both of which would opt this page out of the
 * ISR the rest of the site relies on. The field just arrives preselected.
 */

const TOPICS = [
  "تطوير مبادرة قائمة",
  "مبادرة جديدة",
  "الجوائز",
  "مجلس الأستاذ",
  "التطوير المهني للمعلّم",
  "أخرى",
];

type Errors = Partial<Record<"title" | "body" | "email", string>>;

export default function IdeaForm({
  initiatives,
}: {
  initiatives: { slug: string; name: string }[];
}) {
  const [initiativeSlug, setInitiativeSlug] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("initiative");
    if (slug && initiatives.some((i) => i.slug === slug)) setInitiativeSlug(slug);
  }, [initiatives]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (n: string) => String(fd.get(n) ?? "").trim();

    const payload = {
      name: get("name"),
      email: get("email"),
      title: get("title"),
      body: get("body"),
      topic: get("topic"),
      initiative_slug: get("initiative_slug"),
    };

    const next: Errors = {};
    if (!payload.title) next.title = "الرجاء كتابة عنوان مختصر للفكرة.";
    if (!payload.body) next.body = "الرجاء شرح فكرتك.";
    if (!validEmail(payload.email)) next.email = "الرجاء إدخال بريد إلكتروني صحيح.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setFailure(null);
    setPending(true);
    try {
      const res = await fetch("/api/community/idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFailure(rpcErrorMessage(json?.error));
        return;
      }
      setDone(true);
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
          <h3>وصلتنا فكرتك!</h3>
          <p>شكراً لك — يطّلع الفريق على كل فكرة تصله، وسنعود إليك إن احتجنا تفاصيل أكثر.</p>
          <button type="button" className="btn btn-secondary btn-md" onClick={() => setDone(false)}>
            شارك فكرة أخرى
          </button>
        </div>
      </div>
    );
  }

  const field = (key: keyof Errors) => `reg-field${errors[key] ? " has-error" : ""}`;

  return (
    <div className="cm-panel">
      <div className="cm-panel-head">
        <div className="eyebrow" style={{ color: "var(--gold-600)", marginBottom: 12 }}>صوتك</div>
        <h2>شارك فكرتك</h2>
        <p>
          أنت الأقرب إلى الميدان، وأقدر من يرى ما يحتاجه المعلّم فعلاً. اقترح مبادرةً جديدة، أو
          طوّر واحدةً قائمة — كل فكرة تصلنا يقرأها الفريق.
        </p>
      </div>

      {failure && <p className="cm-alert txt-plain" role="alert">{failure}</p>}

      <form onSubmit={onSubmit} noValidate>
        <div className={`${field("title")} is-wide`}>
          <label className="reg-label" htmlFor="cm-idea-title">عنوان الفكرة</label>
          <input className="reg-input" id="cm-idea-title" name="title" type="text" placeholder="مثال: برنامج إرشاد للمعلّمين الجدد" />
          <div className="reg-error">{errors.title}</div>
        </div>

        <div className={field("body")}>
          <label className="reg-label" htmlFor="cm-idea-body">تفاصيل الفكرة</label>
          <textarea className="reg-input" id="cm-idea-body" name="body" rows={6} placeholder="ما المشكلة التي تعالجها؟ ومن المستفيد منها؟ وكيف تُنفَّذ؟" />
          <div className="reg-error">{errors.body}</div>
        </div>

        <div className="cm-grid">
          <div className="reg-field">
            <label className="reg-label" htmlFor="cm-idea-topic">مجال الفكرة</label>
            <select className="reg-input" id="cm-idea-topic" name="topic" defaultValue="">
              <option value="">اختر المجال</option>
              {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="reg-field">
            <label className="reg-label" htmlFor="cm-idea-initiative">مرتبطة بمبادرة <span className="cm-optional">(اختياري)</span></label>
            <select
              className="reg-input"
              id="cm-idea-initiative"
              name="initiative_slug"
              value={initiativeSlug}
              onChange={(e) => setInitiativeSlug(e.target.value)}
            >
              <option value="">لا ترتبط بمبادرة محدّدة</option>
              {initiatives.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
            </select>
          </div>

          <div className="reg-field">
            <label className="reg-label" htmlFor="cm-idea-name">الاسم <span className="cm-optional">(اختياري)</span></label>
            <input className="reg-input" id="cm-idea-name" name="name" type="text" placeholder="مثال: سارة المطيري" />
          </div>

          <div className={field("email")}>
            <label className="reg-label" htmlFor="cm-idea-email">البريد الإلكتروني</label>
            <input className="reg-input" id="cm-idea-email" name="email" type="email" dir="ltr" placeholder="name@example.com" />
            <div className="reg-error">{errors.email}</div>
          </div>
        </div>

        <button type="submit" className={`btn btn-primary btn-lg reg-submit${pending ? " is-pending" : ""}`} disabled={pending}>
          {pending ? "جارٍ الإرسال…" : "أرسل الفكرة"}
        </button>
        <p className="reg-note">إن كان بريدك مسجّلاً في المجتمع، سنربط الفكرة بعضويتك تلقائياً.</p>
      </form>
    </div>
  );
}
