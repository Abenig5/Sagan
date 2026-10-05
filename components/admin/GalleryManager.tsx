"use client";

import { useRef, useState, useTransition } from "react";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import type { GalleryImageLite, GallerySlot } from "@/lib/gallery";
import { deleteGalleryImage, reorderGallery } from "@/lib/actions/gallery";

const MAX_EDGE = 2000; // px; photos are downscaled in the browser before upload

/** Upload, reorder and delete the photos of one public slideshow. */
export default function GalleryManager({
  slot,
  lang,
  initialImages,
}: {
  slot: GallerySlot;
  lang: Lang;
  initialImages: GalleryImageLite[];
}) {
  const t = getDictionary(lang);
  const title = t.gallerySlots[slot];
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setUploading(list.length);
    for (const file of list) {
      try {
        const { blob, width, height } = await downscale(file);
        const form = new FormData();
        form.set("slot", slot);
        form.set("file", blob, file.name);
        form.set("width", String(width));
        form.set("height", String(height));
        const res = await fetch("/api/admin/gallery", { method: "POST", body: form });
        if (!res.ok) throw new Error();
        setImages((await res.json()).images);
      } catch {
        setError(t.galleryError(file.name));
      }
      setUploading((n) => n - 1);
    }
    if (input.current) input.current.value = "";
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
    startTransition(async () => {
      setImages(await reorderGallery(slot, next.map((img) => img.id)));
    });
  }

  function remove(id: string) {
    setImages((imgs) => imgs.filter((img) => img.id !== id));
    startTransition(async () => {
      setImages(await deleteGalleryImage(slot, id));
    });
  }

  return (
    <div className="gallery-manager">
      <div className="gallery-manager__head">
        <p style={{ fontWeight: 600, margin: 0 }}>
          {title} <span className="vat-note">· {t.galleryCount(images.length)}</span>
        </p>
        <label className="btn btn-primary btn-sm" aria-disabled={uploading > 0}>
          {uploading > 0 ? t.galleryUploading(uploading) : `+ ${t.galleryAdd}`}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            disabled={uploading > 0}
            onChange={(e) => upload(e.target.files)}
          />
        </label>
      </div>

      {error && <p className="login-error" style={{ marginBottom: 12 }}>{error}</p>}

      {images.length === 0 ? (
        <p className="times-hint">{t.galleryEmpty}</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <figure key={img.id} className="gallery-thumb">
              <img src={img.src} alt="" loading="lazy" />
              <span className="gallery-thumb__n tabular-nums">{i + 1}</span>
              <figcaption>
                <button type="button" className="btn btn-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label={t.galleryEarlier}>
                  ‹
                </button>
                <button type="button" className="btn btn-icon" onClick={() => remove(img.id)} aria-label={t.remove} title={t.remove}>
                  ✕
                </button>
                <button
                  type="button"
                  className="btn btn-icon"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  aria-label={t.galleryLater}
                >
                  ›
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

/** Shrinks a photo so its long edge is at most MAX_EDGE and re-encodes it (WebP, JPEG fallback). */
async function downscale(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86));
  let blob = await encode("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg");
  if (!blob) throw new Error("encode failed");
  return { blob, width, height };
}
