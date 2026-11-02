import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { getSettings } from "@/lib/queries";
import { hiddenPages, requirePageOn } from "@/lib/pages";

/** Header + footer wrapper. Fetches site settings for the footer contact block
 *  and for page visibility (lib/pages.ts). */
export default async function PageShell({
  active,
  overlayHeader = true,
  children,
}: {
  active?: string;
  /** Header floats transparent over the page's hero until the page scrolls.
   *  Pass false on a page that does not open with a PageHero. */
  overlayHeader?: boolean;
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  // A section switched off in /admin/pages answers 404, detail pages included.
  if (active) requirePageOn(settings, active);
  const hidden = hiddenPages(settings);
  return (
    <>
      <SiteHeader active={active} overlay={overlayHeader} hidden={hidden} />
      {children}
      <SiteFooter settings={settings} hidden={hidden} />
    </>
  );
}
