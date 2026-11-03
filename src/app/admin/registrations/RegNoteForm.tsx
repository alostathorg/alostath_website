"use client";

import { useState, useTransition } from "react";
import { saveRegistrationNote } from "../actions";
import { toast } from "../Toaster";

export default function RegNoteForm({ id, note }: { id: string; note: string }) {
  const [pending, start] = useTransition();
  const [value, setValue] = useState(note);
  const [saved, setSaved] = useState(note);
  const dirty = value.trim() !== saved.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        start(async () => {
          try {
            await saveRegistrationNote(id, form);
            setSaved(value);
            toast("تم حفظ الملاحظة.");
          } catch (err) {
            toast(err instanceof Error ? err.message : "تعذّر الحفظ", "error");
          }
        });
      }}
    >
      <textarea
        className="admin-textarea"
        name="admin_note"
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="مثال: تم التواصل هاتفياً، وسيرسل السيرة الذاتية الأسبوع القادم."
        aria-label="ملاحظة داخلية"
      />
      <div className="admin-note-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm" disabled={pending || !dirty}>
          {pending ? "جارٍ الحفظ…" : "حفظ الملاحظة"}
        </button>
        {!dirty && saved && <span className="admin-hint" style={{ margin: 0 }}>محفوظة</span>}
      </div>
    </form>
  );
}
