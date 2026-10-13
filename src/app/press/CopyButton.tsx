"use client";

import { useState } from "react";

/** Copies `text` to the clipboard and says so for a moment. */
export default function CopyButton({ text, label = "نسخ", className = "pr-copy" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`${className}${done ? " is-done" : ""}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard unavailable — the text stays selectable */
        }
      }}
    >
      {done ? "تم النسخ ✓" : label}
    </button>
  );
}
