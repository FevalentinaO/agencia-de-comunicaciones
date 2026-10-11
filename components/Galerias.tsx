import GlobeExplorerLazy from "./GlobeExplorerLazy";
import RevealOnScroll from "./RevealOnScroll";
import WaveEdge from "./WaveEdge";

export default function Galerias() {
  return (
    <section
      id="galerias"
      aria-labelledby="galerias-heading"
      className="relative my-24 scroll-mt-28 bg-(--band) py-16 [--band:#aeb6c3] sm:my-32"
    >
      <WaveEdge />
      <WaveEdge flip />

      <RevealOnScroll className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 px-4">
        <div className="flex max-w-2xl flex-col items-center gap-5 text-center">
          <p className="text-sm font-medium tracking-[0.3em] text-(--text-strong) uppercase">
            Galerías
          </p>
          <h2
            id="galerias-heading"
            className="font-(family-name:--font-display) text-3xl leading-[1.15] font-medium tracking-wide text-(--text-strong) sm:text-4xl"
          >
            Toca un pin y viaja a su historia.
          </h2>
          <p className="text-base leading-relaxed text-(--text-strong)">
            La Tierra gira hasta cada destino y abre su galería.
          </p>
        </div>

        <GlobeExplorerLazy />
      </RevealOnScroll>
    </section>
  );
}
