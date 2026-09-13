// Site navigation — one source of truth for the header and the footer.
//
// The header used to carry nine tabs, which needed ~773px of the 1144px content
// box and forced a font-size hack between 981px and 1120px just to fit. The bar
// now carries six: the five programmes a teacher comes for, plus «من نحن».
//
// «الرئيسية» is the logo's job, and «المدونة» / «الملف الإعلامي» live in the
// footer and in the mobile panel — both keep inline entry points in the body
// copy so they are never reachable from the chrome alone.

import { PARTNERS_NAV_LABEL, PARTNERS_PATH } from "@/lib/brandPartners";

export type NavItem = { href: string; label: string; key: string };

/** The five programmes. Header tabs 1-5, and the footer's «للمعلّم» column. */
export const NAV_PROGRAMS: NavItem[] = [
  { href: "/community", label: "المجتمع", key: "community" },
  { href: "/council", label: "المجلس", key: "council" },
  { href: "/awards", label: "الجوائز", key: "awards" },
  { href: "/initiatives", label: "المبادرات", key: "initiatives" },
  { href: PARTNERS_PATH, label: PARTNERS_NAV_LABEL, key: "partners" },
];

export const HOME: NavItem = { href: "/", label: "الرئيسية", key: "home" };
export const ABOUT: NavItem = { href: "/about", label: "من نحن", key: "about" };
export const CONTACT: NavItem = { href: "/contact", label: "تواصل معنا", key: "contact" };

/** The six desktop tabs. Array order is RTL visual order, right → left. */
export const NAV_PRIMARY: NavItem[] = [...NAV_PROGRAMS, ABOUT];

/** Never a desktop tab — the mobile panel and the footer only. */
export const NAV_SECONDARY: NavItem[] = [
  { href: "/blog", label: "المدونة", key: "blog" },
  { href: "/press", label: "الملف الإعلامي", key: "press" },
];

/** The footer's «المؤسسة» column: everything that is not a programme. */
export const FOOTER_ORG: NavItem[] = [HOME, ABOUT, ...NAV_SECONDARY, CONTACT];
