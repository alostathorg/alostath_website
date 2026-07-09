"use client";

import { useState, useTransition } from "react";
import { deleteRecord } from "./actions";
import ConfirmModal from "./ConfirmModal";

export default function DeleteButton({ slug, id }: { slug: string; id: string }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="admin-danger" disabled={pending} onClick={() => setOpen(true)}>
        {pending ? "…" : "حذف"}
      </button>

      <ConfirmModal
        open={open}
        title="حذف العنصر"
        message="سيتم حذف هذا العنصر نهائياً ولا يمكن التراجع. هل تريد المتابعة؟"
        confirmLabel="حذف"
        tone="danger"
        pending={pending}
        onConfirm={() => start(() => deleteRecord(slug, id))}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
