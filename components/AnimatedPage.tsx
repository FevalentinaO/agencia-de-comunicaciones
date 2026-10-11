"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedPage({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let removePointerMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const bgBlobs = root.querySelectorAll<HTMLElement>("[data-hero-bg-blob]");
      const photo = root.querySelector<HTMLElement>("[data-hero-photo]");
      const titleLines = root.querySelectorAll<HTMLElement>(
        "[data-hero-title-line]"
      );
      const title = root.querySelector<HTMLElement>("[data-hero-title]");
      const subtitle = root.querySelector<HTMLElement>("[data-hero-subtitle]");
      const nav = root.querySelector<HTMLElement>("[data-hero-nav]");
      const contact = root.querySelector<HTMLElement>("[data-hero-contact]");

      if (reduceMotion) {
        gsap.set([bgBlobs, subtitle, nav, contact], {
          autoAlpha: 1,
          y: 0,
        });
        gsap.set(photo, { autoAlpha: 1 });
        gsap.set([title, titleLines], { autoAlpha: 1, opacity: 1 });
        return;
      }

      // Text reveal from bottom: each title line rises out of its own mask
      // (the overflow-hidden wrapper in Hero.tsx); the rest fades in softly.
      const fades = [...bgBlobs, photo, title].filter(Boolean) as HTMLElement[];
      const rises = [subtitle, nav, contact].filter(Boolean) as HTMLElement[];
      const animated = [...fades, ...titleLines, ...rises];

      gsap.set(titleLines, { opacity: 1, yPercent: 110 });
      gsap.set(fades, { autoAlpha: 0 });
      gsap.set(rises, { autoAlpha: 0, y: 24 });
      gsap.set(animated, { willChange: "transform, opacity" });

      gsap
        .timeline({
          onComplete: () => gsap.set(animated, { willChange: "auto" }),
        })
        .to(fades, { autoAlpha: 1, duration: 1.2, ease: "power1.out" }, 0)
        .to(
          titleLines,
          { yPercent: 0, duration: 1, stagger: 0.14, ease: "power4.out" },
          0.25
        )
        .to(
          rises,
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" },
          0.7
        );

      // Scroll-linked 3D tilt: the hero block recedes in depth as it
      // scrolls past, instead of just scrolling flat off screen.
      const scrollTilt = root.querySelector<HTMLElement>(
        "[data-hero-scroll-tilt]"
      );
      if (scrollTilt) {
        gsap.set(scrollTilt, { transformOrigin: "top center" });
        gsap.to(scrollTilt, {
          rotateX: -22,
          z: -200,
          y: -40,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: scrollTilt,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      // Subtle mouse-driven 3D parallax; skip on touch devices.
      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      if (!isCoarsePointer) {
        const maxTilt = 7;
        const setPhotoX = photo ? gsap.quickTo(photo, "rotateY", { duration: 0.6, ease: "power3.out" }) : null;
        const setPhotoY = photo ? gsap.quickTo(photo, "rotateX", { duration: 0.6, ease: "power3.out" }) : null;
        const blobSetters = Array.from(bgBlobs).map((blob) => ({
          x: gsap.quickTo(blob, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(blob, "y", { duration: 0.8, ease: "power3.out" }),
        }));

        const handlePointerMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          setPhotoY?.(-ny * maxTilt);
          setPhotoX?.(nx * maxTilt);
          blobSetters.forEach((s, i) => {
            const amp = 14 + i * 6;
            s.x(nx * amp);
            s.y(ny * amp);
          });
        };

        window.addEventListener("pointermove", handlePointerMove);

        // Hover: only the outline rings lift (scale, rise, extra turn),
        // one after another; the photo itself stays put.
        let handleEnter: (() => void) | undefined;
        let handleLeave: (() => void) | undefined;
        const rings = photo
          ? Array.from(photo.querySelectorAll<HTMLElement>("[data-hero-ring]"))
          : [];

        if (photo && rings.length) {
          handleEnter = () =>
            gsap.to(rings, {
              scale: (i) => 1.05 + i * 0.05,
              y: (i) => -(10 + i * 10),
              rotation: (i) => (i === 0 ? -10 : 12),
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.12,
              overwrite: "auto",
            });
          handleLeave = () =>
            gsap.to(rings, {
              scale: 1,
              y: 0,
              rotation: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: { each: 0.08, from: "end" },
              overwrite: "auto",
            });
          photo.addEventListener("mouseenter", handleEnter);
          photo.addEventListener("mouseleave", handleLeave);
        }

        removePointerMove = () => {
          window.removeEventListener("pointermove", handlePointerMove);
          if (photo && handleEnter && handleLeave) {
            photo.removeEventListener("mouseenter", handleEnter);
            photo.removeEventListener("mouseleave", handleLeave);
          }
        };
      }
    }, root);

    return () => {
      ctx.revert();
      removePointerMove?.();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {children}
    </div>
  );
}
