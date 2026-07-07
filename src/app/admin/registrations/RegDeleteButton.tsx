"use client";

import { useTransition } from "react";
import { deleteRegistration } from "../actions";

export default function RegDeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="admin-danger"
      disabled={pending}
      onClick={() => {
        if (confirm("حذف هذا الطلب؟")) start(() => deleteRegistration(id));
      }}
    >
      {pending ? "…" : "حذف"}
    </button>
  );
}
