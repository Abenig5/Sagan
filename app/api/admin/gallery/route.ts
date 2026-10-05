import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { isGallerySlot, listGallery } from "@/lib/gallery";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

/** Uploads one image to a slideshow (multipart: slot, file, width, height). */
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const slot = form.get("slot");
  const file = form.get("file");
  const width = Number(form.get("width"));
  const height = Number(form.get("height"));

  if (!isGallerySlot(slot) || !(file instanceof File)) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large" }, { status: 413 });
  }

  const last = await prisma.galleryImage.findFirst({ where: { slot }, orderBy: { position: "desc" }, select: { position: true } });
  await prisma.galleryImage.create({
    data: {
      slot,
      position: (last?.position ?? -1) + 1,
      mime: file.type,
      width: Number.isFinite(width) && width > 0 ? Math.round(width) : 0,
      height: Number.isFinite(height) && height > 0 ? Math.round(height) : 0,
      data: Buffer.from(await file.arrayBuffer()),
    },
  });

  revalidatePath("/[locale]", "layout");
  return NextResponse.json({ images: await listGallery(slot) });
}
