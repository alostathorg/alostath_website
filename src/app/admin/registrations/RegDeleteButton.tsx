"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRegistration } from "../actions";
import ConfirmModal from "../ConfirmModal";
import { toast } from "../Toaster";
import { Icon } from "../icons";

export default function RegDeleteButton({
  id,
  name,
  redirectTo,
  variant = "icon",
}: {
  id: string;
  name?: string;
  /** Where to go once it's gone — the detail page sends you back to the inbox. */
  redirectTo?: string;
  variant?: "icon" | "button";
}) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function confirmDelete() {
    start(async () => {
      try {
        await deleteRegistration(id);
        setOpen(false);
        toast("تم حذف الطلب.");
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
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
        className={variant === "button" ? "admin-btn admin-btn-ghost admin-btn-sm is-danger" : "admin-iconbtn is-danger"}
        disabled={pending}
        onClick={() => setOpen(true)}
        aria-label={name ? `حذف طلب ${name}` : "حذف الطلب"}
        title="حذف"
      >
        {Icon.trash}
        {variant === "button" && "حذف"}
      </button>

      <ConfirmModal
        open={open}
        title="حذف الطلب"
        message="سيتم حذف هذا الطلب نهائياً. هل تريد المتابعة؟"
        confirmLabel="حذف نهائياً"
        tone="danger"
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
