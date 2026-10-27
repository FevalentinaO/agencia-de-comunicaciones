import Link from "next/link";
import Logo from "./Logo";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Trayectoria", href: "/trayectoria" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-(--azul) text-(--marfil)">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-16 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-8">
          <Logo tone="light" descriptor />
          <p className="max-w-md font-(family-name:--font-display) text-2xl leading-snug text-(--marfil) italic">
            Pensamos, cuestionamos, proponemos y ejecutamos con intención.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 md:flex-col md:items-end">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.8125rem] tracking-[0.2em] text-(--bruma) uppercase transition-colors hover:text-(--luz)"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-(--bruma)/30">
        <p className="mx-auto w-full max-w-6xl px-5 py-6 text-sm text-(--bruma) sm:px-8">
          © 2026 Talitha · Comunicación Estratégica. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
