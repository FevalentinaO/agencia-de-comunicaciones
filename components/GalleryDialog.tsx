"use client";

import { useEffect, useRef } from "react";
import ImageGallery from "@/components/ui/image-gallery";
import type { Pin } from "@/lib/galerias";

export default function GalleryDialog({
  pin,
  open,
  onClose,
}: {
  pin: Pin | null;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={pin ? `Galería de ${pin.name}` : "Galería"}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="gallery-dialog"
    >
      {/* Grey paper-cut header behind the title */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[#aeb6c3]"
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-16 w-full translate-y-[calc(100%-1px)] rotate-180"
        >
          <path
            d="M0,60 C180,8 360,112 540,60 C720,8 900,100 1080,50 C1260,0 1350,60 1440,40 L1440,120 L0,120 Z"
            fill="#d9dde5"
          />
          <path
            d="M0,78 C200,28 380,120 600,76 C800,34 980,112 1160,70 C1300,38 1380,82 1440,66 L1440,120 L0,120 Z"
            fill="#c6ccd7"
          />
          <path
            d="M0,96 C240,54 420,122 660,92 C880,64 1040,120 1240,92 C1340,78 1400,100 1440,94 L1440,120 L0,120 Z"
            fill="#aeb6c3"
          />
        </svg>
      </div>

      {pin && (
        <ImageGallery
          key={pin.id}
          title={pin.name}
          description={pin.description}
          images={pin.images}
          onClose={onClose}
          className="relative"
        />
      )}
    </dialog>
  );
}
