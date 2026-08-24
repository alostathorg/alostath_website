"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validate";

/**
 * Flips a member's subscription by token. Invoked from a <form action>, so the
 * mutation is a POST — the page itself never changes anything on GET.
 */
export async function setSubscription(token: string, resubscribe: boolean) {
  if (!isUuid(token)) redirect(`/community/unsubscribe?state=error`);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("community_unsubscribe", { t: token, resubscribe });

  const result = (data ?? {}) as { ok?: boolean };
  const state = error || !result.ok ? "error" : resubscribe ? "resubscribed" : "unsubscribed";
  if (error) console.error("community_unsubscribe failed —", error.message);

  redirect(`/community/unsubscribe?t=${encodeURIComponent(token)}&state=${state}`);
}
