import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import "./globals.css";

// Brand typography: Cormorant Garamond for titles and the logotype,
// Lora for paragraphs and the descriptor.
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Lora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talitha — Comunicación Estratégica",
  description:
    "Criterio con personalidad, creatividad con propósito y excelencia en cada detalle. Entendemos que cada palabra construye reputación.",
  openGraph: {
    title: "Talitha — Comunicación Estratégica",
    description:
      "Pensamos, cuestionamos, proponemos y ejecutamos con intención.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Loader />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
