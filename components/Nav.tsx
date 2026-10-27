"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Trayectoria", href: "/trayectoria" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
];

const linkClass =
  "text-[0.8125rem] tracking-[0.2em] uppercase text-(--azul) transition-colors hover:text-(--gold-text)";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
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
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-(--bruma) bg-(--marfil)/92 backdrop-blur-md"
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Talitha, inicio" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-10 lg:flex">
          {LINKS.map((link) => {
            const current = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`${linkClass} border-b pb-1 ${
                  current ? "border-(--luz)" : "border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span aria-hidden="true" className="relative block h-3.5 w-6 text-(--azul)">
            <span
              className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                menuOpen ? "top-[7px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute top-[7px] left-0 block h-px w-full bg-current transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"
              }`}
            />
          </span>
        </button>
      </div>

      <nav
        id="menu-movil"
        aria-label="Navegación móvil"
        aria-hidden={!menuOpen}
        className={`overflow-hidden border-t border-(--bruma) bg-(--marfil) transition-[max-height,opacity] duration-300 lg:hidden ${
          menuOpen ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
          {LINKS.map((link) => {
            const current = pathname === link.href;
            return (
              <li key={link.href} className="border-b border-(--line) last:border-0">
                <Link
                  href={link.href}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                  aria-current={current ? "page" : undefined}
                  className={`${linkClass} flex items-center justify-between py-4`}
                >
                  {link.label}
                  {current && <span aria-hidden="true" className="h-px w-6 bg-(--luz)" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
