"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/galerias";

function ImageCard({ image }: { image: GalleryImage }) {
  return (
    <div className="relative h-[200px] w-full flex-shrink-0 overflow-hidden rounded-2xl bg-[#eef0f4] shadow-[0_8px_24px_rgba(50,60,80,0.25)] transition-transform duration-300 will-change-transform hover:scale-[1.02] sm:h-[300px] md:h-[400px]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 768px) 22vw, 200px"
        className="object-cover object-center opacity-90 transition-opacity duration-300 hover:opacity-100"
      />
    </div>
  );
}

export default function ParallaxUnfurlingGallery({
  images,
  className,
}: {
  images: GalleryImage[];
  className?: string;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const columns = useMemo(() => {
    const cols = [0, 1, 2, 3].map((n) => images.filter((_, i) => i % 4 === n));
    // Repeat each column so the parallax never runs out of photos.
    return cols.map((col) => [...col, ...col]);
  }, [images]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  // Banner unfurls from a framed card to full bleed.
  const bannerWidth = useTransform(progress, [0, 0.15], ["90vw", "100vw"]);
  const bannerHeight = useTransform(progress, [0, 0.15], ["80vh", "100vh"]);
  const bannerRadius = useTransform(progress, [0, 0.15], ["48px", "0px"]);

  // 3D matrix of photos settles as you scroll.
  const rotateY = useTransform(progress, [0.15, 1], [-45, -8]);
  const rotateX = useTransform(progress, [0.15, 1], [25, 4]);
  const rotateZ = useTransform(progress, [0.15, 1], [15, 2]);
  const translateZ = useTransform(progress, [0.15, 1], [-800, 0]);

  const yCol1 = useTransform(progress, [0.15, 1], ["0%", "-40%"]);
  const yCol2 = useTransform(progress, [0.15, 1], ["-40%", "10%"]);
  const yCol3 = useTransform(progress, [0.15, 1], ["0%", "-40%"]);
  const yCol4 = useTransform(progress, [0.15, 1], ["-30%", "20%"]);
  const yCols = [yCol1, yCol2, yCol3, yCol4];

  if (reduceMotion) {
    return (
      <section
        aria-label="Galería de trayectoria"
        className={cn("mx-auto grid w-full max-w-5xl grid-cols-2 gap-4 px-4 md:grid-cols-4", className)}
      >
        {images.map((image) => (
          <ImageCard key={image.src} image={image} />
        ))}
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      aria-label="Galería de trayectoria"
      className={cn("relative h-[420vh] w-full bg-white", className)}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          style={{
            width: bannerWidth,
            height: bannerHeight,
            borderRadius: bannerRadius,
          }}
          className="relative mx-auto flex max-w-[1920px] items-center justify-center overflow-hidden bg-white shadow-[0_20px_60px_rgba(50,60,80,0.12)] will-change-transform"
        >
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            {/* Soft edge fade into the grey band */}
            <div className="absolute inset-0 z-20 shadow-[inset_0_80px_120px_-50px_rgba(255,255,255,1),inset_0_-80px_120px_-50px_rgba(255,255,255,1)]" />
            <div className="absolute inset-0 z-20 shadow-[inset_120px_0_120px_-50px_rgba(255,255,255,1),inset_-120px_0_120px_-50px_rgba(255,255,255,1)]" />

            <motion.div
              style={{
                rotateX,
                rotateY,
                rotateZ,
                z: translateZ,
                transformStyle: "preserve-3d",
              }}
              className="flex h-[150vh] w-[120vw] origin-center items-center justify-center gap-4 will-change-transform md:gap-6"
            >
              {columns.map((col, c) => (
                <motion.div
                  key={c}
                  style={{ y: yCols[c] }}
                  className="pointer-events-auto flex w-[22vw] min-w-[200px] flex-col gap-4 md:gap-6"
                >
                  {col.map((image, index) => (
                    <ImageCard key={`${c}-${index}`} image={image} />
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
