"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AuPairGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = React.useState(0);

  if (images.length === 0) return null;

  function go(delta: number) {
    setIndex((current) => (current + delta + images.length) % images.length);
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[index]} alt={alt} className="size-full object-cover" />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition-transform hover:scale-105 dark:bg-black/60 dark:text-white"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition-transform hover:scale-105 dark:bg-black/60 dark:text-white"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {images.map((image, i) => (
              <button
                key={image + i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`size-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-white" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
