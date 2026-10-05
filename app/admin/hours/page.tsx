import { getAdminLang } from "@/lib/i18n/server";
import { getSettings } from "@/lib/settings";
import HoursView from "@/components/admin/settings/HoursView";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [lang, settings] = await Promise.all([getAdminLang(), getSettings()]);
  return <HoursView lang={lang} initialSettings={settings} />;
}
