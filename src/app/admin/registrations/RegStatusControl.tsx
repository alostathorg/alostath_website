"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setRegistrationStatus } from "../actions";
import { toast } from "../Toaster";
import { REVIEW_STATUSES, REVIEW_STATUS_LABEL, type ReviewStatus } from "@/lib/registrations";

/** Segmented control: where the team is with this request. */
export default function RegStatusControl({ id, status }: { id: string; status: ReviewStatus }) {
  const [pending, start] = useTransition();
  const [current, setCurrent] = useState(status);
  const router = useRouter();

  function pick(next: ReviewStatus) {
    if (next === current) return;
    const prev = current;
    setCurrent(next);
    start(async () => {
      try {
        await setRegistrationStatus(id, next);
        toast(`تم تغيير الحالة إلى «${REVIEW_STATUS_LABEL[next]}».`);
        router.refresh();
      } catch (err) {
        setCurrent(prev);
        toast(err instanceof Error ? err.message : "تعذّر تغيير الحالة", "error");
      }
    });
  }

  return (
    <div className="admin-segmented" role="radiogroup" aria-label="حالة الطلب" aria-busy={pending}>
      {REVIEW_STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={current === s}
          className={`admin-segmented-btn is-${s}${current === s ? " is-active" : ""}`}
          disabled={pending}
          onClick={() => pick(s)}
        >
          <span className="dot" aria-hidden="true" />
          {REVIEW_STATUS_LABEL[s]}
        </button>
      ))}
    </div>
  );
}
