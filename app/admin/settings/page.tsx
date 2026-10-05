import { getAdminLang } from "@/lib/i18n/server";
import { getSettings } from "@/lib/settings";
import { listGallery } from "@/lib/gallery";
import SettingsView from "@/components/admin/SettingsView";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const lang = await getAdminLang();
  const [settings, studio, portrait] = await Promise.all([getSettings(), listGallery("studio"), listGallery("portrait")]);

  return <SettingsView lang={lang} initialSettings={settings} gallery={{ studio, portrait }} />;
}
