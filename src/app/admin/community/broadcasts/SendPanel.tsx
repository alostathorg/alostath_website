"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "../../ConfirmModal";
import { prepareBroadcast, sendBroadcastBatch } from "../actions";
import type { BroadcastStatus } from "@/lib/types";

/**
 * Drives a broadcast to completion one batch at a time.
 *
 * Each sendBroadcastBatch() call handles at most 100 recipients, so no single
 * request can outlive a serverless timeout. Progress is persisted per recipient
 * in the DB, which means closing this tab mid-send is safe: reopening the page
 * shows «متابعة الإرسال» and picks up exactly where it stopped.
 */
export default function SendPanel({
  id,
  status,
  recipientCount,
  sentCount,
  failedCount,
  emailReady,
}: {
  id: string;
  status: BroadcastStatus;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  emailReady: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState<{ sent: number; failed: number; total: number } | null>(null);

  const resuming = status === "sending";
  const finished = status === "sent";

  async function run() {
    setConfirming(false);
    setError(null);
    setRunning(true);
    try {
      const { total } = await prepareBroadcast(id);
      setLive({ sent: 0, failed: 0, total });

      // 200 batches × 100 = 20,000 recipients per run; the guard exists so a
      // stuck queue can never spin forever.
      for (let i = 0; i < 200; i++) {
        const r = await sendBroadcastBatch(id);
        setLive({ sent: r.sent, failed: r.failed, total: r.sent + r.failed + r.remaining });
        if (r.done) break;
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الإرسال");
    } finally {
      setRunning(false);
    }
  }

  const total = live?.total ?? recipientCount;
  const sent = live?.sent ?? sentCount;
  const failed = live?.failed ?? failedCount;
  const pct = total > 0 ? Math.round(((sent + failed) / total) * 100) : 0;

  return (
    <div className="admin-card">
      <h2 className="admin-card-title">الإرسال</h2>

      {!emailReady && (
        <div className="admin-error">
          لم يُضبط مفتاح <code>RESEND_API_KEY</code> على الخادم، فلا يمكن الإرسال بعد. يمكنك مع ذلك
          حفظ المسودة، أو تصدير الأعضاء كملف CSV والإرسال من أداتكم الحالية.
        </div>
      )}
      {error && <div className="admin-error">{error}</div>}

      {(running || total > 0) && (
        <>
          <div className="admin-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="admin-hint" style={{ marginTop: 10 }}>
            أُرسلت {sent} من {total}
            {failed > 0 ? ` · فشلت ${failed}` : ""}
            {running ? " · جارٍ الإرسال…" : ""}
          </p>
        </>
      )}

      {finished && !running ? (
        <p className="admin-hint" style={{ margin: "8px 0 0" }}>
          اكتمل إرسال هذه الرسالة. أنشئ رسالةً جديدة لإرسال محتوى آخر.
        </p>
      ) : (
        <div className="admin-actionbar">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={running || !emailReady}
            onClick={() => setConfirming(true)}
          >
            {running ? "جارٍ الإرسال…" : resuming ? "متابعة الإرسال" : "إرسال إلى الشريحة"}
          </button>
          <span className="admin-hint">احفظ المسودة أولاً حتى تُرسل آخر التعديلات.</span>
        </div>
      )}

      <ConfirmModal
        open={confirming}
        title={resuming ? "متابعة الإرسال" : "إرسال الرسالة"}
        message={
          resuming
            ? "سنكمل الإرسال إلى من لم تصلهم الرسالة بعد. لن تُرسل مرتين لأحد."
            : "ستُرسل هذه الرسالة بالبريد الإلكتروني إلى كل عضو مطابق للشريحة المحدّدة. لا يمكن التراجع بعد الإرسال."
        }
        confirmLabel={resuming ? "متابعة" : "إرسال"}
        pending={running}
        onConfirm={run}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
