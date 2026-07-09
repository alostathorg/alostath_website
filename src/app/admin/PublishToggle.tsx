"use client";

import { useTransition } from "react";
import { togglePublished } from "./actions";

export default function PublishToggle({ slug, id, published }: { slug: string; id: string; published: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className={`admin-pubtoggle ${published ? "is-on" : "is-off"}`}
      disabled={pending}
      onClick={() => {
        const msg = published
          ? "هل تريد إلغاء نشر هذا العنصر وإخفاءه من الموقع؟"
          : "هل تريد نشر هذا العنصر على الموقع؟";
        if (confirm(msg)) start(() => togglePublished(slug, id, !published));
      }}
      title={published ? "إخفاء من الموقع" : "نشر على الموقع"}
    >
      {pending ? "…" : published ? "إلغاء النشر" : "نشر"}
    </button>
  );
}
