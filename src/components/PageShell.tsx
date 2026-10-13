import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { getSettings } from "@/lib/queries";

/** Header + footer wrapper. Fetches site settings for the footer contact block. */
export default async function PageShell({
  active,
  overlayHeader = false,
  children,
}: {
  active?: string;
  /** Header floats transparent over a full-bleed hero until the page scrolls. */
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
