"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setMemberStatus } from "./actions";
import { MEMBER_STATUS_LABEL } from "@/lib/community";
import type { MemberStatus } from "@/lib/types";

const OPTIONS: MemberStatus[] = ["active", "pending", "unsubscribed", "blocked"];

export default function MemberStatusSelect({ id, status }: { id: string; status: MemberStatus }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <select
      className="admin-select"
      value={status}
      disabled={pending}
      aria-label="حالة العضو"
      onChange={(e) => {
        const next = e.target.value as MemberStatus;
        start(async () => {
          try {
            await setMemberStatus(id, next);
            router.refresh();
          } catch (err) {
            alert(err instanceof Error ? err.message : "تعذّر تغيير الحالة");
          }
        });
      }}
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>{MEMBER_STATUS_LABEL[o]}</option>
      ))}
    </select>
  );
}
