"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import ParallaxUnfurlingGallery from "@/components/ui/3d-parallax-unfurling-gallery";
import { BENTO_ITEMS, TRAYECTORIA_IMAGES } from "@/lib/trayectoria";

// three.js is heavy: load it only when Propuesta 3 is opened.
const Gallery3D = dynamic(() => import("@/components/ui/3d-gallery-photography"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-[80vh] min-h-[480px] w-full" />,
});

const TABS = ["Propuesta 1", "Propuesta 2", "Propuesta 3"];

export default function TrayectoriaTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        role="group"
        aria-label="Propuestas de galería"
        className="mx-auto flex w-full max-w-6xl flex-wrap gap-3 px-5 pb-10 sm:px-8"
      >
        {TABS.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className="btn btn-ghost"
          >
            {label}
          </button>
        ))}
      </div>

      {active === 0 && <ParallaxUnfurlingGallery images={TRAYECTORIA_IMAGES} />}

      {active === 1 && (
        <div className="w-full pb-20">
          <InteractiveBentoGallery mediaItems={BENTO_ITEMS} />
        </div>
      )}

      {active === 2 && (
        <div className="w-full max-w-6xl px-4 pb-20">
          <Gallery3D images={TRAYECTORIA_IMAGES.slice(0, 10)} />
        </div>
      )}
    </div>
  );
}
