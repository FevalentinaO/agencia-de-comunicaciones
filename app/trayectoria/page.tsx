import type { Metadata } from "next";
import { Seal } from "@/components/Logo";
import TrayectoriaTabs from "@/components/TrayectoriaTabs";

export const metadata: Metadata = {
  title: "Trayectoria — Talitha",
  description: "Un recorrido visual por nuestra trayectoria.",
};

export default function TrayectoriaPage() {
  return (
    <>
      <section
        aria-labelledby="trayectoria-titulo"
        className="pt-[4.5rem]"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-5 pt-20 pb-14 sm:px-8 lg:pt-28">
          <div className="flex items-center gap-4">
            <Seal className="h-7 w-auto" />
            <p className="eyebrow">Nuestra trayectoria</p>
          </div>
          <h1
            id="trayectoria-titulo"
            className="display max-w-3xl text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Una historia hecha de <em className="italic">mensajes que llegan.</em>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-(--text)">
            Caro y Diana reúnen años de oficio en la comunicación. Cada proyecto
            nos enseñó a decir más con menos: claridad, criterio y cercanía. Este
            es un recorrido por los momentos que han dado forma a nuestra manera
            de trabajar.
          </p>
        </div>
      </section>

      <TrayectoriaTabs />
    </>
  );
}
