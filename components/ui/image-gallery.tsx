"use client";

import Image from "next/image";
import { useState } from "react";
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
      <div className="flex w-full max-w-5xl items-start justify-between gap-4 border-b border-(--bruma) px-5 pb-6 sm:px-8">
        <div className="text-left">
          <h3
            tabIndex={-1}
            data-gallery-title
            className="display text-4xl outline-none"
          >
            {title}
          </h3>
          {description && (
            <p className="mt-2 text-base text-(--text)">{description}</p>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar galería"
            className="btn btn-ghost h-11 w-11 shrink-0 p-0!"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-8 flex h-[320px] w-full max-w-5xl items-center gap-2 px-5 sm:h-[400px] sm:px-8">
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
              "group relative h-full w-14 flex-grow cursor-pointer overflow-hidden transition-all duration-500 sm:w-56",
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
