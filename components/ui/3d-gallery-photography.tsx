"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: { start: number; end: number };
  fadeOut: { start: number; end: number };
}

interface BlurSettings {
  blurIn: { start: number; end: number };
  blurOut: { start: number; end: number };
  maxBlur: number;
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  visibleCount?: number;
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  autoPlay?: boolean;
  className?: string;
}

const DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

const DEFAULT_FADE: FadeSettings = {
  fadeIn: { start: 0.05, end: 0.25 },
  fadeOut: { start: 0.4, end: 0.43 },
};

const DEFAULT_BLUR: BlurSettings = {
  blurIn: { start: 0.0, end: 0.1 },
  blurOut: { start: 0.4, end: 0.43 },
  maxBlur: 8.0,
};

const createClothMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;

        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          flagWave += sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
        }

        pos.z -= (curve + clothEffect + flagWave);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);

        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        color.rgb += vec3(abs(scrollForce) * 0.005);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
        #include <colorspace_fragment>
      }
    `,
  });

function ramp(value: number, from: number, to: number) {
  return Math.max(0, Math.min(1, (value - from) / (to - from)));
}

function GalleryScene({
  images,
  speed,
  visibleCount,
  fadeSettings,
  blurSettings,
  velocityRef,
  interactedAt,
  autoPlay,
}: {
  images: { src: string; alt?: string }[];
  speed: number;
  visibleCount: number;
  fadeSettings: FadeSettings;
  blurSettings: BlurSettings;
  velocityRef: React.MutableRefObject<number>;
  interactedAt: React.MutableRefObject<number>;
  autoPlay: boolean;
}) {
  const textures = useTexture(images.map((img) => img.src));
  const totalImages = images.length;

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, createClothMaterial),
    [visibleCount]
  );
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  const spatial = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, i) => {
        const hAngle = (i * 2.618) % (Math.PI * 2);
        const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
        const hRadius = (i % 3) * 1.2;
        const vRadius = ((i + 1) % 4) * 0.8;
        return {
          x: (Math.sin(hAngle) * hRadius * MAX_HORIZONTAL_OFFSET) / 3,
          y: (Math.cos(vAngle) * vRadius * MAX_VERTICAL_OFFSET) / 4,
        };
      }),
    [visibleCount]
  );

  const planes = useRef(
    Array.from({ length: visibleCount }, (_, i) => ({
      z: ((DEPTH_RANGE / visibleCount) * i) % DEPTH_RANGE,
      imageIndex: i % totalImages,
    }))
  );
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    // Resume autoplay after a few idle seconds; damp the speed every frame.
    if (autoPlay && Date.now() - interactedAt.current > 3000) {
      velocityRef.current += 0.3 * delta * speed;
    }
    velocityRef.current *= Math.pow(0.95, delta * 60);
    const velocity = velocityRef.current;
    const time = state.clock.getElapsedTime();
    const imageAdvance = visibleCount % totalImages || totalImages;
    const halfRange = DEPTH_RANGE / 2;

    planes.current.forEach((plane, i) => {
      let newZ = plane.z + velocity * delta * 10;
      if (newZ >= DEPTH_RANGE) {
        const wraps = Math.floor(newZ / DEPTH_RANGE);
        newZ -= DEPTH_RANGE * wraps;
        plane.imageIndex = (plane.imageIndex + wraps * imageAdvance) % totalImages;
      } else if (newZ < 0) {
        const wraps = Math.ceil(-newZ / DEPTH_RANGE);
        newZ += DEPTH_RANGE * wraps;
        const step = plane.imageIndex - wraps * imageAdvance;
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }
      plane.z = ((newZ % DEPTH_RANGE) + DEPTH_RANGE) % DEPTH_RANGE;

      const t = plane.z / DEPTH_RANGE;
      const { fadeIn, fadeOut } = fadeSettings;
      const opacity =
        t < fadeIn.start
          ? 0
          : t <= fadeIn.end
            ? ramp(t, fadeIn.start, fadeIn.end)
            : t < fadeOut.start
              ? 1
              : 1 - ramp(t, fadeOut.start, fadeOut.end);

      const { blurIn, blurOut, maxBlur } = blurSettings;
      const blur =
        t < blurIn.start
          ? maxBlur
          : t <= blurIn.end
            ? maxBlur * (1 - ramp(t, blurIn.start, blurIn.end))
            : t < blurOut.start
              ? 0
              : maxBlur * ramp(t, blurOut.start, blurOut.end);

      const texture = textures[plane.imageIndex];
      const material = materials[i];
      const mesh = meshes.current[i];
      if (!texture || !material || !mesh) return;

      const image = texture.image as { width: number; height: number } | undefined;
      const aspect = image ? image.width / image.height : 1;
      mesh.position.set(spatial[i].x, spatial[i].y, plane.z - halfRange);
      if (aspect > 1) mesh.scale.set(2 * aspect, 2, 1);
      else mesh.scale.set(2, 2 / aspect, 1);

      material.uniforms.map.value = texture;
      material.uniforms.opacity.value = opacity;
      material.uniforms.blurAmount.value = Math.max(0, Math.min(maxBlur, blur));
      material.uniforms.scrollForce.value = velocity;
      material.uniforms.time.value = time;
    });
  });

  return (
    <>
      {materials.map((material, i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            meshes.current[i] = mesh;
          }}
          material={material}
          onPointerEnter={() => (material.uniforms.isHovered.value = 1)}
          onPointerLeave={() => (material.uniforms.isHovered.value = 0)}
        >
          <planeGeometry args={[1, 1, 32, 32]} />
        </mesh>
      ))}
    </>
  );
}

function FallbackGallery({ images }: { images: { src: string; alt?: string }[] }) {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-3 overflow-y-auto p-4 md:grid-cols-4">
      {images.map((img) => (
        <div key={img.src} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
          <Image src={img.src} alt={img.alt ?? ""} fill sizes="25vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

function detectMode(): "webgl" | "fallback" {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "fallback";
  try {
    const canvas = document.createElement("canvas");
    return canvas.getContext("webgl2") || canvas.getContext("webgl") ? "webgl" : "fallback";
  } catch {
    return "fallback";
  }
}

export default function InfiniteGallery({
  images,
  speed = 1.2,
  visibleCount = 12,
  fadeSettings = DEFAULT_FADE,
  blurSettings = DEFAULT_BLUR,
  autoPlay = false,
  className,
}: InfiniteGalleryProps) {
  // Loaded client-only (ssr: false), so it is safe to probe the browser here.
  const [mode] = useState(detectMode);
  const velocityRef = useRef(0);
  const interactedAt = useRef(0);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const normalized = useMemo(
    () => images.map((img) => (typeof img === "string" ? { src: img, alt: "" } : img)),
    [images]
  );

  const nudge = (amount: number) => {
    velocityRef.current += amount * speed;
    interactedAt.current = Date.now();
  };

  // The page scroll drives the gallery: while its tall track is on screen,
  // every scrolled pixel pushes the photos forward (or back when scrolling up).
  useEffect(() => {
    if (mode !== "webgl") return;
    let last = window.scrollY;
    const onScroll = () => {
      const delta = window.scrollY - last;
      last = window.scrollY;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      velocityRef.current += delta * 0.01 * speed;
      interactedAt.current = Date.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, speed]);

  const stage = (
    <div
      tabIndex={0}
      role="group"
      aria-label="Galería 3D de fotografías. Desplázate, arrastra o usa las flechas para avanzar."
      className={cn(
        "relative h-[calc(100vh-8rem)] min-h-[420px] w-full touch-pan-y overflow-hidden rounded-[2rem] bg-[#eef0f4] outline-none focus-visible:ring-2 focus-visible:ring-(--accent)",
        mode === "webgl" && "cursor-grab active:cursor-grabbing",
        className
      )}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") nudge(-2);
        if (event.key === "ArrowDown" || event.key === "ArrowRight") nudge(2);
      }}
      onPointerDown={(event) => {
        drag.current = { x: event.clientX, id: event.pointerId };
      }}
      onPointerMove={(event) => {
        const d = drag.current;
        if (!d || d.id !== event.pointerId) return;
        const dx = event.clientX - d.x;
        d.x = event.clientX;
        nudge(-dx * 0.04);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      {mode === "fallback" && <FallbackGallery images={normalized} />}
      {mode === "webgl" && (
        <Canvas
          camera={{ position: [0, 0, 0], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.75]}
        >
          <Suspense fallback={null}>
            <GalleryScene
              images={normalized}
              speed={speed}
              visibleCount={visibleCount}
              fadeSettings={fadeSettings}
              blurSettings={blurSettings}
              velocityRef={velocityRef}
              interactedAt={interactedAt}
              autoPlay={autoPlay}
            />
          </Suspense>
        </Canvas>
      )}
      {mode === "webgl" && (
        <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-xs font-medium tracking-[0.2em] text-(--text-strong) uppercase">
          Desplázate para avanzar
        </p>
      )}
    </div>
  );

  if (mode !== "webgl") return stage;

  // Tall track + sticky stage: the gallery stays pinned while the page scrolls.
  return (
    <div ref={trackRef} className="relative h-[320vh] w-full">
      <div className="sticky top-24 flex items-center">{stage}</div>
    </div>
  );
}
