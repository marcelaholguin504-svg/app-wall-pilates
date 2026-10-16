// Webhook de Hotmart: crea la cuenta y la membresía "admin" cuando una
// compra se aprueba. NUNCA crea nada sin verificar primero el HOTTOK — ver
// api/_lib/hotmart.ts para la lógica de verificación (probada por separado
// en scripts/test-hotmart-verify.mjs porque este entorno no tiene forma de
// disparar un webhook real de Hotmart).
//
// Variables de entorno requeridas (configúralas en Vercel → Project
// Settings → Environment Variables, NUNCA con prefijo VITE_):
//   HOTMART_HOTTOK             — el mismo valor configurado en el panel de Hotmart.
//   SUPABASE_URL               — URL del proyecto de Supabase.
//   SUPABASE_SERVICE_ROLE_KEY  — clave secreta "service_role" de Supabase.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { verifyHotmartRequest, extractPurchaseInfo } from "./_lib/hotmart.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  let payload: unknown = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = null;
    }
  }

  const expectedHottok = process.env.HOTMART_HOTTOK;
  if (!verifyHotmartRequest(req.headers, payload, expectedHottok)) {
    console.error("[hotmart-webhook] firma HOTTOK inválida o ausente");
    res.status(401).json({ error: "Firma inválida" });
    return;
  }

  const info = extractPurchaseInfo(payload);
  if (!info) {
    console.error("[hotmart-webhook] no se pudo interpretar el payload:", JSON.stringify(payload));
    // 200 para que Hotmart no reintente indefinidamente un formato que
    // nunca vamos a poder leer; no se crea nada.
    res.status(200).json({ ok: true, skipped: "payload_no_reconocido" });
    return;
  }

  if (!info.isApproved && !info.isRefundOrChargeback) {
    res.status(200).json({ ok: true, skipped: "evento_no_relevante" });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("[hotmart-webhook] faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno");
    res.status(500).json({ error: "Configuración incompleta del servidor" });
    return;
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // Idempotencia: Hotmart puede reintentar la misma notificación.
  const { data: existingAccount, error: lookupError } = await admin
    .from("accounts")
    .select("id")
    .eq("hotmart_purchase_id", info.purchaseId)
    .maybeSingle();

  if (lookupError) {
    console.error("[hotmart-webhook] error consultando cuentas existentes", lookupError);
    res.status(500).json({ error: "Error interno" });
    return;
  }

  if (info.isRefundOrChargeback) {
    if (!existingAccount) {
      // No había cuenta que marcar (la compra nunca llegó a aprobarse aquí).
      res.status(200).json({ ok: true, skipped: "reembolso_sin_cuenta_asociada" });
      return;
    }
    const { error: unsubscribeError } = await admin
      .from("accounts")
      .update({ plan_unsubscribed: true })
      .eq("id", existingAccount.id);
    if (unsubscribeError) {
      console.error("[hotmart-webhook] error marcando plan_unsubscribed por reembolso/contracargo", unsubscribeError);
      res.status(500).json({ error: "Error interno" });
      return;
    }
    res.status(200).json({ ok: true, accountId: existingAccount.id, planUnsubscribed: true });
    return;
  }

  if (existingAccount) {
    res.status(200).json({ ok: true, skipped: "compra_ya_procesada" });
    return;
  }

  const { data: account, error: accountError } = await admin
    .from("accounts")
    .insert({ hotmart_purchase_id: info.purchaseId })
    .select("id")
    .single();

  if (accountError || !account) {
    console.error("[hotmart-webhook] error creando la cuenta", accountError);
    res.status(500).json({ error: "No se pudo crear la cuenta" });
    return;
  }

  // Aparte del insert principal, y a propósito: si esto falla (por ejemplo,
  // porque la migración del Plan de 14 noches todavía no se aplicó y la
  // columna no existe), la cuenta, la membresía y el enlace de acceso de
  // la compradora NO deben verse afectados. En el peor caso, esa cuenta
  // simplemente no entra al Plan de 14 noches hasta corregirlo a mano.
  const { error: planStartError } = await admin
    .from("accounts")
    .update({ plan_start_at: new Date().toISOString() })
    .eq("id", account.id);

  if (planStartError) {
    console.error("[hotmart-webhook] la cuenta se creó pero no se pudo guardar plan_start_at", planStartError);
  }

  const { error: memberError } = await admin.from("account_members").insert({
    account_id: account.id,
    email: info.email,
    role: "admin",
    invited_by: null,
    status: "activo",
  });

  if (memberError) {
    console.error("[hotmart-webhook] error creando la membresía admin", memberError);
    res.status(500).json({ error: "No se pudo crear el acceso" });
    return;
  }

  const { error: otpError } = await admin.auth.signInWithOtp({
    email: info.email,
    options: { shouldCreateUser: true },
  });

  if (otpError) {
    // La cuenta y el acceso ya quedaron creados; si el correo falla, la
    // compradora puede pedir el enlace de nuevo desde la pantalla de inicio
    // (su correo ya será reconocido como activo).
    console.error("[hotmart-webhook] la cuenta se creó pero el envío del enlace falló", otpError);
  }

  res.status(200).json({ ok: true, accountId: account.id });
}
