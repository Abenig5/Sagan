import { getAdminLang } from "@/lib/i18n/server";
import { getSettings } from "@/lib/settings";
import BookingRulesView from "@/components/admin/settings/BookingRulesView";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [lang, settings] = await Promise.all([getAdminLang(), getSettings()]);
  return <BookingRulesView lang={lang} initialSettings={settings} />;
}
