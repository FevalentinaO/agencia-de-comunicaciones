"use client";

import { useRef, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

function SheetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 10h16M4 15h16M10 4v16" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export default function ContactBar() {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al enviar");
      setStatus("success");
      form.reset();
      setExpanded(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar");
    }
  }

  return (
    <section
      id="contacto"
      data-hero-contact
      className="mx-auto w-full max-w-2xl px-4 pb-16"
      aria-labelledby="contacto-heading"
    >
      <h2 id="contacto-heading" className="sr-only">
        Conecta con nosotras
      </h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="neu-raised flex flex-col gap-4 rounded-[2rem] p-5 sm:p-6"
      >
        {/* Honeypot: hidden from real users, bots tend to fill every field */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="absolute h-0 w-0 opacity-0"
          aria-hidden="true"
        />

        <textarea
          name="message"
          required
          minLength={5}
          rows={expanded ? 2 : 1}
          placeholder="Tu idea…"
          onFocus={() => setExpanded(true)}
          className="neu-inset w-full resize-none rounded-2xl px-5 py-4 text-sm text-(--text-strong) placeholder:text-(--text) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
        />

        {expanded && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              required
              minLength={2}
              placeholder="Tu nombre"
              className="neu-inset rounded-2xl px-5 py-3 text-sm text-(--text-strong) placeholder:text-(--text) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Tu correo"
              className="neu-inset rounded-2xl px-5 py-3 text-sm text-(--text-strong) placeholder:text-(--text) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3 text-(--text)">
            <span className="neu-raised-sm flex h-9 w-9 items-center justify-center rounded-full">
              <MailIcon />
            </span>
            <span className="neu-raised-sm flex h-9 w-9 items-center justify-center rounded-full">
              <SheetIcon />
            </span>
            <p className="text-xs leading-tight">
              Tu consulta, directa
              <br />a nuestros sistemas.
            </p>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="neu-raised-sm rounded-full px-6 py-2.5 text-xs font-medium tracking-[0.14em] text-(--text-strong) uppercase transition-shadow disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
          >
            {status === "sending" ? "Enviando…" : "Conecta con nosotras"}
          </button>
        </div>

        <p role="status" aria-live="polite" className="min-h-[1.25rem] text-xs text-(--text-strong)">
          {status === "success" && "Recibido. Te escribimos pronto."}
          {status === "error" && (errorMsg || "Algo falló. Intenta de nuevo.")}
        </p>
      </form>
    </section>
  );
}
