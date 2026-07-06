"use client";

import { useTransition } from "react";
import { deleteRegistration } from "../actions";

export default function RegDeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("حذف هذا الطلب؟")) start(() => deleteRegistration(id));
      }}
      style={{ background: "none", border: "none", color: "#b3261e", fontWeight: 600, cursor: "pointer", fontSize: 14, padding: 0 }}
    >
      {pending ? "…" : "حذف"}
    </button>
  );
}
