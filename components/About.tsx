import { ArrowRight } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

const PEOPLE = [
  { initial: "C", name: "Caro" },
  { initial: "D", name: "Diana" },
];

const STEPS = [
  "Definimos tu mensaje",
  "Lo llevamos a los canales adecuados",
  "Cuidamos cómo se percibe",
];

export default function About() {
  return (
    <section
      id="quienes-somos"
      aria-labelledby="quienes-somos-heading"
      className="mx-auto w-full max-w-5xl scroll-mt-28 px-4 py-24"
    >
      <RevealOnScroll>
        <div className="neu-raised grid gap-10 rounded-[2.5rem] p-8 sm:p-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14">
          <div className="flex flex-col items-start gap-6">
            <p className="text-xs font-medium tracking-[0.3em] text-(--text) uppercase">
              Quiénes somos
            </p>

            <h2
              id="quienes-somos-heading"
              className="font-(family-name:--font-display) text-4xl leading-[1.1] font-medium tracking-wide text-(--text-strong) sm:text-5xl"
            >
              Un poquito de nosotras
            </h2>

            <div className="flex flex-col gap-3 text-base leading-relaxed text-(--text)">
              <p>
                Somos Caro y Diana, directoras de una agencia de
                comunicaciones. Con una trayectoria enorme en el oficio,
                ayudamos a marcas y personas a decir lo que quieren decir, con
                claridad y en el momento justo.
              </p>
              <p>Menos ruido, más propósito.</p>
            </div>

            <a
              href="#contacto"
              className="pop-pill inline-flex items-center gap-3 text-sm tracking-wide focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
            >
              Cuéntanos tu idea
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="flex flex-col gap-6">
            <ul className="grid grid-cols-2 gap-4">
              {PEOPLE.map((person) => (
                <li
                  key={person.name}
                  className="neu-raised-sm flex flex-col items-center gap-3 rounded-3xl px-4 py-6 text-center"
                >
                  <span
                    aria-hidden="true"
                    className="neu-inset flex h-14 w-14 items-center justify-center rounded-full font-(family-name:--font-display) text-2xl font-medium text-(--text-strong)"
                  >
                    {person.initial}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-(family-name:--font-display) text-xl font-medium text-(--text-strong)">
                      {person.name}
                    </span>
                    <span className="text-xs tracking-wide text-(--text)">
                      Directora de Agencia
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <ol className="flex flex-col gap-3">
              {STEPS.map((step, index) => (
                <li
                  key={step}
                  className="neu-inset flex items-center gap-4 rounded-full py-3 pr-6 pl-4 text-sm text-(--text-strong)"
                >
                  <span
                    aria-hidden="true"
                    className="neu-raised-sm flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                  >
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
