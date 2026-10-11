"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Trayectoria", href: "/trayectoria" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
];

const linkClass =
  "text-sm font-medium tracking-[0.18em] text-(--text-strong) uppercase transition-colors hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-4";

const activeClass = "text-(--accent) underline decoration-2 underline-offset-8";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
        <Link
          href="/"
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
        </Link>

        <nav
          aria-label="Navegación principal"
          className="neu-raised pointer-events-auto hidden items-center gap-8 rounded-full px-8 py-4 lg:flex"
        >
          {LINKS.map((link) => {
            const current = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`${linkClass} ${current ? activeClass : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
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
          {LINKS.map((link) => {
            const current = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                aria-current={current ? "page" : undefined}
                className={`${linkClass} ${current ? activeClass : ""} rounded-2xl px-4 py-3 hover:bg-(--surface) hover:shadow-[inset_3px_3px_5px_var(--pill-shadow-dark),inset_-3px_-3px_5px_var(--pill-shadow-light)]`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
