import RevealOnScroll from "./RevealOnScroll";

export default function About() {
  return (
    <section
      id="quienes-somos"
      aria-labelledby="quienes-somos-heading"
      className="mx-auto w-full max-w-3xl scroll-mt-28 px-4 py-24"
    >
      <RevealOnScroll className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-medium tracking-[0.3em] text-(--text) uppercase">
          Quiénes somos
        </p>

        <h2
          id="quienes-somos-heading"
          className="font-(family-name:--font-display) text-3xl leading-[1.15] font-medium tracking-wide text-(--text-strong) sm:text-4xl"
        >
          Una agencia de comunicaciones que cuida lo que dices y cómo llega.
        </h2>

        <div className="flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-(--text)">
          <p>
            Una agencia de comunicaciones se encarga de que una marca o una
            persona diga lo que quiere decir, con claridad y en el momento
            justo. Definimos el mensaje, lo llevamos a los medios y canales
            adecuados y cuidamos cómo se percibe.
          </p>
          <p>
            Caro y Diana reúnen una trayectoria enorme en el oficio. Por eso
            cada proyecto se trabaja con criterio, cercanía y sin ruido: menos
            palabras, más propósito.
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}
