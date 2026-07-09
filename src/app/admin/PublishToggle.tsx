"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePublished } from "./actions";
import ConfirmModal from "./ConfirmModal";

export default function PublishToggle({ slug, id, published }: { slug: string; id: string; published: boolean }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function confirmToggle() {
    start(async () => {
      try {
        await togglePublished(slug, id, !published);
        setOpen(false);
        router.refresh();
      } catch (err) {
        setOpen(false);
        alert(err instanceof Error ? err.message : "تعذّر تغيير حالة النشر");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        className={`admin-pubtoggle ${published ? "is-on" : "is-off"}`}
        disabled={pending}
        onClick={() => setOpen(true)}
        title={published ? "إخفاء من الموقع" : "نشر على الموقع"}
      >
        {pending ? "…" : published ? "إلغاء النشر" : "نشر"}
      </button>

      <ConfirmModal
        open={open}
        title={published ? "إلغاء النشر" : "نشر على الموقع"}
        message={
          published
            ? "سيتم إخفاء هذا العنصر من الموقع. هل تريد المتابعة؟"
            : "سيظهر هذا العنصر للزوّار على الموقع. هل تريد المتابعة؟"
        }
        confirmLabel={published ? "إلغاء النشر" : "نشر"}
        tone={published ? "danger" : "primary"}
        pending={pending}
        onConfirm={confirmToggle}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
