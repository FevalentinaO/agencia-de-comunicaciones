// Talitha logotype. Geometry follows the manual's "Construcción" page: one
// stroke weight t, outer arch R ≈ 7.4t, inner arch r ≈ 2.8t sharing a centre,
// the long stroke dropping from the inner arch, two drops (1.4t) on the short
// leg's axis. Round terminals always. Unit = px of the manual's drawing.
export function Seal({
  className,
  color = "var(--luz)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="-86 -86 172 282"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M-77.5 29 V0 A77.5 77.5 0 0 1 77.5 0 V29" />
      <path d="M-29.5 12 V0 A29.5 29.5 0 0 1 29.5 0 V183" />
      <circle cx="-29.5" cy="56" r="7" fill={color} stroke="none" />
      <circle cx="-29.5" cy="95" r="7" fill={color} stroke="none" />
    </svg>
  );
}

type LogoProps = {
  /** "light" for navy backgrounds, "dark" for ivory ones. */
  tone?: "light" | "dark";
  /** Show the descriptor line under the name. */
  descriptor?: boolean;
  className?: string;
};

export default function Logo({ tone = "dark", descriptor = false, className }: LogoProps) {
  const light = tone === "light";
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <Seal className={descriptor ? "h-12 w-auto" : "h-9 w-auto"} />
      <span
        aria-hidden="true"
        className={`self-stretch w-px ${light ? "bg-[#b5b3c3]/60" : "bg-[#b5b3c3]"}`}
      />
      <span className="flex flex-col">
        <span
          className={`font-(family-name:--font-display) leading-none tracking-[0.34em] uppercase ${
            descriptor ? "text-3xl" : "text-xl"
          } ${light ? "text-[#f4efe6]" : "text-(--azul)"}`}
        >
          Talitha
        </span>
        {descriptor && (
          <span
            className={`mt-2 text-[0.6875rem] tracking-[0.3em] uppercase ${
              light ? "text-[#b5b3c3]" : "text-(--text)"
            }`}
          >
            Comunicación Estratégica
          </span>
        )}
      </span>
    </span>
  );
}
