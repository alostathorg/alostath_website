"use client";

import { useState, useTransition } from "react";
import { deleteRegistration } from "../actions";
import ConfirmModal from "../ConfirmModal";

export default function RegDeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="admin-danger" disabled={pending} onClick={() => setOpen(true)}>
        {pending ? "…" : "حذف"}
      </button>

      <ConfirmModal
        open={open}
        title="حذف الطلب"
        message="سيتم حذف هذا الطلب نهائياً. هل تريد المتابعة؟"
        confirmLabel="حذف"
        tone="danger"
        pending={pending}
        onConfirm={() => start(() => deleteRegistration(id))}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
