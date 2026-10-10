import OrganicFrame from "./OrganicFrame";

const TITLE_LINES = ["HAZ NOTICIA", "TU MARCA"];

export default function Hero() {
  return (
    <section
      data-hero-section
      className="perspective-container relative flex min-h-[78vh] items-center pt-20"
    >
      <div
        data-hero-scroll-tilt
        className="preserve-3d mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-10 lg:flex-row lg:items-center lg:justify-start lg:gap-14"
      >
        <OrganicFrame />

        <div className="flex max-w-xl flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <h1
            data-hero-title
            className="font-(family-name:--font-display) text-3xl leading-[1.1] font-medium tracking-wide text-(--text-strong) uppercase sm:text-4xl lg:text-5xl"
          >
            {TITLE_LINES.map((line) => (
              <span key={line} className="block overflow-hidden whitespace-nowrap">
                <span data-hero-title-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div data-hero-subtitle>
            <a
              href="#quienes-somos"
              className="pop-pill inline-block text-sm tracking-wide focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2 sm:text-base"
            >
              Caro &amp; Diana. Directoras de Agencia.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
