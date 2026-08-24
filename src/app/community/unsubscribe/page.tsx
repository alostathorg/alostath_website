import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { setSubscription } from "./actions";
import { isUuid } from "@/lib/validate";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "إدارة الاشتراك",
  robots: { index: false, follow: false },
};

const COPY = {
  unsubscribed: {
    title: "تم إلغاء اشتراكك",
    body: "لن تصلك رسائل مجتمع الأستاذ بعد الآن. يمكنك العودة إلينا متى شئت.",
    action: "أعد الاشتراك",
    resubscribe: true,
  },
  resubscribed: {
    title: "أهلاً بعودتك!",
    body: "أعدنا تفعيل اشتراكك، وستصلك أخبار الجوائز والمبادرات والمجلس كالسابق.",
    action: "إلغاء الاشتراك",
    resubscribe: false,
  },
  confirm: {
    title: "إلغاء الاشتراك في مجتمع الأستاذ",
    body: "لن تصلك بعدها رسائلنا عن الجوائز والمبادرات وجلسات المجلس. هل تريد المتابعة؟",
    action: "نعم، ألغِ اشتراكي",
    resubscribe: false,
  },
} as const;

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; state?: string }>;
}) {
  const { t, state } = await searchParams;

  const invalid = !t || !isUuid(t) || state === "error";
  const copy = state === "unsubscribed" ? COPY.unsubscribed : state === "resubscribed" ? COPY.resubscribed : COPY.confirm;

  return (
    <PageShell>
      <section style={{ maxWidth: 620, margin: "0 auto", padding: "clamp(72px,12vh,120px) 32px" }}>
        <div className="cm-panel" style={{ textAlign: "center" }}>
          {invalid ? (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: "0 0 12px" }}>الرابط غير صالح</h1>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 0 28px" }}>
                تعذّر التعرّف على هذا الرابط. افتح الرابط من آخر رسالةٍ وصلتك منّا، أو تواصل معنا
                وسنتولّى الأمر.
              </p>
              <Link href="/contact" className="btn btn-primary btn-md">تواصل معنا</Link>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: "0 0 12px" }}>{copy.title}</h1>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 0 28px" }}>{copy.body}</p>
              <form action={setSubscription.bind(null, t!, copy.resubscribe)}>
                <button
                  type="submit"
                  className={`btn ${copy.resubscribe ? "btn-primary" : "btn-outline"} btn-md`}
                >
                  {copy.action}
                </button>
              </form>
              <p style={{ fontSize: 13.5, color: "var(--ink-subtle)", margin: "22px 0 0" }}>
                <Link href="/community" style={{ color: "var(--olive-600)" }}>العودة إلى صفحة المجتمع</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
