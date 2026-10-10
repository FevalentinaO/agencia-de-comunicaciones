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
  "text-xs font-medium tracking-[0.18em] text-(--text-strong) uppercase transition-colors hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-4";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // The centered menu appears once the hero (photo + pill) and the CTA form
  // below it have both scrolled out of view.
  useEffect(() => {
    const cta = document.querySelector("[data-hero-contact]");
    if (!cta) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(cta);
    return () => observer.disconnect();
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
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex items-start justify-between px-4 sm:px-6"
    >
      <a
        href="#"
        aria-label="C&D Comunicaciones, inicio"
        className="soft-surface group pointer-events-auto relative block h-14 w-28 shrink-0 overflow-hidden rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
      >
        <Image
          src="/images/logo.jpg"
          alt="C&D Comunicaciones"
          fill
          sizes="112px"
          className="scale-[1.08] object-cover"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-shadow duration-500 group-hover:shadow-[inset_3px_3px_5px_var(--pill-shadow-dark),inset_-3px_-3px_5px_var(--pill-shadow-light)]"
        />
      </a>

      <nav
        aria-label="Navegación principal"
        aria-hidden={!pastHero}
        className={`neu-raised pointer-events-auto absolute top-0 left-1/2 hidden -translate-x-1/2 items-center gap-8 rounded-full px-8 py-4 transition-all duration-500 lg:flex ${
          pastHero
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-3 opacity-0"
        }`}
      >
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className={linkClass} tabIndex={pastHero ? 0 : -1}>
            {link.label}
          </a>
        ))}
      </nav>

      <div ref={menuRef} className="pointer-events-auto relative">
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
              className={`${linkClass} rounded-2xl px-4 py-3 hover:bg-(--surface) hover:shadow-[inset_3px_3px_5px_var(--pill-shadow-dark),inset_-3px_-3px_5px_var(--pill-shadow-light)]`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
