"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "../../ConfirmModal";
import { deleteIdea, setIdeaStatus, toggleIdeaFeatured } from "../actions";
import { IDEA_STATUS_LABEL } from "@/lib/community";
import type { IdeaStatus } from "@/lib/types";

const OPTIONS: IdeaStatus[] = ["new", "reviewing", "accepted", "archived"];

export default function IdeaControls({
  id,
  title,
  status,
  featured,
}: {
  id: string;
  title: string;
  status: IdeaStatus;
  featured: boolean;
}) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const run = (fn: () => Promise<void>) =>
    start(async () => {
      try {
        await fn();
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "تعذّر تنفيذ العملية");
      }
    });

  return (
    <span className="admin-rowactions">
      <select
        className="admin-select"
        value={status}
        disabled={pending}
        aria-label="حالة الفكرة"
        onChange={(e) => run(() => setIdeaStatus(id, e.target.value as IdeaStatus))}
      >
        {OPTIONS.map((o) => (
          <option key={o} value={o}>{IDEA_STATUS_LABEL[o]}</option>
        ))}
      </select>

      <button
        type="button"
        className={`admin-pubtoggle ${featured ? "is-on" : "is-off"}`}
        disabled={pending}
        onClick={() => run(() => toggleIdeaFeatured(id, !featured))}
        title={featured ? "إخفاء من «أصوات المجتمع»" : "إبراز ضمن «أصوات المجتمع» على صفحة المجتمع"}
      >
        {pending ? "…" : featured ? "إلغاء الإبراز" : "إبراز"}
      </button>

      <button type="button" className="admin-danger" disabled={pending} onClick={() => setConfirming(true)}>
        حذف
      </button>

      <ConfirmModal
        open={confirming}
        title="حذف الفكرة"
        message={`سيتم حذف «${title}» نهائياً ولا يمكن التراجع. هل تريد المتابعة؟`}
        confirmLabel="حذف"
        tone="danger"
        pending={pending}
        onConfirm={() => {
          run(() => deleteIdea(id));
          setConfirming(false);
        }}
        onCancel={() => setConfirming(false)}
      />
    </span>
  );
}
