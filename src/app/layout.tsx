import type { Metadata } from "next";
import "@/styles/globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "مؤسسة الأستاذ",
    template: "%s – مؤسسة الأستاذ",
  },
  description:
    "مؤسسة الأستاذ — تعزيز مكانة المعلّم عبر الجوائز والمبادرات والمجلس، احتفاءً بدوره التربوي والثقافي.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div dir="rtl" style={{ fontFamily: "var(--font-sans)", background: "var(--canvas)", overflowX: "hidden" }}>
          {children}
        </div>
        <SiteChrome />
      </body>
    </html>
  );
}
