import { getAdminLang } from "@/lib/i18n/server";
import { listClosures } from "@/lib/closures";
import ClosuresView from "@/components/admin/ClosuresView";

export const dynamic = "force-dynamic";

export default async function AdminClosuresPage() {
  const [lang, closures] = await Promise.all([getAdminLang(), listClosures()]);
  return <ClosuresView lang={lang} closures={closures.map((c) => ({ id: c.id, from: c.from, to: c.to, note: c.note }))} />;
}
