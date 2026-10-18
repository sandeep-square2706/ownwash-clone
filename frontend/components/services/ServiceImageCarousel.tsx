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
};

export default function ServiceImageCarousel({
  images,
  title,
  href,
  sizes,
  priority = false,
  className = "",
}: ServiceImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const image = images[activeIndex];
  const hasMultipleImages = images.length > 1;

  function moveImage(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
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

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={handleTouchEnd}
    >
      {href ? (
        <Link href={href} aria-label={`View ${title}`} className="absolute inset-0 z-0">
          {photo}
        </Link>
      ) : (
        photo
      )}

      {image && <CleanKartImageStamp className="bottom-3 right-3 h-7 w-7 rounded-md" />}

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={() => moveImage(-1)}
            aria-label={`Previous ${title} photo`}
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-blue-950 shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => moveImage(1)}
            aria-label={`Next ${title} photo`}
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-blue-950 shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-blue-950/75 px-2.5 py-1.5">
            {images.map((_, index) => (
              <button
                key={`${title}-photo-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${title} photo ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  activeIndex === index ? "bg-cyan-300" : "bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
          <span className="sr-only" aria-live="polite">
            Photo {activeIndex + 1} of {images.length}
          </span>
        </>
      )}
    </div>
  );
}
