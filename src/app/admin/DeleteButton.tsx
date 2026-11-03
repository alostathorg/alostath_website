"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRecord } from "./actions";
import ConfirmModal from "./ConfirmModal";
import { toast } from "./Toaster";
import { Icon } from "./icons";

export default function DeleteButton({ slug, id, label }: { slug: string; id: string; label?: string }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function confirmDelete() {
    start(async () => {
      try {
        await deleteRecord(slug, id);
        setOpen(false);
        toast(label ? `تم حذف «${label}».` : "تم الحذف.");
        router.refresh();
      } catch (err) {
        setOpen(false);
        toast(err instanceof Error ? err.message : "تعذّر الحذف", "error");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        className="admin-iconbtn is-danger"
        disabled={pending}
        onClick={() => setOpen(true)}
        aria-label={label ? `حذف ${label}` : "حذف"}
        title="حذف"
      >
        {Icon.trash}
      </button>

      <ConfirmModal
        open={open}
        title="حذف العنصر"
        message={
          label
            ? `سيتم حذف «${label}» نهائياً ولا يمكن التراجع. هل تريد المتابعة؟`
            : "سيتم حذف هذا العنصر نهائياً ولا يمكن التراجع. هل تريد المتابعة؟"
        }
        confirmLabel="حذف نهائياً"
        tone="danger"
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
