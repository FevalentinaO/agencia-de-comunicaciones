"use client";

import { useRef, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "neu-inset w-full rounded-2xl px-5 py-3.5 text-sm text-(--text-strong) placeholder:text-(--text)";

export default function ContactForm({
  showHeading = true,
}: {
  showHeading?: boolean;
}) {
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
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-labelledby={showHeading ? "contacto-heading" : undefined}
      aria-label={showHeading ? undefined : "Formulario de contacto"}
      className="neu-raised flex flex-col gap-5 rounded-[2rem] p-6 sm:p-10"
    >
      {showHeading && (
        <div className="flex flex-col gap-2 text-center">
          <h2
            id="contacto-heading"
            className="font-(family-name:--font-display) text-3xl font-medium tracking-wide text-(--text-strong) sm:text-4xl"
          >
            Hablemos
          </h2>
          <p className="text-base text-(--text)">
            Cuéntanos tu idea y te respondemos pronto.
          </p>
        </div>
      )}

      {/* Honeypot: hidden from real users, bots tend to fill every field */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          required
          minLength={2}
          autoComplete="name"
          aria-label="Tu nombre"
          placeholder="Tu nombre"
          className={fieldClass}
        />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-label="Tu correo"
          placeholder="Tu correo"
          className={fieldClass}
        />
      </div>

      <textarea
        name="message"
        required
        minLength={5}
        rows={5}
        aria-label="Tu idea"
        placeholder="Tu idea…"
        className={`${fieldClass} resize-none`}
      />

      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="pop-pill text-sm tracking-wide disabled:opacity-60"
        >
          {status === "sending" ? "Enviando…" : "Enviar mensaje"}
        </button>

        <p
          role="status"
          aria-live="polite"
          className="min-h-[1.25rem] text-sm text-(--text-strong)"
        >
          {status === "success" && "Recibido. Te escribimos pronto."}
          {status === "error" && (errorMsg || "Algo falló. Intenta de nuevo.")}
        </p>
      </div>
    </form>
  );
}
