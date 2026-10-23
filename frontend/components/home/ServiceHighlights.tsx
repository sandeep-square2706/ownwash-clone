"use client";

import Image from "next/image";
import { useState } from "react";

import HomeSectionHeading from "@/components/home/HomeSectionHeading";
import { CleanKartImageStamp } from "@/components/ui/BrandedPhoto";

const comparisons = [
  {
    title: "Car washing",
    before: "/images/generated/before-car.webp",
    after: "/images/generated/after-car.webp",
  },
  {
    title: "Kitchen cleaning",
    before: "/images/generated/before-kitchen.webp",
    after: "/images/generated/after-kitchen.webp",
  },
  {
    title: "Sofa cleaning",
    before: "/images/generated/before-sofa.webp",
    after: "/images/generated/after-sofa.webp",
  },
];

export default function ServiceHighlights() {
  return (
    <section aria-label="Illustrative cleaning comparisons" className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <HomeSectionHeading eyebrow="A closer look" title="Before and after" accent="examples" />
          <p className="max-w-md text-xs leading-5 text-slate-500">
            Illustrative examples. Results vary by surface, material and condition.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {comparisons.map((comparison) => (
            <BeforeAfterCard key={comparison.title} {...comparison} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterCard({ title, before, after }: (typeof comparisons)[number]) {
  const [position, setPosition] = useState(50);

  function updatePosition(clientX: number, element: HTMLElement) {
    const bounds = element.getBoundingClientRect();
    const percent = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.max(5, Math.min(95, Math.round(percent))));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(16,44,95,0.06)]">
      <div className="group relative aspect-[1.68] overflow-hidden bg-slate-100 focus-within:outline-2 focus-within:outline-offset-[-3px] focus-within:outline-[var(--brand-blue)]">
        <Image
          src={after}
          alt={`${title}: clean result, illustrative example`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={before}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_5px_rgba(0,0,0,.45)]" style={{ left: `${position}%` }} />
        <span
          className="pointer-events-none absolute top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/95 text-[var(--brand-navy)] shadow-lg"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <span className="text-[13px] font-black tracking-[-0.3em]">‹›</span>
        </span>

        <button
          type="button"
          role="slider"
          aria-label={`Compare before and after ${title}`}
          aria-valuemin={5}
          aria-valuemax={95}
          aria-valuenow={position}
          aria-valuetext={`${position}% before, ${100 - position}% after`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            updatePosition(event.clientX, event.currentTarget);
          }}
          onPointerMove={(event) => {
            if (event.buttons === 1) updatePosition(event.clientX, event.currentTarget);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault();
              setPosition((current) => Math.max(5, current - 2));
            } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault();
              setPosition((current) => Math.min(95, current + 2));
            } else if (event.key === "Home") {
              setPosition(5);
            } else if (event.key === "End") {
              setPosition(95);
            }
          }}
          className="absolute inset-0 z-30 cursor-ew-resize rounded-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
          style={{ touchAction: "pan-y" }}
        />

        <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-md bg-[var(--brand-navy)]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Before</span>
        <span className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-md bg-[var(--brand-blue)]/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">After</span>
        <CleanKartImageStamp className="bottom-3 right-[4.8rem] h-7 w-7 rounded-md" />
      </div>
      <h3 className="px-4 py-3 text-sm font-bold text-[var(--brand-navy)]">{title}</h3>
    </div>
  );
}
