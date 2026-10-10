"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "Portafolio", href: "#portafolio" },
  { label: "Quienes somos", href: "#quienes-somos" },
  { label: "Galerías", href: "#galerias" },
  { label: "Contáctanos", href: "#contacto" },
];

const linkClass =
  "text-sm font-medium tracking-[0.18em] text-(--text-strong) uppercase transition-colors hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-4";

const activeClass = "text-(--accent) underline decoration-2 underline-offset-8";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Highlight the section crossing the middle of the screen.
  useEffect(() => {
    const ids = LINKS.map((link) => link.href.slice(1));
    const inBand = new Set<string>();
    const sync = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom && window.scrollY > 0) return setActive("#contacto");
      const current = ids.filter((id) => inBand.has(id)).pop();
      setActive(current ? `#${current}` : null);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        sync();
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      data-hero-nav
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex items-start justify-between px-4 sm:px-6 lg:justify-center"
    >
      <div className="flex items-center gap-4">
        <a
          href="#"
          aria-label="D&C Agencia, inicio"
          className="soft-surface group pointer-events-auto relative block h-11 w-[5.5rem] shrink-0 overflow-hidden rounded-[1.4rem] focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
        >
          <Image
            src="/images/logo.jpg"
            alt="D&C Agencia"
            fill
            sizes="88px"
            className="scale-[0.95] object-cover mix-blend-multiply"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-shadow duration-500 group-hover:shadow-[inset_3px_3px_5px_var(--pill-shadow-dark),inset_-3px_-3px_5px_var(--pill-shadow-light)]"
          />
        </a>

        <nav
          aria-label="Navegación principal"
          className="neu-raised pointer-events-auto hidden items-center gap-8 rounded-full px-8 py-4 lg:flex"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "location" : undefined}
              className={`${linkClass} ${active === link.href ? activeClass : ""}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div ref={menuRef} className="pointer-events-auto relative lg:hidden">
        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="menu-hamburguesa"
          onClick={() => setMenuOpen((open) => !open)}
          className="soft-surface relative flex h-14 w-14 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
        >
          <span aria-hidden="true" className="relative block h-3.5 w-5 text-(--text-strong)">
            <span
              className={`absolute left-0 block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                menuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute top-1.5 left-0 block h-[2px] w-full rounded-full bg-current transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                menuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>

        <div
          id="menu-hamburguesa"
          aria-hidden={!menuOpen}
          className={`neu-raised absolute top-full right-0 mt-3 flex w-60 flex-col gap-1 rounded-3xl p-3 transition-all duration-300 ${
            menuOpen
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              aria-current={active === link.href ? "location" : undefined}
              className={`${linkClass} ${active === link.href ? activeClass : ""} rounded-2xl px-4 py-3 hover:bg-(--surface) hover:shadow-[inset_3px_3px_5px_var(--pill-shadow-dark),inset_-3px_-3px_5px_var(--pill-shadow-light)]`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
