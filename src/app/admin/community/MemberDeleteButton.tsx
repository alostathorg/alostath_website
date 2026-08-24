"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMember } from "./actions";
import ConfirmModal from "../ConfirmModal";

export default function MemberDeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        className="admin-danger"
        disabled={pending}
        onClick={() => setOpen(true)}
        aria-label={`حذف ${name}`}
      >
        {pending ? "…" : "حذف"}
      </button>

      <ConfirmModal
        open={open}
        title="حذف العضو"
        message={`سيتم حذف «${name}» من المجتمع نهائياً، ولن تُحذف أفكاره لكنها ستفقد ارتباطها به. هل تريد المتابعة؟`}
        confirmLabel="حذف"
        tone="danger"
        pending={pending}
        onConfirm={() =>
          start(async () => {
            try {
              await deleteMember(id);
              setOpen(false);
              router.refresh();
            } catch (err) {
              setOpen(false);
              alert(err instanceof Error ? err.message : "تعذّر الحذف");
            }
          })
        }
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
