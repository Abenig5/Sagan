import { getAdminLang } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { listGallery } from "@/lib/gallery";
import PageHeader from "@/components/admin/PageHeader";
import GalleryManager from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const lang = await getAdminLang();
  const t = getDictionary(lang);
  const [studio, portrait] = await Promise.all([listGallery("studio"), listGallery("portrait")]);

  return (
    <div>
      <PageHeader title={t.adminNav.photos} description={t.galleryNote} />
      <section className="admin-card">
        <GalleryManager slot="studio" lang={lang} initialImages={studio} />
      </section>
      <section className="admin-card">
        <GalleryManager slot="portrait" lang={lang} initialImages={portrait} />
      </section>
    </div>
  );
}
