"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMember } from "./actions";
import ConfirmModal from "../ConfirmModal";
import { toast } from "../Toaster";
import { Icon } from "../icons";

export default function MemberDeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        className="admin-iconbtn is-danger"
        disabled={pending}
        onClick={() => setOpen(true)}
        aria-label={`حذف ${name}`}
        title="حذف"
      >
        {Icon.trash}
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
              toast(`تم حذف «${name}».`);
              router.refresh();
            } catch (err) {
              setOpen(false);
              toast(err instanceof Error ? err.message : "تعذّر الحذف", "error");
            }
          })
        }
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
