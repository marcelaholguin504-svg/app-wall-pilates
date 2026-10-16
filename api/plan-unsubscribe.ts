// Duerme Ya — endpoint público (a propósito, se enlaza desde los correos
// del Plan de 14 noches, sin sesión) que marca una cuenta como
// plan_unsubscribed=true cuando alguien toca "Ya no quiero recibir estos
// correos". El token trae el account_id firmado — nunca el correo en la
// URL — así que un enlace reenviado o filtrado solo sirve para dar de baja
// esa misma cuenta, nunca para leer ni cambiar nada más.
//
// Variables de entorno requeridas (Vercel → Project Settings → Environment
// Variables, NUNCA con prefijo VITE_):
//   SUPABASE_URL               — URL del proyecto de Supabase.
//   SUPABASE_SERVICE_ROLE_KEY  — clave secreta "service_role" de Supabase.
//   PLAN_UNSUBSCRIBE_SECRET    — mismo secreto usado para firmar el enlace.
//
// IMPORTANTE: en /api los imports relativos llevan extensión .js.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { verifyUnsubscribeToken } from "./_lib/plan-unsubscribe-token.js";

function page(title: string, message: string): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background-color:#fdf6f0;font-family:-apple-system,Helvetica,Arial,sans-serif;color:#3a2e2a;">
  <div style="max-width:420px;margin:0 auto;padding:48px 20px;text-align:center;">
    <p style="font-size:18px;font-weight:700;margin:0 0 12px;">${title}</p>
    <p style="font-size:15px;line-height:1.5;margin:0;">${message}</p>
  </div>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const tokenParam = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;
  const secret = process.env.PLAN_UNSUBSCRIBE_SECRET;
  const accountId = tokenParam ? verifyUnsubscribeToken(tokenParam, secret) : null;

  if (!accountId) {
    res
      .status(400)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(page("Enlace no válido", "Este enlace ya venció o no es correcto. Si quieres dejar de recibir los correos, escríbenos a hola@duerme-ya.com."));
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("[plan-unsubscribe] faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno");
    res.status(500).setHeader("Content-Type", "text/html; charset=utf-8").send(page("Algo no salió bien", "Intenta de nuevo en un momento, o escríbenos a hola@duerme-ya.com."));
    return;
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { error } = await admin.from("accounts").update({ plan_unsubscribed: true }).eq("id", accountId);

  if (error) {
    console.error("[plan-unsubscribe] error marcando plan_unsubscribed", error);
    res.status(500).setHeader("Content-Type", "text/html; charset=utf-8").send(page("Algo no salió bien", "Intenta de nuevo en un momento, o escríbenos a hola@duerme-ya.com."));
    return;
  }

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8")
    .send(page("Listo 💛", "Ya no vas a recibir los correos del Plan de 14 noches. El resto de Duerme Ya sigue funcionando igual."));
}
