import type { Metadata } from "next";
import AnimatedPage from "@/components/AnimatedPage";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import WaveSide from "@/components/WaveSide";

export const metadata: Metadata = {
  title: "Contacto — Caro & Diana",
  description: "Cuéntanos tu idea y te respondemos pronto.",
};

const STEPS = [
  "Nos cuentas tu idea",
  "Te escribimos para conocerla mejor",
  "Empezamos a darle forma",
];

export default function ContactoPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <AnimatedPage>
        <BackgroundBlobs />
        <Nav />

        <section aria-labelledby="contacto-titulo" className="relative isolate w-full">
          <WaveSide />

          <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 pt-36 pb-24 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-44">
            <div className="flex flex-col items-center gap-7 text-center lg:items-start lg:text-left">
              <p className="text-sm font-medium tracking-[0.3em] text-(--text) uppercase">
                Contacto
              </p>

              <h1
                id="contacto-titulo"
                className="pop-card font-(family-name:--font-display) text-4xl leading-[1.1] font-medium tracking-wide text-(--text-strong) uppercase sm:text-5xl"
              >
                Hablemos
              </h1>

              <p className="max-w-md text-base leading-relaxed text-(--text)">
                Cuéntanos tu idea y te respondemos pronto. Menos ruido, más
                propósito.
              </p>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-medium tracking-[0.3em] text-(--text) uppercase">
                  Qué sigue
                </h2>
                <ol className="relative flex flex-col gap-5 text-left before:absolute before:top-4 before:bottom-4 before:left-4 before:w-px before:bg-(--text-strong)/20">
                  {STEPS.map((step, index) => (
                    <li
                      key={step}
                      className="relative flex items-center gap-4 text-sm text-(--text-strong)"
                    >
                      <span
                        aria-hidden="true"
                        className="neu-raised-sm relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                      >
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div data-hero-contact>
              <ContactForm showHeading={false} />
            </div>
          </div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
