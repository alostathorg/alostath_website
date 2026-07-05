"use client";

import { useTransition } from "react";
import { deleteRecord } from "./actions";

export default function DeleteButton({ slug, id }: { slug: string; id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) start(() => deleteRecord(slug, id));
      }}
      style={{ background: "none", border: "none", color: "#b3261e", fontWeight: 600, cursor: "pointer", fontSize: 14, padding: 0 }}
    >
      {pending ? "…" : "حذف"}
    </button>
  );
}
