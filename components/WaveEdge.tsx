// Three stacked paper-cut waves in grey. The last (darkest) layer must match
// the colour of the band it joins; `flip` mirrors it for a bottom edge.
const LAYERS = [
  { d: "M0,60 C180,8 360,112 540,60 C720,8 900,100 1080,50 C1260,0 1350,60 1440,40 L1440,120 L0,120 Z", fill: "#d9dde5" },
  { d: "M0,78 C200,28 380,120 600,76 C800,34 980,112 1160,70 C1300,38 1380,82 1440,66 L1440,120 L0,120 Z", fill: "#c6ccd7" },
  { d: "M0,96 C240,54 420,122 660,92 C880,64 1040,120 1240,92 C1340,78 1400,100 1440,94 L1440,120 L0,120 Z", fill: "var(--band)" },
];

export default function WaveEdge({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 h-16 w-full sm:h-24 md:h-28 ${
        flip ? "bottom-0 translate-y-[calc(100%-1px)] rotate-180" : "top-0 -translate-y-[calc(100%-1px)]"
      }`}
    >
      {LAYERS.map((layer) => (
        <path
          key={layer.d}
          d={layer.d}
          fill={layer.fill}
          style={{ filter: "drop-shadow(0 3px 4px rgba(50,60,80,0.22))" }}
        />
      ))}
    </svg>
  );
}
