"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { COLLECTIONS } from "./config";
import { signOut } from "./actions";
import { TRANSLATIONS_NAV_LABEL } from "@/lib/translations";
import { Icon, type IconName } from "./icons";

const COLLECTION_ICON: Record<string, IconName> = {
  awards: "awards",
  initiatives: "initiatives",
  posts: "posts",
  news: "news",
  brands: "brands",
  partners: "partners",
  press: "press",
};

type Item = { href: string; icon: IconName; label: string; badge?: number };
type Section = { label?: string; items: Item[] };

export type NavCounts = { newIdeas: number; draftTranslations: number };

export default function AdminNav({ email, counts }: { email: string; counts: NavCounts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sections: Section[] = [
    {
      items: [
        { href: "/admin", icon: "dashboard", label: "نظرة عامة" },
        { href: "/admin/registrations", icon: "inbox", label: "الطلبات والاشتراكات" },
      ],
    },
    {
      label: "المحتوى",
      items: [
        ...COLLECTIONS.map((c) => ({
          href: `/admin/collections/${c.slug}`,
          icon: COLLECTION_ICON[c.slug] ?? ("posts" as IconName),
          label: c.labelPlural,
        })),
        { href: "/admin/translations", icon: "translations", label: TRANSLATIONS_NAV_LABEL, badge: counts.draftTranslations },
      ],
    },
    {
      label: "المجتمع",
      items: [
        { href: "/admin/community", icon: "members", label: "الأعضاء" },
        { href: "/admin/community/ideas", icon: "ideas", label: "الأفكار", badge: counts.newIdeas },
        { href: "/admin/community/broadcasts", icon: "broadcasts", label: "الرسائل" },
      ],
    },
    {
      label: "النظام",
      items: [
        { href: "/admin/pages", icon: "pages", label: "الصفحات والأقسام" },
        { href: "/admin/settings", icon: "settings", label: "إعدادات الموقع" },
        { href: "/admin/media", icon: "media", label: "الوسائط" },
      ],
    },
  ];

  // "Active" is the *most specific* matching link, so /admin doesn't light up
  // on every screen and /admin/community/ideas doesn't also light «الأعضاء».
  const hrefs = sections.flatMap((s) => s.items.map((i) => i.href));
  const matches = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const best = hrefs.filter(matches).sort((a, b) => b.length - a.length)[0];
  const current = sections.flatMap((s) => s.items).find((i) => i.href === best);

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // While the drawer is open: Escape closes it and the page behind can't scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const initial = (email.trim()[0] || "؟").toUpperCase();
  const attention = counts.newIdeas + counts.draftTranslations;

  return (
    <>
      {/* Mobile / tablet top bar */}
      <header className="admin-topbar">
        <button
          type="button"
          className="admin-iconbtn admin-topbar-menu"
          onClick={() => setOpen(true)}
          aria-label="فتح القائمة"
          aria-expanded={open}
          aria-controls="admin-sidebar"
        >
          {Icon.menu}
          {attention > 0 && <span className="admin-topbar-dot" aria-hidden="true" />}
        </button>
        <div className="admin-topbar-title">{current?.label ?? "لوحة التحكم"}</div>
        <Link href="/admin" className="admin-topbar-brand" aria-label="الرئيسية">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/alostath-logo.png" alt="" />
        </Link>
      </header>

      <div className={`admin-scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside id="admin-sidebar" className={`admin-sidebar${open ? " is-open" : ""}`} aria-label="قائمة لوحة التحكم">
        <div className="admin-sidebar-head">
          <Link href="/admin" className="admin-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/alostath-logo.png" alt="مؤسسة الأستاذ" />
            <span className="admin-brand-tag">لوحة التحكم</span>
          </Link>
          <button type="button" className="admin-iconbtn admin-sidebar-close" onClick={() => setOpen(false)} aria-label="إغلاق القائمة">
            {Icon.close}
          </button>
        </div>

        <nav className="admin-sidebar-scroll">
          {sections.map((s, si) => (
            <div className="admin-navgroup" key={si}>
              {s.label && <div className="admin-navlabel">{s.label}</div>}
              {s.items.map((it) => {
                const active = it.href === best;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`admin-navlink${active ? " is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {Icon[it.icon]}
                    <span className="admin-navlink-text">{it.label}</span>
                    {!!it.badge && (
                      <span className="admin-navbadge" aria-label={`${it.badge} بانتظار المراجعة`}>{it.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noopener" className="admin-navlink admin-viewsite">
            {Icon.external}
            <span className="admin-navlink-text">عرض الموقع</span>
          </a>
          <div className="admin-user">
            <div className="admin-avatar" aria-hidden="true">{initial}</div>
            <div className="admin-user-mail" title={email}>{email}</div>
            <form action={signOut}>
              <button type="submit" className="admin-iconbtn" aria-label="تسجيل الخروج" title="تسجيل الخروج">
                {Icon.logout}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
