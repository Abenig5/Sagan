import { prisma } from "./prisma";

export type GallerySlot = "studio" | "portrait";
export const GALLERY_SLOTS: GallerySlot[] = ["studio", "portrait"];

export interface GalleryImageLite {
  id: string;
  src: string;
  width: number;
  height: number;
}

export function isGallerySlot(v: unknown): v is GallerySlot {
  return typeof v === "string" && (GALLERY_SLOTS as string[]).includes(v);
}

/** Lists a slideshow's images in display order, without the binary data. */
export async function listGallery(slot: GallerySlot): Promise<GalleryImageLite[]> {
  const rows = await prisma.galleryImage.findMany({
    where: { slot },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: { id: true, width: true, height: true },
  });
  return rows.map((r) => ({ ...r, src: `/api/gallery/${r.id}` }));
}
