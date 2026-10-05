"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { isGallerySlot, listGallery, type GallerySlot } from "@/lib/gallery";

export async function deleteGalleryImage(slot: GallerySlot, id: string) {
  await requireAdmin();
  if (!isGallerySlot(slot)) throw new Error("Invalid slot");
  await prisma.galleryImage.deleteMany({ where: { id, slot } });
  revalidatePath("/[locale]", "layout");
  return listGallery(slot);
}

/** Persists a new display order; `ids` is the full list for the slot, first to last. */
export async function reorderGallery(slot: GallerySlot, ids: string[]) {
  await requireAdmin();
  if (!isGallerySlot(slot)) throw new Error("Invalid slot");
  await prisma.$transaction(
    ids.map((id, position) => prisma.galleryImage.updateMany({ where: { id, slot }, data: { position } })),
  );
  revalidatePath("/[locale]", "layout");
  return listGallery(slot);
}
