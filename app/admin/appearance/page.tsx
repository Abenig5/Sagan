import { getAdminLang } from "@/lib/i18n/server";
import { getSettings } from "@/lib/settings";
import LogoView from "@/components/admin/settings/LogoView";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [lang, settings] = await Promise.all([getAdminLang(), getSettings()]);
  return <LogoView lang={lang} initialSettings={settings} />;
}
