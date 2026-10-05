"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImageLite } from "@/lib/gallery";

const INTERVAL_MS = 5500;
const SWIPE_PX = 40;

/**
 * Cross-fading photo slideshow used for the studio (home) and portrait (about) photos.
 * Autoplays, pauses on hover/focus or while the tab is hidden, and can be driven by the
 * arrow buttons, the dots, the keyboard arrows or a swipe.
 */
export default function Slideshow({
  images,
  placeholder,
  className = "",
  label,
  compact = false,
}: {
  images: GalleryImageLite[];
  placeholder: string;
  className?: string;
  label: string;
  /** Smaller controls and no counter, for the small square cards. */
  compact?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      if (document.visibilityState === "visible") next();
    }, INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [count, paused, next, index]);

  if (count === 0) {
    return <div className={`photo-slot mat ${className}`}>{placeholder}</div>;
  }

  return (
    <div
      className={`slideshow mat ${className}`}
      data-compact={compact}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        setPaused(false);
        if (start === null) return;
        const dx = e.changedTouches[0].clientX - start;
        if (dx > SWIPE_PX) prev();
        else if (dx < -SWIPE_PX) next();
      }}
    >
      {images.map((img, i) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          className="slideshow__slide"
          data-active={i === index}
          aria-hidden={i !== index}
          loading={i === 0 ? "eager" : "lazy"}
          draggable={false}
        />
      ))}

      {count > 1 && (
        <>
          <button type="button" className="slideshow__nav slideshow__nav--prev" onClick={prev} aria-label="Previous photo">
            <Chevron dir="left" />
          </button>
          <button type="button" className="slideshow__nav slideshow__nav--next" onClick={next} aria-label="Next photo">
            <Chevron dir="right" />
          </button>
          <div className="slideshow__footer">
            {!compact && (
              <span className="slideshow__count tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            )}
            <div className="slideshow__dots">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className="slideshow__dot"
                  data-active={i === index}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 4 7 12l8 8" : "M9 4l8 8-8 8"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
