"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/galerias";

type ImageGalleryProps = {
  title: string;
  description?: string;
  images: GalleryImage[];
  onClose?: () => void;
  className?: string;
};

export default function ImageGallery({
  title,
  description,
  images,
  onClose,
  className,
}: ImageGalleryProps) {
  // Tap/click (or Enter/Space) pins one photo open; on desktop hover still
  // previews while nothing is pinned.
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      aria-label={`Galería de ${title}`}
      className={cn("flex w-full flex-col items-center py-10", className)}
    >
      <div className="flex w-full max-w-5xl items-start justify-between gap-4 px-4">
        <div className="text-left">
          <h3
            tabIndex={-1}
            data-gallery-title
            className="font-(family-name:--font-display) text-3xl font-medium tracking-wide text-(--text-strong) outline-none"
          >
            {title}
          </h3>
          {description && (
            <p className="mt-2 text-sm text-(--text-strong)">{description}</p>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar galería"
            className="soft-surface flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-(--text-strong) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-8 flex h-[320px] w-full max-w-5xl items-center gap-2 px-4 sm:h-[400px]">
        {images.map((image, index) => (
          <div
            key={image.src}
            role="button"
            tabIndex={0}
            aria-pressed={active === index}
            aria-label={`Ampliar: ${image.alt}`}
            onClick={() => setActive(active === index ? null : index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActive(active === index ? null : index);
              }
            }}
            className={cn(
              "group relative h-full w-14 flex-grow cursor-pointer overflow-hidden rounded-lg transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) sm:w-56",
              active === index && "w-full",
              active === null && "hover:w-full"
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 90vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
