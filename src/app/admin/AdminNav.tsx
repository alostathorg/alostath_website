"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLLECTIONS } from "./config";
import { signOut } from "./actions";

const I = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
  ),
  inbox: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
  ),
  awards: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
  ),
  initiatives: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
  ),
  posts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
  ),
  partners: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  press: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  ),
  media: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
  ),
  members: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  ideas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>
  ),
  broadcasts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z" /><path d="M16.5 8.5a4 4 0 0 1 0 7" /><path d="M19.5 5.5a8 8 0 0 1 0 13" /></svg>
  ),
} as const;

const COLLECTION_ICON: Record<string, keyof typeof I> = {
  awards: "awards",
  initiatives: "initiatives",
  posts: "posts",
  partners: "partners",
  press: "press",
};

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  // Every link this nav renders, so "active" can mean the *most specific*
  // match rather than any prefix match. A plain startsWith lit up "/admin" on
  // every screen, and would now light both المجتمع links at once on
  // /admin/community/ideas.
  const hrefs = [
    "/admin",
    "/admin/registrations",
    ...COLLECTIONS.map((c) => `/admin/collections/${c.slug}`),
    "/admin/community",
    "/admin/community/ideas",
    "/admin/community/broadcasts",
    "/admin/settings",
    "/admin/media",
  ];
  const matches = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const best = hrefs.filter(matches).sort((a, b) => b.length - a.length)[0];

  function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    const active = href === best;
    return (
      <Link href={href} className={`admin-navlink${active ? " is-active" : ""}`} title={label}>
        {icon}
        <span>{label}</span>
      </Link>
    );
  }

  const initial = (email.trim()[0] || "؟").toUpperCase();

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo.png" alt="مؤسسة الأستاذ" />
      </Link>

      <NavLink href="/admin" icon={I.dashboard} label="لوحة التحكم" />
      <NavLink href="/admin/registrations" icon={I.inbox} label="الطلبات والاشتراكات" />

      <div className="admin-navlabel">المحتوى</div>
      {COLLECTIONS.map((c) => (
        <NavLink key={c.slug} href={`/admin/collections/${c.slug}`} icon={I[COLLECTION_ICON[c.slug] ?? "posts"]} label={c.labelPlural} />
      ))}

      <div className="admin-navlabel">المجتمع</div>
      <NavLink href="/admin/community" icon={I.members} label="أعضاء المجتمع" />
      <NavLink href="/admin/community/ideas" icon={I.ideas} label="أفكار المجتمع" />
      <NavLink href="/admin/community/broadcasts" icon={I.broadcasts} label="رسائل المجتمع" />

      <div className="admin-navlabel">النظام</div>
      <NavLink href="/admin/settings" icon={I.settings} label="إعدادات الموقع" />
      <NavLink href="/admin/media" icon={I.media} label="الوسائط" />

      <div className="admin-sidebar-foot">
        <div className="admin-user">
          <div className="admin-avatar">{initial}</div>
          <div className="admin-user-mail">{email}</div>
        </div>
        <form action={signOut}>
          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-block">تسجيل الخروج</button>
        </form>
      </div>
    </aside>
  );
}
