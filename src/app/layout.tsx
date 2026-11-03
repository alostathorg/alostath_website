import type { Metadata } from "next";
import "@/styles/globals.css";
import SiteChrome from "@/components/SiteChrome";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "مؤسسة الأستاذ",
    template: "%s – مؤسسة الأستاذ",
  },
  description:
    "مؤسسة الأستاذ — مؤسسة أهلية سعودية غير ربحية لتعزيز مكانة المعلّم، عبر الجائزة الوطنية للمعلّم ومبادرات الأستاذ ومنصات الحضور والمحتوى ومجلس الأستاذ.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {/* overflow-x: clip, not hidden — "hidden" turns this div into a scroll
            container, which silently breaks every position: sticky inside it
            (the dashboard sidebar scrolled away with the page). */}
        <div dir="rtl" style={{ fontFamily: "var(--font-sans)", background: "var(--canvas)", overflowX: "clip" }}>
          {children}
        </div>
        <SiteChrome />
        <Analytics />
      </body>
    </html>
  );
}
