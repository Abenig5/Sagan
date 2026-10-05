import { getAdminLang } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { listGallery, type GallerySlot } from "@/lib/gallery";
import PageHeader from "@/components/admin/PageHeader";
import GalleryManager from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

// Grouped by the website page the slideshows appear on.
const GROUPS: GallerySlot[][] = [["studio"], ["portrait", "salon", "team", "work"]];

export default async function AdminPhotosPage() {
  const lang = await getAdminLang();
  const t = getDictionary(lang);
  const images = Object.fromEntries(
    await Promise.all(GROUPS.flat().map(async (slot) => [slot, await listGallery(slot)] as const)),
  );

  return (
    <div>
      <PageHeader title={t.adminNav.photos} description={t.galleryNote} />
      {GROUPS.map((slots, gi) => (
        <section key={gi} className="photo-group">
          <h2 className="photo-group__title">{t.galleryGroups[gi]}</h2>
          {slots.map((slot) => (
            <div key={slot} className="admin-card">
              <GalleryManager slot={slot} lang={lang} initialImages={images[slot]} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
