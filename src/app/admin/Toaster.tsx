"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "./icons";

// One toast area for the whole dashboard. Two ways in:
//  • a `?notice=<key>` on the URL — what a server action that redirects uses
//    (saveRecord → list page). The param is stripped once shown so a refresh
//    does not replay it.
//  • `toast("…")` from any client component (publish / delete buttons).

type Tone = "success" | "error";
type Toast = { id: number; text: string; tone: Tone };

const EVENT = "admin:toast";

const NOTICES: Record<string, string> = {
  saved: "تم حفظ التغييرات بنجاح.",
  created: "تمت الإضافة بنجاح.",
};

export function toast(text: string, tone: Tone = "success") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { text, tone } }));
}

export default function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const push = useCallback((text: string, tone: Tone) => {
    const id = ++seq.current;
    setItems((xs) => [...xs, { id, text, tone }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), tone === "error" ? 6000 : 3200);
  }, []);

  useEffect(() => {
    const on = (e: Event) => {
      const { text, tone } = (e as CustomEvent<{ text: string; tone: Tone }>).detail;
      push(text, tone);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, [push]);

  const notice = params.get("notice");
  useEffect(() => {
    if (!notice) return;
    const text = NOTICES[notice];
    if (text) push(text, "success");
    const rest = new URLSearchParams(params.toString());
    rest.delete("notice");
    const qs = rest.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice]);

  return (
    <div className="admin-toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`admin-toast is-${t.tone}`}>
          <span className="admin-toast-ico">{t.tone === "error" ? Icon.alert : Icon.check}</span>
          <span>{t.text}</span>
          <button
            type="button"
            className="admin-toast-x"
            aria-label="إغلاق"
            onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))}
          >
            {Icon.close}
          </button>
        </div>
      ))}
    </div>
  );
}
