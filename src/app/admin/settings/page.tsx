import { createClient } from "@/lib/supabase/server";
import { saveSettings } from "../actions";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  const map = new Map((data ?? []).map((r: { key: string; value: unknown }) => [r.key, r.value]));

  const contact = (map.get("contact") as Record<string, unknown>) ?? {};
  const council = (map.get("council") as Record<string, unknown>) ?? {};
  const community = (map.get("community") as Record<string, unknown>) ?? {};

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">إعدادات الموقع</h1>
          <p className="admin-subtitle">القيم العامة التي تظهر عبر الموقع.</p>
        </div>
      </div>

      <SettingsForm sectionKey="contact" value={contact} action={saveSettings.bind(null, "contact")} />
      <SettingsForm sectionKey="council" value={council} action={saveSettings.bind(null, "council")} />
      <SettingsForm sectionKey="community" value={community} action={saveSettings.bind(null, "community")} />
    </div>
  );
}
