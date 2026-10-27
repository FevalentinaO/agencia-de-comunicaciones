import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-titulo"
      className="relative overflow-hidden pt-[4.5rem]"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-20 lg:pb-28">
        <div className="flex flex-col items-start gap-8">
          <p className="eyebrow reveal" style={{ "--d": "0.1s" } as React.CSSProperties}>
            Comunicación estratégica
          </p>

          <h1
            id="hero-titulo"
            className="display text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-7xl"
          >
            <span className="reveal-line" style={{ "--d": "0.15s" } as React.CSSProperties}>
              <span>Criterio con personalidad,</span>
            </span>
            <span className="reveal-line" style={{ "--d": "0.3s" } as React.CSSProperties}>
              <span>
                creatividad con <em className="italic">propósito.</em>
              </span>
            </span>
          </h1>

          <p
            className="reveal max-w-md text-lg leading-relaxed text-(--text)"
            style={{ "--d": "0.55s" } as React.CSSProperties}
          >
            Entendemos que cada palabra construye reputación. Pensamos antes de
            actuar, y lo que decimos se sostiene.
          </p>

          <div
            className="reveal flex flex-wrap items-center gap-4"
            style={{ "--d": "0.7s" } as React.CSSProperties}
          >
            <Link href="/contacto" className="btn btn-primary">
              Cuéntanos tu idea
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/trayectoria" className="btn btn-ghost">
              Nuestra trayectoria
            </Link>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[17rem] sm:max-w-xs lg:max-w-sm">
          <div className="relative">
            {/* Gold arc echoing the seal, offset from the frame */}
            <div
              aria-hidden="true"
              className="absolute -inset-2 translate-x-2 -translate-y-2 rounded-t-full border border-(--luz) border-b-0"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-[#dedbe6]">
              <Image
                src="/images/caro-diana.png"
                alt="Caro y Diana, socias directoras de Talitha, de pie espalda con espalda"
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 24rem, 20rem"
                className="object-contain object-bottom"
              />
            </div>
          </div>
          <figcaption className="mt-5 flex items-center justify-between border-t border-(--bruma) pt-4 text-sm text-(--text)">
            <span className="display text-xl italic">Caro &amp; Diana</span>
            <span className="tracking-[0.2em] uppercase">Socias directoras</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
