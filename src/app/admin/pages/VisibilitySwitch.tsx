"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setVisibility } from "../actions";
import ConfirmModal from "../ConfirmModal";

export default function VisibilitySwitch({
  group,
  itemKey,
  label,
  on,
  dimmed = false,
}: {
  group: "pages" | "home_sections";
  itemKey: string;
  label: string;
  on: boolean;
  /** Switch is on but the item is still hidden (its parent page is off). */
  dimmed?: boolean;
}) {
  const [value, setValue] = useState(on);
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  function save(next: boolean) {
    setErr(null);
    setValue(next);
    start(async () => {
      try {
        await setVisibility(group, itemKey, next);
        setConfirm(false);
        router.refresh();
      } catch (e) {
        setValue(!next);
        setConfirm(false);
        setErr(e instanceof Error ? e.message : "تعذّر الحفظ");
      }
    });
  }

  function onChange() {
    // Turning a whole page off takes it off the live site — ask first.
    if (value && group === "pages") setConfirm(true);
    else save(!value);
  }

  const state = pending ? "جارٍ الحفظ…" : dimmed && value ? "مخفي" : value ? "مفعّلة" : "موقوفة";

  return (
    <div className="admin-vis-ctl">
      <label className="admin-toggle" style={dimmed ? { opacity: 0.55 } : undefined}>
        <span className={`admin-vis-state${value && !dimmed ? " is-on" : ""}`}>{state}</span>
        <input type="checkbox" checked={value} disabled={pending} onChange={onChange} aria-label={`تفعيل «${label}»`} />
        <span className="track" />
      </label>
      {err && <p className="admin-hint" style={{ color: "#b3261e" }}>{err}</p>}

      <ConfirmModal
        open={confirm}
        title="إيقاف الصفحة"
        message={`ستختفي «${label}» من الموقع وقوائمه، ويظهر لمن يفتح رابطها صفحة «غير موجودة». يمكنك إعادة تفعيلها في أي وقت.`}
        confirmLabel="إيقاف"
        tone="danger"
        pending={pending}
        onConfirm={() => save(false)}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}
