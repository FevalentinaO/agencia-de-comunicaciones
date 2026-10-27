import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactBar() {
  return (
    <section aria-labelledby="cta-titulo" className="border-t border-(--bruma)">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-5 py-24 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Contacto</p>
          <h2
            id="cta-titulo"
            className="display max-w-xl text-4xl leading-[1.1] sm:text-5xl"
          >
            ¿Tienes algo que <em className="italic">decir?</em>
          </h2>
        </div>
        <Link href="/contacto" className="btn btn-primary">
          Cuéntanos tu idea
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
