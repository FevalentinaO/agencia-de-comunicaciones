import About from "@/components/About";
import AnimatedPage from "@/components/AnimatedPage";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import ContactBar from "@/components/ContactBar";
import Footer from "@/components/Footer";
import Galerias from "@/components/Galerias";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <AnimatedPage>
        <BackgroundBlobs />
        <Nav />
        <Hero />
        <About />
        <Galerias />
        <ContactBar />
      </AnimatedPage>
      <Footer />
    </main>
  );
}
