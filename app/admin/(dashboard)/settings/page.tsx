import { getSiteSettings } from "@/lib/settings";
import { SettingsManager } from "./SettingsManager";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsManager settings={settings} />;
}
