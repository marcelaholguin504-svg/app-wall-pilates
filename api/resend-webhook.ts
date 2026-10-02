// Webhook de Resend: alerta por correo cuando un envío de acceso (enlace
// mágico o código) rebota, se retrasa, o se marca como spam. NUNCA hace
// nada sin verificar primero la firma — ver api/_lib/resend.ts.
//
// Variables de entorno requeridas (configúralas en Vercel → Project
// Settings → Environment Variables, NUNCA con prefijo VITE_):
//   RESEND_WEBHOOK_SECRET — "Signing Secret" del webhook en Resend (empieza con whsec_).
//   RESEND_API_KEY        — API key de Resend, para poder ENVIAR la alerta.
//   ALERTAS_EMAIL          — a qué correo mandar la alerta.
// Opcional:
//   ALERTAS_FROM_EMAIL     — remitente de la alerta (debe ser de un dominio
//                            verificado en Resend). Si no se define, usa
//                            "Duerme Ya <alertas@duerme-ya.com>".
//
// Supone que Resend ya está configurado como proveedor SMTP de Supabase
// Auth (Authentication → Settings → SMTP Settings) — si los correos de
// acceso no pasan por Resend, este webhook nunca recibirá eventos sobre
// ellos.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyResendSignature, extractAlertInfo, buildAlertEmail } from "./_lib/resend.js";

// Necesitamos el cuerpo CRUDO (sin que Vercel lo convierta a JSON solo) para
// poder verificar la firma sobre los bytes exactos que Resend envió.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Buffer));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const rawBody = await readRawBody(req);
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (!verifyResendSignature(req.headers, rawBody, secret)) {
    console.error("[resend-webhook] firma inválida o ausente");
    res.status(401).json({ error: "Firma inválida" });
    return;
  }

  // La firma ya es válida: a partir de aquí SIEMPRE respondemos 200 —
  // un fallo al mandar la alerta se registra en los logs, nunca hace que
  // Resend reciba un error y reintente innecesariamente.
  let payload: unknown = null;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error("[resend-webhook] no se pudo leer el cuerpo como JSON", err);
    res.status(200).json({ ok: true });
    return;
  }

  const info = extractAlertInfo(payload);
  if (!info) {
    res.status(200).json({ ok: true, skipped: "evento_no_relevante" });
    return;
  }

  const alertasEmail = process.env.ALERTAS_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!alertasEmail || !apiKey) {
    console.error("[resend-webhook] faltan RESEND_API_KEY o ALERTAS_EMAIL en el entorno");
    res.status(200).json({ ok: true, skipped: "configuracion_incompleta" });
    return;
  }

  // Evita un ciclo infinito: si el evento es sobre un correo mandado A la
  // propia dirección de alertas, no generamos otra alerta por él.
  if (info.recipientEmail === alertasEmail.toLowerCase().trim()) {
    res.status(200).json({ ok: true, skipped: "evento_sobre_la_propia_alerta" });
    return;
  }

  const { subject, text } = buildAlertEmail(info, new Date());
  const fromEmail = process.env.ALERTAS_FROM_EMAIL || "Duerme Ya <alertas@duerme-ya.com>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: fromEmail, to: alertasEmail, subject, text }),
    });
    if (!response.ok) {
      console.error("[resend-webhook] Resend respondió con error al enviar la alerta", response.status, await response.text());
    }
  } catch (err) {
    console.error("[resend-webhook] error de red enviando la alerta", err);
  }

  res.status(200).json({ ok: true });
}
