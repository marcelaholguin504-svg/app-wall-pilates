// Duerme Ya — envío de prueba de un correo del Plan de 14 noches.
// Protegido con CRON_SECRET (el mismo que usa el cron) y, a propósito,
// SOLO puede mandar a marcelaholguin504@gmail.com — nunca a ningún otro
// destinatario, ni aunque se lo pidan por query string. Si este endpoint
// quedara abierto para cualquier correo, cualquiera con el secreto filtrado
// podría usarlo para mandar correos desde hola@duerme-ya.com a quien sea.
// No toca la base de datos: no consulta ni escribe en plan_email_log.
//
// Variables de entorno requeridas (Vercel → Project Settings → Environment
// Variables, NUNCA con prefijo VITE_):
//   CRON_SECRET              — mismo secreto que protege el cron.
//   RESEND_API_KEY            — para poder enviar el correo de prueba.
//   PLAN_UNSUBSCRIBE_SECRET   — para firmar el enlace de baja de muestra.
//
// Uso: POST /api/plan-test-send?night=5
//      Header: Authorization: Bearer <CRON_SECRET>
//
// IMPORTANTE: en /api los imports relativos llevan extensión .js.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { timingSafeEqual } from "node:crypto";
import { planEmailForNight } from "./_lib/plan-emails.js";
import { buildPlanEmailHtml, buildPlanEmailPlainText } from "./_lib/plan-template.js";
import { signUnsubscribeToken } from "./_lib/plan-unsubscribe-token.js";

const TEST_RECIPIENT = "marcelaholguin504@gmail.com";

function isAuthorized(req: VercelRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = req.headers.authorization;
  const provided = typeof header === "string" ? header : "";
  const expected = `Bearer ${secret}`;

  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  if (!isAuthorized(req)) {
    console.error("[plan-test-send] CRON_SECRET inválido o ausente");
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  const nightParam = Array.isArray(req.query.night) ? req.query.night[0] : req.query.night;
  const night = Number(nightParam);
  if (!Number.isInteger(night) || night < 1 || night > 14) {
    res.status(400).json({ error: "El parámetro night debe ser un entero entre 1 y 14" });
    return;
  }

  const email = planEmailForNight(night);
  const apiKey = process.env.RESEND_API_KEY;
  const unsubscribeSecret = process.env.PLAN_UNSUBSCRIBE_SECRET;
  if (!email || !apiKey || !unsubscribeSecret) {
    console.error("[plan-test-send] configuración incompleta o noche sin contenido");
    res.status(500).json({ error: "Configuración incompleta del servidor" });
    return;
  }

  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "app-duerme-ya.vercel.app";
  const token = signUnsubscribeToken("cuenta-de-prueba", unsubscribeSecret);
  const unsubscribeUrl = `https://${host}/api/plan-unsubscribe?token=${encodeURIComponent(token)}`;
  const html = buildPlanEmailHtml(email.subject, email.body, unsubscribeUrl);
  const text = buildPlanEmailPlainText(email.subject, email.body, unsubscribeUrl);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Duerme Ya <hola@duerme-ya.com>",
        to: TEST_RECIPIENT,
        subject: `[PRUEBA] ${email.subject}`,
        html,
        text,
      }),
    });
    if (!response.ok) {
      console.error("[plan-test-send] Resend respondió con error", response.status, await response.text());
      res.status(502).json({ error: "Resend no pudo enviar el correo de prueba" });
      return;
    }
  } catch (err) {
    console.error("[plan-test-send] error de red", err);
    res.status(502).json({ error: "Error de red enviando el correo de prueba" });
    return;
  }

  res.status(200).json({ ok: true, night, to: TEST_RECIPIENT });
}
