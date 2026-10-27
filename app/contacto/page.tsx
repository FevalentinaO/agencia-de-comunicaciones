import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Seal } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Contacto — Talitha",
  description: "Cuéntanos tu idea y te respondemos pronto.",
};

const PASOS = [
  "Nos cuentas tu idea.",
  "Te escribimos para conocerla mejor.",
  "Empezamos a darle forma.",
];

export default function ContactoPage() {
  return (
    <section aria-labelledby="contacto-titulo" className="pt-[4.5rem]">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:py-28">
        <div className="flex flex-col items-start gap-8">
          <div className="flex items-center gap-4">
            <Seal className="h-7 w-auto" />
            <p className="eyebrow">Contacto</p>
          </div>

          <h1
            id="contacto-titulo"
            className="display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Hablemos de lo que <em className="italic">quieres decir.</em>
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-(--text)">
            Una idea por mensaje basta. Te respondemos pronto, con criterio y sin
            formulismos.
          </p>

          <div className="w-full max-w-md border-t border-(--bruma) pt-8">
            <h2 className="eyebrow">Qué sigue</h2>
            <ol className="mt-6 flex flex-col gap-5">
              {PASOS.map((paso, index) => (
                <li key={paso} className="flex items-baseline gap-5">
                  <span aria-hidden="true" className="display text-3xl text-(--luz)">
                    0{index + 1}
                  </span>
                  <span className="text-(--azul)">{paso}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="self-start">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
