import GlobeExplorerLazy from "./GlobeExplorerLazy";
import RevealOnScroll from "./RevealOnScroll";
import { Seal } from "./Logo";

export default function Galerias() {
  return (
    <section
      id="galerias"
      aria-labelledby="galerias-titulo"
      className="scroll-mt-24 bg-(--azul) text-(--marfil)"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <RevealOnScroll className="flex flex-col gap-16">
          <div className="grid items-end gap-8 border-b border-(--bruma)/40 pb-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Seal className="h-7 w-auto" />
                <p className="eyebrow !text-(--luz)">Galerías</p>
              </div>
              <h2
                id="galerias-titulo"
                className="display !text-(--marfil) text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
              >
                Toca un pin y viaja a <em className="italic">su historia.</em>
              </h2>
            </div>
            <p className="max-w-sm text-lg leading-relaxed text-(--bruma)">
              La Tierra gira hasta cada destino y abre su galería.
            </p>
          </div>

          <GlobeExplorerLazy />
        </RevealOnScroll>
      </div>
    </section>
  );
}
