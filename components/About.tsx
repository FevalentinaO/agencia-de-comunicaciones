import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Seal } from "./Logo";
import RevealOnScroll from "./RevealOnScroll";

const ATRIBUTOS = [
  "Inteligente",
  "Confiable",
  "Sofisticada",
  "Creativa",
  "Actual",
  "Humana",
  "Exigente",
  "Segura",
];

const PILARES = [
  { n: "01", name: "Criterio", text: "Pensamos antes de actuar. Analizamos y entendemos antes de decidir qué decir, cómo y cuándo." },
  { n: "02", name: "Credibilidad", text: "Construimos confianza. Información rigurosa, clara y responsable." },
  { n: "03", name: "Excelencia", text: "Bien hecho, siempre. En el contenido, en la ejecución y en el detalle." },
  { n: "04", name: "Creatividad y curiosidad", text: "Que una idea importe. Observar, preguntar y encontrar el ángulo correcto." },
  { n: "05", name: "Verdad y coherencia", text: "Lo que decimos se sostiene. Coherencia entre lo que se dice, se hace y se representa." },
];

export default function About() {
  return (
    <section
      id="quienes-somos"
      aria-labelledby="quienes-somos-titulo"
      className="scroll-mt-24 border-t border-(--bruma)"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <RevealOnScroll>
          <div className="flex items-center gap-4">
            <Seal className="h-7 w-auto" />
            <p className="eyebrow">Nuestra esencia</p>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <h2
              id="quienes-somos-titulo"
              className="display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
            >
              Criterio con personalidad, creatividad con propósito y excelencia en{" "}
              <em className="italic">cada detalle.</em>
            </h2>

            <div className="flex flex-col items-start justify-end gap-6 lg:pb-3">
              <p className="text-lg leading-relaxed text-(--text)">
                Entendemos que cada palabra construye reputación. Somos Caro y
                Diana, socias directoras: una voz propia, atenta a lo que cambia
                y a las personas detrás de cada organización.
              </p>
              <Link href="/contacto" className="btn btn-primary">
                Cuéntanos tu idea
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-24">
          <h3 className="eyebrow">Pilares</h3>
          <ol className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {PILARES.map((pilar) => (
              <li key={pilar.n} className="border-t border-(--azul) pt-5">
                <span
                  aria-hidden="true"
                  className="display block text-5xl text-(--luz)"
                >
                  {pilar.n}
                </span>
                <h4 className="display mt-4 text-2xl leading-tight">{pilar.name}</h4>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-(--text)">
                  {pilar.text}
                </p>
              </li>
            ))}
          </ol>
        </RevealOnScroll>

        <RevealOnScroll className="mt-24">
          <h3 className="eyebrow">Cómo somos</h3>
          <ul className="mt-6 flex flex-wrap gap-3">
            {ATRIBUTOS.map((atributo) => (
              <li
                key={atributo}
                className="border border-(--bruma) px-5 py-2 text-[0.9375rem] tracking-wide text-(--azul)"
              >
                {atributo}
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
