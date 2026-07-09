"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePublished } from "./actions";

export default function PublishToggle({ slug, id, published }: { slug: string; id: string; published: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  function onClick() {
    const msg = published
      ? "هل تريد إلغاء نشر هذا العنصر وإخفاءه من الموقع؟"
      : "هل تريد نشر هذا العنصر على الموقع؟";
    if (!confirm(msg)) return;
    start(async () => {
      try {
        await togglePublished(slug, id, !published);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "تعذّر تغيير حالة النشر");
      }
    });
  }

  return (
    <button
      type="button"
      className={`admin-pubtoggle ${published ? "is-on" : "is-off"}`}
      disabled={pending}
      onClick={onClick}
      title={published ? "إخفاء من الموقع" : "نشر على الموقع"}
    >
      {pending ? "…" : published ? "إلغاء النشر" : "نشر"}
    </button>
  );
}
