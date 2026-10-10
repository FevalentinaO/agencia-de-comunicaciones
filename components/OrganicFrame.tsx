import Image from "next/image";

export default function OrganicFrame() {
  return (
    <div
      data-hero-photo
      className="relative mx-auto aspect-[7/6] w-full max-w-[370px] lg:mx-0 lg:ml-34 lg:top-10"
    >
      {/* Thin offset outlines, slightly rotated, wrapping the quartz blob. */}
      <div
        data-hero-ring
        aria-hidden="true"
        className="absolute -inset-[3%] -rotate-6 rounded-[52%_48%_46%_54%/50%_54%_46%_50%] border border-(--text-strong)/35"
      />
      <div
        data-hero-ring
        aria-hidden="true"
        className="absolute -inset-[7%] rotate-[7deg] rounded-[48%_52%_54%_46%/54%_46%_52%_48%] border border-(--text-strong)/15"
      />

      {/* Quartz white blob behind the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[50%_50%_48%_52%/52%_48%_52%_48%] bg-(--quartz)"
      />

      {/* Photo is larger than the blob: heads break out above it, the bottom
          is rounded off to follow the blob's curve. */}
      <div className="absolute -top-[14%] -right-[7%] -bottom-[2%] -left-[7%] [clip-path:inset(0_round_0_0_40%_40%/0_0_30%_30%)]">
        <Image
          src="/images/caro-diana.png"
          alt="Caro y Diana, directoras de la agencia, de pie espalda con espalda"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 420px, 75vw"
          className="object-contain object-bottom"
        />
      </div>

      {/* Accent marks: plus signs top-right, slashes bottom-left. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="absolute -top-[6%] right-[2%] h-9 w-9 text-(--text-strong)"
      >
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 2v10M15 7h10" />
          <path d="M31 14v10M26 19h10" />
        </g>
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 48 20"
        className="absolute bottom-[10%] -left-[8%] h-5 w-12 text-(--text-strong)"
      >
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 18 8 2M16 18l4-16M28 18l4-16M40 18l4-16" />
        </g>
      </svg>
    </div>
  );
}
