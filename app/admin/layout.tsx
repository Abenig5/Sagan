import { getAdminLang } from "@/lib/i18n/server";
import AdminChrome from "@/components/admin/AdminChrome";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const lang = await getAdminLang();

  return <AdminChrome lang={lang}>{children}</AdminChrome>;
}
