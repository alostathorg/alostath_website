"use client";

import { useTransition } from "react";
import { deleteRecord } from "./actions";

export default function DeleteButton({ slug, id }: { slug: string; id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="admin-danger"
      disabled={pending}
      onClick={() => {
        if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) start(() => deleteRecord(slug, id));
      }}
    >
      {pending ? "…" : "حذف"}
    </button>
  );
}
