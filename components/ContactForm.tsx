"use client";

import { useRef, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
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
      aria-label="Formulario de contacto"
      className="flex flex-col gap-7 border border-(--bruma) bg-(--surface) p-7 sm:p-10"
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

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="eyebrow">Nombre</span>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            placeholder="Tu nombre"
            className="field"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="eyebrow">Correo</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Tu correo"
            className="field"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="eyebrow">Tu idea</span>
        <textarea
          name="message"
          required
          minLength={5}
          rows={5}
          placeholder="Cuéntanos qué quieres decir y a quién."
          className="field resize-none"
        />
      </label>

      <div className="flex flex-col items-start gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary"
        >
          {status === "sending" ? "Enviando…" : "Enviar mensaje"}
        </button>

        <p
          role="status"
          aria-live="polite"
          className="min-h-[1.25rem] text-[0.9375rem] text-(--azul)"
        >
          {status === "success" && "Recibido. Te escribimos pronto."}
          {status === "error" && (errorMsg || "Algo falló. Intenta de nuevo.")}
        </p>
      </div>
    </form>
  );
}
