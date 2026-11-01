"use client";

import { useActionState, useState } from "react";
import { saveTranslation, type SaveState } from "../actions";
import { MODE_LABELS, TRANSLATION_CATEGORIES, formatCount } from "@/lib/translations";
import type { Translation } from "@/lib/types";

const countWords = (ps: string[]) =>
  ps.reduce((n, p) => n + (p.trim() ? p.trim().split(/\s+/).length : 0), 0);

/**
 * The review screen. Every paragraph of the Arabic sits beside the paragraph
 * of the original it translates (aligned 1:1 for full translations; for a
 * summary the original column simply shows the excerpts the task kept), each
 * one editable and numbered the way the PDF numbers it, so a colleague's
 * «الفقرة 4» lands on the right box.
 *
 * One form, five buttons: the pressed button's `intent` decides what happens
 * after the save — keep the status, publish, send back for rewriting, reject,
 * or take a published item back to review.
 */
export default function TranslationEditor({ item }: { item: Translation }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveTranslation.bind(null, item.id), undefined);
  const [body, setBody] = useState<string[]>(item.body.length ? item.body : [""]);
  const original = item.original_body ?? [];
  const rows = Math.max(body.length, original.length);

  const setPara = (i: number, v: string) => setBody((b) => b.map((p, j) => (j === i ? v : p)));
  const addPara = (at: number) => setBody((b) => [...b.slice(0, at), "", ...b.slice(at)]);
  const removePara = (i: number) => setBody((b) => (b.length > 1 ? b.filter((_, j) => j !== i) : [""]));

  const isPublished = item.status === "published";

  return (
    <form action={action} className="tr-editor">
      {state?.error && <div className="admin-error" role="alert">{state.error}</div>}
      {state?.ok && <div className="tr-ok" role="status">{state.ok}</div>}

      <div className="admin-card">
        <h2 className="admin-card-title">بيانات المادة</h2>
        <p className="admin-card-hint">العنوان والملخص يظهران على بطاقة المادة وفي رأس ملف PDF.</p>
        <div className="admin-form-grid">
          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="title">العنوان بالعربية</label>
            <input className="admin-input" id="title" name="title" defaultValue={item.title} required />
          </div>
          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="original_title">العنوان الأصلي</label>
            <input className="admin-input is-ltr" id="original_title" name="original_title" defaultValue={item.original_title ?? ""} dir="ltr" />
          </div>
          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="excerpt">الملخّص (سطران)</label>
            <textarea className="admin-textarea" id="excerpt" name="excerpt" defaultValue={item.excerpt ?? ""} rows={3} />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="category">التصنيف</label>
            <select className="admin-select" id="category" name="category" defaultValue={item.category ?? ""}>
              <option value="">— بدون تصنيف —</option>
              {TRANSLATION_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              {item.category && !(TRANSLATION_CATEGORIES as readonly string[]).includes(item.category) && (
                <option value={item.category}>{item.category}</option>
              )}
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="mode">نوع المادة</label>
            <select className="admin-select" id="mode" name="mode" defaultValue={item.mode}>
              {Object.entries(MODE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <p className="admin-hint">«ترجمة كاملة» فقط لمصدر برخصة مفتوحة تسمح بالترجمة.</p>
          </div>
          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="slug">مُعرّف الرابط</label>
            <input className="admin-input is-ltr" id="slug" name="slug" defaultValue={item.slug} dir="ltr" required />
            <p className="admin-hint">بالإنجليزية وبدون مسافات — يظهر في رابط المادة على الموقع.</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">المصدر والرخصة</h2>
        <p className="admin-card-hint">تحقّق من الرخصة قبل الاعتماد: الترجمة الكاملة لا تُنشر إلا لمصدر يسمح بها.</p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="source_name">اسم المصدر</label>
            <input className="admin-input" id="source_name" name="source_name" defaultValue={item.source_name ?? ""} />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="author">المؤلف</label>
            <input className="admin-input" id="author" name="author" defaultValue={item.author ?? ""} />
          </div>
          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="source_url">رابط المادة الأصلية</label>
            <div className="tr-inline">
              <input className="admin-input is-ltr" id="source_url" name="source_url" defaultValue={item.source_url ?? ""} dir="ltr" />
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm">فتح ↗</a>
              )}
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="source_date">تاريخ النشر الأصلي</label>
            <input className="admin-input" id="source_date" name="source_date" defaultValue={item.source_date ?? ""} />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="license">الرخصة</label>
            <input className="admin-input is-ltr" id="license" name="license" defaultValue={item.license ?? ""} dir="ltr" placeholder="CC BY 4.0" />
          </div>
          <div className="admin-field is-wide">
            <label className="admin-label" htmlFor="license_url">رابط الرخصة</label>
            <input className="admin-input is-ltr" id="license_url" name="license_url" defaultValue={item.license_url ?? ""} dir="ltr" />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="tr-paras-head">
          <div>
            <h2 className="admin-card-title">النص — فقرةً فقرة</h2>
            <p className="admin-card-hint" style={{ margin: 0 }}>
              {item.mode === "full"
                ? "كل فقرة عربية بجانب الفقرة الأصلية التي تترجمها. الأرقام نفسها في ملف PDF."
                : "ملخّص مترجم: العمود الأيسر يعرض مقتطفات من الأصل للرجوع إليها."}
            </p>
          </div>
          <span className="admin-badge is-type">{formatCount(countWords(body))} كلمة</span>
        </div>

        <div className="tr-paras">
          <div className="tr-paras-cols" aria-hidden>
            <span />
            <span>الترجمة العربية</span>
            <span>الأصل</span>
          </div>
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="tr-para">
              <span className="tr-para-n">{i + 1}</span>
              <div className="tr-para-ar">
                {i < body.length ? (
                  <>
                    <textarea
                      className="admin-textarea"
                      name="body"
                      value={body[i]}
                      onChange={(e) => setPara(i, e.target.value)}
                      rows={Math.min(14, Math.max(3, Math.ceil(body[i].length / 90)))}
                      aria-label={`الفقرة ${i + 1}`}
                    />
                    <div className="tr-para-tools">
                      <button type="button" className="tr-link" onClick={() => addPara(i + 1)}>+ فقرة بعدها</button>
                      <button type="button" className="tr-link is-danger" onClick={() => removePara(i)}>حذف الفقرة</button>
                    </div>
                  </>
                ) : (
                  <button type="button" className="tr-link" onClick={() => addPara(body.length)}>+ إضافة فقرة</button>
                )}
              </div>
              <div className="tr-para-orig" dir="ltr">{original[i] ?? ""}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">ملاحظات المراجعة</h2>
        <p className="admin-card-hint">
          عند الضغط على «إعادة صياغة» تقرأ المهمة الأسبوعية هذه الملاحظات وتعيد كتابة المادة على ضوئها، ثم تعود إليك
          للمراجعة. ولا تظهر الملاحظات على الموقع.
        </p>
        <textarea
          className="admin-textarea"
          name="review_note"
          defaultValue={item.review_note ?? ""}
          rows={4}
          placeholder="مثال: الفقرة 3 — «assessment» تُترجم «التقويم» لا «التقييم»؛ الفقرة 6 تحتاج صياغة أبسط."
        />
      </div>

      <div className="admin-actionbar tr-actions">
        <button type="submit" name="intent" value="save" className="admin-btn admin-btn-ghost" disabled={pending}>
          حفظ التعديلات
        </button>
        <span className="tr-actions-gap" />
        {isPublished ? (
          <button type="submit" name="intent" value="draft" className="admin-btn admin-btn-ghost" disabled={pending}>
            إخفاء من الموقع وإعادتها للمراجعة
          </button>
        ) : (
          <>
            <button type="submit" name="intent" value="reject" className="admin-btn admin-btn-danger" disabled={pending}>
              رفض
            </button>
            <button type="submit" name="intent" value="revise" className="admin-btn admin-btn-ghost" disabled={pending}>
              إعادة صياغة
            </button>
            <button type="submit" name="intent" value="publish" className="admin-btn admin-btn-primary" disabled={pending}>
              {pending ? "…" : "اعتماد ونشر"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
