import GlobeExplorerLazy from "./GlobeExplorerLazy";
import RevealOnScroll from "./RevealOnScroll";

export default function Galerias() {
  return (
    <section
      id="galerias"
      aria-labelledby="galerias-heading"
      className="mx-auto w-full max-w-5xl scroll-mt-28 px-4 py-24"
    >
      <RevealOnScroll className="flex flex-col items-center gap-12">
        <div className="flex max-w-2xl flex-col items-center gap-5 text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-(--text) uppercase">
            Galerías
          </p>
          <h2
            id="galerias-heading"
            className="font-(family-name:--font-display) text-3xl leading-[1.15] font-medium tracking-wide text-(--text-strong) sm:text-4xl"
          >
            Toca un pin y viaja a su historia.
          </h2>
          <p className="text-base leading-relaxed text-(--text)">
            La Tierra gira hasta cada destino y abre su galería.
          </p>
        </div>

        <GlobeExplorerLazy />
      </RevealOnScroll>
    </section>
  );
}
