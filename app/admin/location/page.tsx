import { getAdminLang } from "@/lib/i18n/server";
import { getSettings } from "@/lib/settings";
import LocationView from "@/components/admin/settings/LocationView";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [lang, settings] = await Promise.all([getAdminLang(), getSettings()]);
  return <LocationView lang={lang} initialSettings={settings} />;
}
