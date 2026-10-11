import type { Metadata } from "next";
import AnimatedPage from "@/components/AnimatedPage";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import TrayectoriaTabs from "@/components/TrayectoriaTabs";

export const metadata: Metadata = {
  title: "Trayectoria — Caro & Diana",
  description: "Un recorrido visual por nuestra trayectoria.",
};

export default function TrayectoriaPage() {
  return (
    // overflow-x-clip (not hidden) so the gallery's sticky stage keeps working.
    <main className="relative flex min-h-screen w-full flex-col overflow-x-clip bg-white">
      <AnimatedPage>
        <Nav />

        <section
          aria-labelledby="trayectoria-titulo"
          className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 pt-36 pb-10 text-center"
        >
          <p className="text-sm font-medium tracking-[0.3em] text-(--text) uppercase">
            Nuestra trayectoria
          </p>
          <h1
            id="trayectoria-titulo"
            className="font-(family-name:--font-display) text-4xl leading-[1.15] font-medium tracking-wide text-(--text-strong) sm:text-5xl"
          >
            Una historia hecha de mensajes que llegan
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-(--text)">
            Caro y Diana reúnen años de oficio en la comunicación. Cada proyecto
            nos enseñó a decir más con menos: claridad, criterio y cercanía.
            Este es un recorrido por los momentos que han dado forma a nuestra
            manera de trabajar.
          </p>
        </section>

        <TrayectoriaTabs />
      </AnimatedPage>
      <Footer />
    </main>
  );
}
