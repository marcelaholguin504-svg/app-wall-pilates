// Duerme Ya — cron diario del Plan de 14 noches. Vercel lo ejecuta solo en
// producción (nunca en vistas previas) a las 23:00 UTC = 6:00 p. m. hora de
// Colombia (America/Bogota no tiene horario de verano) — ver vercel.json.
//
// Protegido con CRON_SECRET: Vercel agrega automáticamente el header
// "Authorization: Bearer <CRON_SECRET>" en sus invocaciones de cron cuando
// esa variable de entorno existe en el proyecto — por eso basta con
// compararlo aquí, sin configuración extra en vercel.json.
//
// Variables de entorno requeridas (Vercel → Project Settings → Environment
// Variables, NUNCA con prefijo VITE_):
//   CRON_SECRET                — protege este endpoint (y api/plan-test-send.ts).
//   SUPABASE_URL                — URL del proyecto de Supabase.
//   SUPABASE_SERVICE_ROLE_KEY   — clave secreta "service_role" de Supabase.
//   RESEND_API_KEY              — para poder enviar los correos.
//   PLAN_UNSUBSCRIBE_SECRET     — firma el enlace de baja de cada correo.
// Opcional:
//   DRY_RUN=true                — solo registra en los logs a quién le
//                                  tocaría enviar, sin mandar ni registrar
//                                  nada. Ponla en "true" la primera vez que
//                                  esto corra en producción.
//
// IMPORTANTE: en /api los imports relativos llevan extensión .js.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "node:crypto";
import { runPlanCron } from "../_lib/plan-cron.js";

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
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  if (!isAuthorized(req)) {
    console.error("[plan-cron] CRON_SECRET inválido o ausente");
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("[plan-cron] faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno");
    res.status(500).json({ error: "Configuración incompleta del servidor" });
    return;
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const dryRun = process.env.DRY_RUN === "true";
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "app-duerme-ya.vercel.app";

  try {
    const result = await runPlanCron({
      admin,
      now: new Date(),
      dryRun,
      fetchImpl: fetch,
      resendApiKey: process.env.RESEND_API_KEY,
      unsubscribeSecret: process.env.PLAN_UNSUBSCRIBE_SECRET,
      baseUrl: `https://${host}`,
    });

    console.log("[plan-cron]", dryRun ? "DRY_RUN" : "envío real", JSON.stringify(result));
    res.status(200).json({ ok: true, dryRun, ...result });
  } catch (err) {
    console.error("[plan-cron] error inesperado", err);
    res.status(500).json({ error: "Error interno" });
  }
}
