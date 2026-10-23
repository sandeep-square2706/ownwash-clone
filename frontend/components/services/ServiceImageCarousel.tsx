"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useRef, useState } from "react";
import { CleanKartImageStamp } from "@/components/ui/BrandedPhoto";

type ServiceImageCarouselProps = {
  images: string[];
  title: string;
  href?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  showThumbnails?: boolean;
};

export default function ServiceImageCarousel({
  images,
  title,
  href,
  sizes,
  priority = false,
  className = "",
  showThumbnails = false,
}: ServiceImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const image = images[activeIndex];
  const hasMultipleImages = images.length > 1;

  function moveImage(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!hasMultipleImages || event.pointerType !== "mouse") return;
    if (
      event.target instanceof Element &&
      event.target.closest("[data-carousel-control]")
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const position = Math.min(0.999, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const nextIndex = Math.floor(position * images.length);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null || !hasMultipleImages) return;
    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) > 40) moveImage(distance < 0 ? 1 : -1);
  }

  const photo = image ? (
    <Image
      src={image}
      alt={`${title}, photo ${activeIndex + 1} of ${images.length}`}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover transition duration-300"
    />
  ) : (
    <div className="flex h-full min-h-44 flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-6 text-center text-blue-950">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
        <Images className="h-7 w-7" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs text-slate-500">Service photo coming soon</span>
      </span>
    </div>
  );

  const carousel = (
    <div
      className={`relative overflow-hidden ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
      onPointerMove={handlePointerMove}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={handleTouchEnd}
    >
      {href ? (
        <Link
          href={href}
          aria-label={`View ${title}`}
          className="absolute inset-0 z-0 cursor-ew-resize"
        >
          {photo}
        </Link>
      ) : (
        photo
      )}

      {image && <CleanKartImageStamp className="left-3 top-3 h-7 w-7 rounded-md" />}

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={() => moveImage(-1)}
            aria-label={`Previous ${title} photo`}
            data-carousel-control
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-blue-950 shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => moveImage(1)}
            aria-label={`Next ${title} photo`}
            data-carousel-control
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-blue-950 shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-blue-950/75 px-2.5 py-1.5">
            {images.map((_, index) => (
              <button
                key={`${title}-photo-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${title} photo ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                data-carousel-control
                className={`flex h-6 w-6 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white ${
                  activeIndex === index ? "bg-white/15" : "hover:bg-white/15"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    activeIndex === index ? "bg-[var(--brand-gold)]" : "bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="sr-only" aria-live="polite">
            Photo {activeIndex + 1} of {images.length}
          </span>
        </>
      )}
    </div>
  );

  if (!showThumbnails || !hasMultipleImages) return carousel;

  return (
    <div className="flex flex-col gap-3">
      {carousel}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label={`${title} photo thumbnails`}
      >
        {images.map((thumbnail, index) => (
          <button
            key={`${title}-thumbnail-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setActiveIndex(index);
            }}
            aria-label={`Show ${title} photo ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
            className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:h-20 sm:w-24 ${
              activeIndex === index ? "border-blue-700" : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
