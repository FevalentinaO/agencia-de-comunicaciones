// Three nested grey paper-cut layers sweeping diagonally from the bottom-left
// up to the top-right, grey on the lower-right side of each curve. Paths run
// past the viewBox so the slow drift never exposes a gap.
const LAYERS = [
  { d: "M79,900 L79,780 C82,690 110,590 160,528 C220,478 300,520 358,440 C400,380 410,330 421,291 C432,240 440,200 470,150 C510,90 560,40 621,9 C650,-6 680,-20 720,-30 L1100,-30 L1100,900 Z", fill: "#d9dde5", drift: "wave-drift-1" },
  { d: "M334,900 L335,730 C338,690 380,672 440,645 C500,620 545,600 560,545 C572,490 580,430 615,342 C640,300 700,296 765,264 C815,240 850,215 870,160 C885,120 910,70 950,9 C960,-6 975,-20 1000,-30 L1100,-30 L1100,900 Z", fill: "#c6ccd7", drift: "wave-drift-2" },
  { d: "M600,900 L601,760 C603,700 625,640 675,590 C720,550 760,555 800,500 C835,455 850,380 900,320 C930,290 970,278 1005,264 C1040,252 1070,246 1100,240 L1100,900 Z", fill: "#aeb6c3", drift: "wave-drift-3" },
];

export default function WaveSide() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 800"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full [-webkit-mask-image:linear-gradient(to_bottom,#000_80%,transparent)] [mask-image:linear-gradient(to_bottom,#000_80%,transparent)]"
    >
      {LAYERS.map((layer) => (
        <path
          key={layer.d}
          d={layer.d}
          fill={layer.fill}
          className={layer.drift}
          style={{ filter: "drop-shadow(-3px -4px 6px rgba(50,60,80,0.2))" }}
        />
      ))}
    </svg>
  );
}
