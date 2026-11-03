"use client";

import { toast } from "./Toaster";
import { Icon } from "./icons";

export default function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      className="admin-iconbtn is-sm"
      aria-label={label}
      title={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast("تم النسخ.");
        } catch {
          toast("تعذّر النسخ", "error");
        }
      }}
    >
      {Icon.copy}
    </button>
  );
}
