import { prisma } from "@/lib/prisma";

/** Serves an uploaded slideshow image. Ids are never reused, so the response is cacheable forever. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const img = await prisma.galleryImage.findUnique({ where: { id }, select: { mime: true, data: true } });
  if (!img) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(img.data), {
    headers: {
      "Content-Type": img.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
