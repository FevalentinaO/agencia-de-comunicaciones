"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Minus, Plus } from "lucide-react";
import {
  geoArea,
  geoCentroid,
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import type { Feature, FeatureCollection, Geometry, MultiLineString } from "geojson";
import { feature, mesh } from "topojson-client";
import type { Topology } from "topojson-specification";
import GalleryDialog from "@/components/GalleryDialog";
import { PINS, type Pin } from "@/lib/galerias";

type CountryLabel = { name: string; lng: number; lat: number; area: number };
type Geo = {
  fills: FeatureCollection<Geometry>;
  coast: MultiLineString;
  borders: MultiLineString;
  labels: CountryLabel[];
};

type MeshObject = Parameters<typeof mesh>[1];

// Centroid of the country's largest polygon, so labels of far-flung
// territories (Alaska, overseas islands) don't drag the label into the sea.
function labelPoint(f: Feature<Geometry>): [number, number] {
  const g = f.geometry;
  if (g.type !== "MultiPolygon") return geoCentroid(f);
  let best = g.coordinates[0];
  let bestArea = 0;
  for (const coordinates of g.coordinates) {
    const a = geoArea({ type: "Polygon", coordinates });
    if (a > bestArea) {
      bestArea = a;
      best = coordinates;
    }
  }
  return geoCentroid({ type: "Polygon", coordinates: best });
}

function buildGeo(topo: Topology, names: Record<string, string>): Geo {
  const countries = topo.objects.countries;
  const fills = feature(topo, countries) as unknown as FeatureCollection<Geometry>;
  const labels: CountryLabel[] = [];
  for (const f of fills.features) {
    if (f.id == null) continue;
    const name = names[String(f.id).padStart(3, "0")];
    if (!name) continue;
    const [lng, lat] = labelPoint(f);
    labels.push({ name, lng, lat, area: geoArea(f) });
  }
  return {
    fills,
    coast: mesh(topo, countries as MeshObject, (a, b) => a === b),
    borders: mesh(topo, countries as MeshObject, (a, b) => a !== b),
    labels,
  };
}

const INK = "244,239,230";
const MAX_ZOOM = 10;
const DETAIL_ZOOM = 2.5;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function GlobeExplorer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // d3 rotate([lon, lat]): the globe is centered on (-lon, -lat).
  const rot = useRef({ lon: 70, lat: -10 });
  const dirty = useRef(true);
  const hovered = useRef(false);
  const selectedRef = useRef<string | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const zoom = useRef({ v: 1 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef({ active: false, startDist: 0, startZoom: 1 });
  const dragging = useRef(false);
  const suppressClick = useRef(false);
  const drag = useRef({
    active: false,
    id: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    v: 0,
    moved: false,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shown, setShown] = useState<Pin | null>(null);
  const [open, setOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

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

    let geo: Geo | null = null;
    const fontFamily = getComputedStyle(canvas).fontFamily;
    let size = 0;
    let raf = 0;
    let last = 0;
    let inView = false;
    let cancelled = false;
    let detailRequested = false;

    const namesReady: Promise<Record<string, string>> = fetch("/data/country-names-es.json")
      .then((res) => res.json())
      .catch(() => ({}));

    Promise.all([fetch("/data/countries-110m.json").then((res) => res.json()), namesReady])
      .then(([topo, names]: [Topology, Record<string, string>]) => {
        if (cancelled) return;
        geo = buildGeo(topo, names);
        dirty.current = true;
      })
      .catch(() => {});

    const loadDetail = () => {
      detailRequested = true;
      Promise.all([fetch("/data/countries-50m.json").then((res) => res.json()), namesReady])
        .then(([topo, names]: [Topology, Record<string, string>]) => {
          if (cancelled) return;
          geo = buildGeo(topo, names);
          dirty.current = true;
        })
        .catch(() => {});
    };

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey && zoom.current.v <= 1.05) return;
      event.preventDefault();
      const next = clamp(
        zoom.current.v * Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.0015)),
        1,
        MAX_ZOOM
      );
      zoom.current.v = next;
      dirty.current = true;
      setZoomLevel(next);
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });

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
      if (zoom.current.v > DETAIL_ZOOM && !detailRequested) loadDetail();
      projection.scale((size / 2 - 1) * zoom.current.v);
      projection.rotate([rot.current.lon, rot.current.lat, 0]);

      const fill = ctx.createRadialGradient(
        size * 0.35, size * 0.3, size * 0.05,
        size / 2, size / 2, size / 2
      );
      fill.addColorStop(0, "#2d3563");
      fill.addColorStop(1, "#1e2440");
      ctx.beginPath();
      path(sphere);
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = `rgba(${INK},0.07)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      if (geo) {
        ctx.beginPath();
        path(geo.fills);
        ctx.fillStyle = `rgba(${INK},0.09)`;
        ctx.fill();

        // Country borders: thin dashed line, distinct from the solid coast.
        ctx.beginPath();
        path(geo.borders);
        ctx.setLineDash([3, 2.5]);
        ctx.strokeStyle = `rgba(${INK},0.5)`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        path(geo.coast);
        ctx.strokeStyle = `rgba(${INK},0.75)`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Very subtle country names; smaller countries appear as you zoom in.
        const R = (size / 2 - 1) * zoom.current.v;
        const mid: [number, number] = [-rot.current.lon, -rot.current.lat];
        const pinPoints = PINS.map((pin) => projection([pin.lng, pin.lat])).filter(
          (p): p is [number, number] => p !== null
        );
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const label of geo.labels) {
          const dist = geoDistance([label.lng, label.lat], mid);
          if (dist > 1.2) continue;
          const areaPx = label.area * R * R;
          if (areaPx < 1800) continue;
          const point = projection([label.lng, label.lat]);
          if (!point) continue;
          if (point[0] < 0 || point[0] > size || point[1] < 0 || point[1] > size) continue;
          const fontSize = clamp(Math.sqrt(areaPx) / 10, 8, 12);
          ctx.font = `500 ${fontSize}px ${fontFamily}`;
          if (ctx.measureText(label.name).width > Math.sqrt(areaPx) * 1.5) continue;
          ctx.fillStyle = `rgba(${INK},${(0.7 * (1 - dist / 1.2)).toFixed(3)})`;
          // Nudge the name below a pin that would sit on top of it.
          const covered = pinPoints.some(
            (p) => Math.hypot(p[0] - point[0], p[1] - point[1]) < 16
          );
          ctx.fillText(label.name, point[0], point[1] + (covered ? 16 : 0));
        }
      }

      ctx.beginPath();
      path(sphere);
      ctx.strokeStyle = `rgba(200,150,58,0.7)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      const center: [number, number] = [-rot.current.lon, -rot.current.lat];
      for (const pin of PINS) {
        const el = pinRefs.current[pin.id];
        if (!el) continue;
        const point = projection([pin.lng, pin.lat]);
        const facing = geoDistance([pin.lng, pin.lat], center) < Math.PI / 2 - 0.08;
        const inside =
          point !== null &&
          Math.hypot(point[0] - size / 2, point[1] - size / 2) < size / 2 - 10;
        if (point && facing && inside) {
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
      if (
        !reduce &&
        !hovered.current &&
        !dragging.current &&
        !selectedRef.current &&
        zoom.current.v <= 1.05
      ) {
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
      wrap.removeEventListener("wheel", onWheel);
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  useEffect(() => () => void tween.current?.kill(), []);

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


  const applyZoom = useCallback((value: number) => {
    zoom.current.v = clamp(value, 1, MAX_ZOOM);
    dirty.current = true;
    setZoomLevel(zoom.current.v);
  }, []);

  const zoomBy = useCallback(
    (factor: number) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = clamp(zoom.current.v * factor, 1, MAX_ZOOM);
      if (reduce) return applyZoom(target);
      gsap.to(zoom.current, {
        v: target,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          dirty.current = true;
          setZoomLevel(zoom.current.v);
        },
      });
    },
    [applyZoom]
  );

  // Drag the globe (mouse or touch), pinch to zoom, momentum on release.
  // Vertical drags only pan the map once zoomed in; at 1x vertical swipes
  // scroll the page on touch (touch-pan-y).
  const pinchDistance = () => {
    const [p, q] = [...pointers.current.values()];
    return Math.hypot(p.x - q.x, p.y - q.y) || 1;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    tween.current?.kill();
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      drag.current.active = false;
      pinch.current = {
        active: true,
        startDist: pinchDistance(),
        startZoom: zoom.current.v,
      };
      dragging.current = true;
      suppressClick.current = true;
      return;
    }
    drag.current = {
      active: true,
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: performance.now(),
      v: 0,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }
    if (pinch.current.active && pointers.current.size >= 2) {
      applyZoom(
        (pinch.current.startZoom * pinchDistance()) / pinch.current.startDist
      );
      return;
    }
    const d = drag.current;
    if (!d.active || event.pointerId !== d.id) return;
    const zoomed = zoom.current.v > 1.05;
    if (!d.moved) {
      const travel = zoomed
        ? Math.hypot(event.clientX - d.startX, event.clientY - d.startY)
        : Math.abs(event.clientX - d.startX);
      if (travel < 4) return;
      d.moved = true;
      dragging.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const now = performance.now();
    const radius = (event.currentTarget.clientWidth / 2) * zoom.current.v;
    const toDeg = 180 / Math.PI / radius;
    const dLon = (event.clientX - d.lastX) * toDeg;
    rot.current.lon += dLon;
    if (zoomed) {
      rot.current.lat = clamp(
        rot.current.lat - (event.clientY - d.lastY) * toDeg,
        -80,
        80
      );
    }
    d.v = 0.7 * d.v + 0.3 * (dLon / Math.max(now - d.lastT, 1));
    d.lastX = event.clientX;
    d.lastY = event.clientY;
    d.lastT = now;
    dirty.current = true;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>, coast: boolean) => {
    pointers.current.delete(event.pointerId);
    if (pinch.current.active) {
      if (pointers.current.size < 2) {
        pinch.current.active = false;
        dragging.current = false;
        window.setTimeout(() => {
          suppressClick.current = false;
        }, 0);
      }
      return;
    }
    const d = drag.current;
    if (!d.active || event.pointerId !== d.id) return;
    d.active = false;
    if (!d.moved) return;
    dragging.current = false;
    suppressClick.current = true;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!coast || reduce || Math.abs(d.v) < 0.02) return;
    tween.current = gsap.to(rot.current, {
      lon: rot.current.lon + clamp(d.v * 400, -120, 120),
      duration: 1.2,
      ease: "power3.out",
      onUpdate: () => {
        dirty.current = true;
      },
    });
  };

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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endDrag(event, true)}
        onPointerCancel={(event) => endDrag(event, false)}
        className={`relative aspect-square w-full max-w-[520px] cursor-grab rounded-full border border-(--bruma)/40 select-none active:cursor-grabbing ${
          zoomLevel > 1.05 ? "touch-none" : "touch-pan-y"
        }`}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Globo terráqueo con pines de las galerías"
          className="absolute inset-0 h-full w-full rounded-full"
        />

        <div
          onPointerDown={(event) => event.stopPropagation()}
          className="absolute right-[9%] bottom-[9%] z-20 flex flex-col gap-2"
        >
          <button
            type="button"
            aria-label="Acercar el mapa"
            disabled={zoomLevel >= MAX_ZOOM - 0.01}
            onClick={() => zoomBy(1.8)}
            className="btn btn-light h-10 w-10 p-0!"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Alejar el mapa"
            disabled={zoomLevel <= 1.01}
            onClick={() => zoomBy(1 / 1.8)}
            className="btn btn-light h-10 w-10 p-0!"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

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
              onClick={() => {
                if (!suppressClick.current) selectPin(pin);
              }}
              className="group absolute top-0 left-0 z-10 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
            >
              <span
                aria-hidden="true"
                className={`pin-pulse absolute inset-1 rounded-full ${
                  selected ? "bg-(--luz)/60" : "bg-(--luz)/35"
                }`}
              />
              <span
                className={`relative block h-3.5 w-3.5 rounded-full border-2 border-(--marfil) transition-transform duration-300 group-hover:scale-125 ${
                  selected ? "bg-(--marfil)" : "bg-(--luz)"
                }`}
              />
              <span className="pointer-events-none absolute bottom-full mb-1 bg-(--marfil) px-3 py-1 text-xs tracking-[0.12em] whitespace-nowrap text-(--azul) uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
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
            className="btn btn-light px-5! py-2.5!"
          >
            {pin.name}
          </button>
        ))}
      </div>

      <GalleryDialog pin={shown} open={open} onClose={closeGallery} />
    </div>
  );
}
