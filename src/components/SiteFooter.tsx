import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

const QUICK_LINKS = [
  { href: "/#hero", label: "الرئيسية" },
  { href: "/council", label: "المجلس" },
  { href: "/awards", label: "الجوائز" },
  { href: "/initiatives", label: "المبادرات" },
  { href: "/blog", label: "المدونة" },
  { href: "/press", label: "الملف الإعلامي" },
  { href: "/about", label: "من نحن" },
];

// Defaults mirror the original static footer; site_settings overrides them.
const DEFAULTS = {
  address: "طريق الأمير محمد بن عبدالعزيز، المعذر الشمالي، الرياض ١٢٣١٤",
  phone: "+966 55 075 7424",
  email: "contact@ostath.sa",
  instagram: "https://www.instagram.com/alostathorg/",
  linkedin: "https://www.linkedin.com/company/alostathorg",
  x: "https://x.com/AlOstathOrg",
  copyright: "جميع الحقوق محفوظة لمؤسسة الأستاذ ٢٠٢٦",
};

const linkStyle = {
  textDecoration: "none",
  color: "var(--inverse-subtle)",
  fontSize: 14,
} as const;

const socialStyle = {
  width: 42,
  height: 42,
  borderRadius: 10,
  border: "1px solid rgba(244,246,238,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--inverse-muted)",
} as const;

export default function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const c = { ...DEFAULTS, ...((settings?.contact as Record<string, string>) ?? {}) };
  return (
    <footer style={{ background: "var(--olive-900)", color: "var(--inverse-muted)" }}>
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "72px 32px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 48,
        }}
      >
        <div style={{ maxWidth: "34ch" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/alostath-logo-inverse.png"
            alt="مؤسسة الأستاذ"
            style={{ height: 64, width: "auto", display: "block", marginBottom: 18 }}
          />
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-inverse)", marginBottom: 14 }}>
            تابعنا على
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a className="social-ico" href={c.instagram} target="_blank" rel="noopener" aria-label="Instagram" style={socialStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
            </a>
            <a className="social-ico" href={c.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" style={socialStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a className="social-ico" href={c.x} target="_blank" rel="noopener" aria-label="X" style={socialStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-inverse)", marginBottom: 16 }}>تواصل معنا</div>
          <div style={{ fontSize: 14, lineHeight: 1.9, color: "var(--inverse-subtle)", marginBottom: 14 }}>{c.address}</div>
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} dir="ltr" style={{ ...linkStyle, display: "block", textAlign: "start", marginBottom: 8 }}>{c.phone}</a>
          <a href={`mailto:${c.email}`} dir="ltr" style={{ ...linkStyle, display: "block", textAlign: "start" }}>{c.email}</a>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-inverse)", marginBottom: 16 }}>روابط سريعة</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link className="footer-link" href={l.href} style={linkStyle}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(244,246,238,0.1)", padding: "20px 32px", fontSize: 13, color: "var(--inverse-subtle)", textAlign: "center" }}>
        {c.copyright}
      </div>
    </footer>
  );
}
