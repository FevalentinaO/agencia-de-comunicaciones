import AnimatedPage from "./AnimatedPage";
import BackgroundBlobs from "./BackgroundBlobs";
import Footer from "./Footer";
import Nav from "./Nav";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <AnimatedPage>
        <BackgroundBlobs />
        <Nav />
        <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center gap-6 px-4 pt-32 pb-20 text-center">
          <h1 className="pop-card font-(family-name:--font-display) text-4xl leading-[1.1] font-medium tracking-wide text-(--text-strong) uppercase sm:text-5xl">
            {title}
          </h1>
          <p className="text-base text-(--text)">Muy pronto.</p>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
