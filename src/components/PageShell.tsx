import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { getSettings } from "@/lib/queries";

/** Header + footer wrapper. Fetches site settings for the footer contact block. */
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
  return (
    <>
      <SiteHeader active={active} overlay={overlayHeader} />
      {children}
      <SiteFooter settings={settings} />
    </>
  );
}
