import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caro & Diana — AGENCIA DE COMUNICACIONES",
  description:
    "Agencia de comunicaciones dirigida por Caro y Diana. Portafolio, animaciones y fotografía con criterio propio.",
  openGraph: {
    title: "Caro & Diana — AGENCIA DE COMUNICACIONES",
    description: "Agencia de comunicaciones dirigida por Caro y Diana.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--bg) text-(--text)">
        {children}
      </body>
    </html>
  );
}
