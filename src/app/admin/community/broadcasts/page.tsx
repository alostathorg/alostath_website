import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate } from "@/lib/format";
import { BROADCAST_STATUS_LABEL } from "@/lib/community";
import type { CommunityBroadcast } from "@/lib/types";
import { createBroadcast } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_CLASS: Record<string, string> = {
  draft: "is-draft",
  sending: "is-soon",
  sent: "is-pub",
  failed: "is-closed",
};

export default async function BroadcastsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_broadcasts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as CommunityBroadcast[];

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">رسائل المجتمع</h1>
          <p className="admin-subtitle">
            أرسل خبراً أو إعلاناً إلى أعضاء المجتمع — أو إلى شريحةٍ منهم حسب الاهتمام أو المنطقة أو
            المرحلة.
          </p>
        </div>
        <form action={createBroadcast}>
          <button type="submit" className="admin-btn admin-btn-primary">+ رسالة جديدة</button>
        </form>
      </div>

      <div className="admin-tablewrap">
        <table className="admin-table" aria-label="رسائل المجتمع">
          <thead>
            <tr>
              {["العنوان", "الحالة", "المستلمون", "أُرسلت", "فشلت", "التاريخ"].map((h) => (
                <th key={h}>{h}</th>
              ))}
              <th style={{ textAlign: "end" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id}>
                <td className="col-name">{b.subject}</td>
                <td>
                  <span className={`admin-badge ${STATUS_CLASS[b.status] ?? "is-type"}`}>
                    <span className="dot" />{BROADCAST_STATUS_LABEL[b.status]}
                  </span>
                </td>
                <td className="admin-cell-num">{b.recipient_count}</td>
                <td className="admin-cell-num">{b.sent_count}</td>
                <td className="admin-cell-num">{b.failed_count}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {formatArabicDate((b.sent_at ?? b.created_at).slice(0, 10))}
                </td>
                <td style={{ textAlign: "end" }}>
                  <Link href={`/admin/community/broadcasts/${b.id}`} className="admin-edit">
                    {b.status === "draft" ? "تحرير" : "عرض"}
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-empty">
                  لا توجد رسائل بعد — أنشئ رسالة جديدة لإعلام أعضاء المجتمع بآخر ما نشرتموه.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
