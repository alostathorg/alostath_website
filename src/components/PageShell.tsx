import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { getSettings } from "@/lib/queries";

/** Header + footer wrapper. Fetches site settings for the footer contact block. */
export default async function PageShell({
  active,
  children,
}: {
  active?: string;
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <>
      <SiteHeader active={active} />
      {children}
      <SiteFooter settings={settings} />
    </>
  );
}
