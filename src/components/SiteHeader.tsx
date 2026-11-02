import Link from "next/link";
import { HOME, NAV_PRIMARY, NAV_SECONDARY } from "@/lib/nav";

export default function SiteHeader({
  active,
  overlay = false,
  hidden,
}: {
  active?: string;
  overlay?: boolean;
  /** Page keys switched off in the dashboard. */
  hidden?: Set<string>;
}) {
  const shown = (n: { key: string }) => !hidden?.has(n.key);
  const primary = NAV_PRIMARY.filter(shown);
  const secondary = NAV_SECONDARY.filter(shown);
  const contactOn = !hidden?.has("contact");
  return (
    <header
      {...(overlay ? { "data-overlay": "" } : {})}
      // The overlay header's surface lives in design-system.css: it has to
      // change with scroll state and with the phone menu, and an inline style
      // would always win.
      style={
        overlay
          ? undefined
          : {
              position: "sticky",
              top: 0,
              zIndex: 50,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid var(--hairline)",
            }
      }
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
          href={HOME.href}
          aria-label="مؤسسة الأستاذ — الصفحة الرئيسية"
          {...(active === HOME.key ? { "aria-current": "page" as const } : {})}
          style={{ display: "flex", alignItems: "center", textDecoration: "none", flex: "none" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-ink header-logo" src="/assets/alostath-logo-header.png" alt="مؤسسة الأستاذ" />
          {overlay && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="logo-inverse header-logo" src="/assets/alostath-logo-header-inverse.png" alt="" aria-hidden />
          )}
        </Link>
        {/* gap/align-items live in design-system.css, not here: the <980px panel
            needs to override them and an inline style would always win. */}
        <nav data-mainnav="1" aria-label="القائمة الرئيسية" style={{ flex: "1 1 auto" }}>
          {/* The logo is «الرئيسية» on desktop; the phone panel spells it out. */}
          <Link
            className="nav-a nav-home-m"
            href={HOME.href}
            {...(active === HOME.key ? { "data-active": "true", "aria-current": "page" as const } : {})}
          >
            {HOME.label}
          </Link>
          {primary.map((n) => (
            <Link
              key={n.key}
              className="nav-a"
              href={n.href}
              {...(active === n.key ? { "data-active": "true", "aria-current": "page" as const } : {})}
            >
              {n.label}
            </Link>
          ))}
          {/* Footer-tier links, surfaced inside the hamburger so nothing on the
              site is more than one tap away on a phone. */}
          {secondary.length > 0 && (
          <div className="nav-sec" role="group" aria-labelledby="nav-sec-label">
            <div className="nav-sec-label" id="nav-sec-label">المؤسسة</div>
            {secondary.map((n) => (
              <Link
                key={n.key}
                className="nav-a"
                href={n.href}
                {...(active === n.key ? { "data-active": "true", "aria-current": "page" as const } : {})}
              >
                {n.label}
              </Link>
            ))}
          </div>
          )}
          {contactOn && (
            <Link href="/contact" className="nav-a nav-cta">
              تواصل معنا
            </Link>
          )}
        </nav>
        <div className="header-cta" style={{ marginInlineStart: "auto", flex: "none" }}>
          {contactOn && (
            <Link href="/contact" className="btn btn-primary btn-sm">
              تواصل معنا
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
