import Link from "next/link";
import { PARTNERS_NAV_LABEL, PARTNERS_PATH } from "@/lib/brandPartners";

const NAV = [
  { href: "/#hero", label: "الرئيسية", key: "home" },
  { href: "/council", label: "المجلس", key: "council" },
  { href: "/community", label: "المجتمع", key: "community" },
  { href: "/awards", label: "الجوائز", key: "awards" },
  { href: "/initiatives", label: "المبادرات", key: "initiatives" },
  { href: PARTNERS_PATH, label: PARTNERS_NAV_LABEL, key: "partners" },
  { href: "/blog", label: "المدونة", key: "blog" },
  { href: "/about", label: "من نحن", key: "about" },
  { href: "/press", label: "الملف الإعلامي", key: "press" },
];

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          minHeight: 74,
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Link
          href="/#hero"
          style={{ display: "flex", alignItems: "center", textDecoration: "none", flex: "none" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/alostath-logo.png" alt="مؤسسة الأستاذ" style={{ height: 46, width: "auto" }} />
        </Link>
        <nav data-mainnav="1" style={{ gap: 2, flex: "1 1 auto", alignItems: "center" }}>
          {NAV.map((n) => (
            <Link
              key={n.key}
              className="nav-a"
              href={n.href}
              {...(active === n.key ? { "data-active": "true" } : {})}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="nav-a nav-cta">
            تواصل معنا
          </Link>
        </nav>
        <div className="header-cta" style={{ marginInlineStart: "auto", flex: "none" }}>
          <Link href="/contact" className="btn btn-primary btn-sm">
            تواصل معنا
          </Link>
        </div>
      </div>
    </header>
  );
}
