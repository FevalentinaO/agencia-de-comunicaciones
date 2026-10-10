import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { appendToSheet, sendNotificationEmail } from "@/lib/google";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  // Honeypot: a filled "company" field means a bot. Pretend success, do nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const results = await Promise.allSettled([
    appendToSheet(parsed.data),
    sendNotificationEmail(parsed.data),
  ]);

  const [sheetResult, emailResult] = results;
  const sheetFailed = sheetResult.status === "rejected";
  const emailFailed = emailResult.status === "rejected";

  if (sheetResult.status === "rejected") {
    console.error("Sheets append failed:", sheetResult.reason);
  }
  if (emailResult.status === "rejected") {
    console.error("Email send failed:", emailResult.reason);
  }

  if (sheetFailed && emailFailed) {
    return NextResponse.json(
      { error: "No pudimos recibir tu mensaje. Intenta más tarde." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
