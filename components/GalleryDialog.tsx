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
      {pin && (
        <ImageGallery
          key={pin.id}
          title={pin.name}
          description={pin.description}
          images={pin.images}
          onClose={onClose}
        />
      )}
    </dialog>
  );
}
