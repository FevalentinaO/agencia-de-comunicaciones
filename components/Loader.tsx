"use client";

import { useEffect, useState } from "react";

// Brand loader: the Talitha seal draws itself stroke by stroke on azul
// medianoche, then the screen lifts. It shows on the first load only (the
// layout persists across page navigations) and waits for the page to finish
// loading, with a short minimum so the drawing can complete.
export default function Loader() {
  const [state, setState] = useState<"visible" | "done" | "gone">("visible");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimum = reduce ? 500 : 1900;
    const started = performance.now();
    let timer = 0;

    const finish = () => {
      const wait = Math.max(0, minimum - (performance.now() - started));
      timer = window.setTimeout(() => setState("done"), wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (state !== "done") return;
    const timer = window.setTimeout(() => setState("gone"), 800);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === "gone") return null;

  return (
    <div
      className="loader"
      data-state={state}
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className="flex flex-col items-center gap-8">
        <svg
          viewBox="-86 -86 172 282"
          aria-hidden="true"
          focusable="false"
          className="h-28 w-auto"
          fill="none"
          stroke="#c8963a"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            className="loader-stroke"
            style={{ "--i": 0 } as React.CSSProperties}
            pathLength="1"
            d="M-77.5 29 V0 A77.5 77.5 0 0 1 77.5 0 V29"
          />
          <path
            className="loader-stroke"
            style={{ "--i": 1 } as React.CSSProperties}
            pathLength="1"
            d="M-29.5 12 V0 A29.5 29.5 0 0 1 29.5 0 V183"
          />
          <circle
            className="loader-drop"
            style={{ "--i": 0 } as React.CSSProperties}
            cx="-29.5"
            cy="56"
            r="7"
            fill="#c8963a"
            stroke="none"
          />
          <circle
            className="loader-drop"
            style={{ "--i": 1 } as React.CSSProperties}
            cx="-29.5"
            cy="95"
            r="7"
            fill="#c8963a"
            stroke="none"
          />
        </svg>

        <div className="loader-name flex flex-col items-center gap-3">
          <span className="font-(family-name:--font-display) text-2xl leading-none tracking-[0.4em] text-(--marfil) uppercase">
            Talitha
          </span>
          <span className="text-[0.6875rem] tracking-[0.3em] text-(--bruma) uppercase">
            Comunicación Estratégica
          </span>
        </div>
      </div>
    </div>
  );
}
