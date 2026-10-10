const LINKS = [
  { label: "Quienes somos", href: "#quienes-somos" },
  { label: "Galerías", href: "#galerias" },
  { label: "Contáctanos", href: "#contacto" },
];

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 border-t border-(--text-strong)/10 px-4 py-10 text-center">
      <nav aria-label="Pie de página" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm tracking-wide text-(--text) transition-colors hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-4"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <p className="text-sm text-(--text)">
        © 2026 Caro &amp; Diana. Todos los derechos reservados.
      </p>
    </footer>
  );
}
