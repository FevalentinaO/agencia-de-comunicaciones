"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import ImageGallery from "@/components/ui/image-gallery";
import { PINS, type Pin } from "@/lib/galerias";

type Land = ReturnType<typeof feature>;

const INK = "74,66,60";

export default function GlobeExplorer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // d3 rotate([lon, lat]): the globe is centered on (-lon, -lat).
  const rot = useRef({ lon: 70, lat: -10 });
  const dirty = useRef(true);
  const hovered = useRef(false);
  const selectedRef = useRef<string | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shown, setShown] = useState<Pin | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const projection = geoOrthographic().clipAngle(90).precision(0.6);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();
    const sphere = { type: "Sphere" } as const;

    let land: Land | null = null;
    let size = 0;
    let raf = 0;
    let last = 0;
    let inView = false;
    let cancelled = false;

    fetch("/data/land-110m.json")
      .then((res) => res.json())
      .then((topo: Topology) => {
        if (cancelled) return;
        land = feature(topo, topo.objects.land);
        dirty.current = true;
      })
      .catch(() => {});

    const resize = () => {
      size = wrap.getBoundingClientRect().width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.translate([size / 2, size / 2]).scale(size / 2 - 1);
      dirty.current = true;
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      projection.rotate([rot.current.lon, rot.current.lat, 0]);

      const fill = ctx.createRadialGradient(
        size * 0.35, size * 0.3, size * 0.05,
        size / 2, size / 2, size / 2
      );
      fill.addColorStop(0, "#f8fafc");
      fill.addColorStop(1, "#dde3ec");
      ctx.beginPath();
      path(sphere);
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = `rgba(${INK},0.07)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      if (land) {
        ctx.beginPath();
        path(land);
        ctx.fillStyle = `rgba(${INK},0.1)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${INK},0.55)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.beginPath();
      path(sphere);
      ctx.strokeStyle = `rgba(${INK},0.18)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      const center: [number, number] = [-rot.current.lon, -rot.current.lat];
      for (const pin of PINS) {
        const el = pinRefs.current[pin.id];
        if (!el) continue;
        const point = projection([pin.lng, pin.lat]);
        const facing = geoDistance([pin.lng, pin.lat], center) < Math.PI / 2 - 0.08;
        if (point && facing) {
          el.style.transform = `translate3d(${point[0]}px, ${point[1]}px, 0) translate(-50%, -50%)`;
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
          el.tabIndex = 0;
        } else {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.tabIndex = -1;
        }
      }
    };

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(time - last, 64) : 16;
      last = time;
      if (!reduce && !hovered.current && !selectedRef.current) {
        rot.current.lon += dt * 0.004;
        dirty.current = true;
      }
      if (dirty.current) {
        dirty.current = false;
        draw();
      }
    };

    const start = () => {
      if (raf || !inView) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    viewObserver.observe(wrap);

    return () => {
      cancelled = true;
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  useEffect(() => () => void tween.current?.kill(), []);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      panelRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      panelRef.current
        ?.querySelector<HTMLElement>("[data-gallery-title]")
        ?.focus({ preventScroll: true });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [open]);

  const selectPin = useCallback((pin: Pin) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tween.current?.kill();
    selectedRef.current = pin.id;
    setSelectedId(pin.id);
    setOpen(false);

    // Shortest way around: wrap the longitude difference into [-180, 180].
    const current = rot.current.lon;
    const delta = ((((-pin.lng - current) % 360) + 540) % 360) - 180;
    const target = { lon: current + delta, lat: -pin.lat };
    const done = () => {
      setShown(pin);
      setOpen(true);
    };

    if (reduce) {
      rot.current.lon = target.lon;
      rot.current.lat = target.lat;
      dirty.current = true;
      done();
      return;
    }
    tween.current = gsap.to(rot.current, {
      ...target,
      duration: 1.4,
      ease: "power3.inOut",
      onUpdate: () => {
        dirty.current = true;
      },
      onComplete: done,
    });
  }, []);

  const closeGallery = useCallback(() => {
    selectedRef.current = null;
    setSelectedId(null);
    setOpen(false);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div
        ref={wrapRef}
        onPointerEnter={() => (hovered.current = true)}
        onPointerLeave={() => (hovered.current = false)}
        className="neu-raised relative aspect-square w-full max-w-[520px] rounded-full"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Globo terráqueo con pines de las galerías"
          className="absolute inset-0 h-full w-full rounded-full"
        />

        {PINS.map((pin) => {
          const selected = pin.id === selectedId;
          return (
            <button
              key={pin.id}
              ref={(el) => {
                pinRefs.current[pin.id] = el;
              }}
              type="button"
              aria-label={`Abrir galería de ${pin.name}`}
              aria-pressed={selected}
              onClick={() => selectPin(pin)}
              className="group absolute top-0 left-0 z-10 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
            >
              {selected && (
                <span className="absolute inset-0 animate-ping rounded-full bg-(--accent)/30" />
              )}
              <span
                className={`relative block h-3.5 w-3.5 rounded-full border-2 border-white shadow-[0_2px_6px_rgba(31,42,68,0.45)] transition-transform duration-300 group-hover:scale-125 ${
                  selected ? "bg-(--accent)" : "bg-(--text-strong)"
                }`}
              />
              <span className="pointer-events-none absolute bottom-full mb-1 rounded-full bg-(--quartz) px-3 py-1 text-[11px] font-medium tracking-wide whitespace-nowrap text-(--text-strong) opacity-0 shadow-[0_2px_8px_rgba(74,66,60,0.18)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {pin.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {PINS.map((pin) => (
          <button
            key={pin.id}
            type="button"
            aria-pressed={pin.id === selectedId}
            onClick={() => selectPin(pin)}
            className="soft-surface rounded-full px-5 py-2 text-xs font-medium tracking-[0.14em] uppercase focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
          >
            {pin.name}
          </button>
        ))}
      </div>

      <div
        ref={panelRef}
        inert={!open}
        className={`grid w-full scroll-mt-24 transition-[grid-template-rows,opacity] duration-700 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {shown && (
            <ImageGallery
              key={shown.id}
              title={shown.name}
              description={shown.description}
              images={shown.images}
              onClose={closeGallery}
            />
          )}
        </div>
      </div>
    </div>
  );
}
