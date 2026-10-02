// Lógica pura de verificación de webhooks de Resend (firma estilo Svix) y
// de interpretación de sus eventos, separada del handler HTTP para poder
// probarla sin necesitar el runtime de Vercel ni un webhook real de Resend
// — ver scripts/test-resend-verify.mjs.
//
// Formato de firma: Resend usa el mismo esquema que Svix. La firma se
// calcula con HMAC-SHA256 sobre "{svix-id}.{svix-timestamp}.{cuerpo crudo}",
// usando la porción base64 del secreto (después de quitar el prefijo
// "whsec_"). El header svix-signature puede traer varias firmas separadas
// por espacio (rotación de secretos); basta con que una coincida.

import { createHmac, timingSafeEqual } from "node:crypto";

export interface WebhookHeaders {
  [key: string]: string | string[] | undefined;
}

function headerValue(headers: WebhookHeaders, name: string): string | null {
  const raw = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] : raw;
}

function safeEqualBase64(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "base64");
    const bufB = Buffer.from(b, "base64");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Tolerancia contra ataques de repetición, como recomienda Svix.
const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;

/**
 * Verifica que el webhook realmente venga de Resend, usando el cuerpo
 * CRUDO (sin parsear) de la solicitud — la firma se calcula sobre los
 * bytes exactos que Resend envió, nunca sobre el body ya convertido a
 * objeto. Nunca hace nada por su cuenta: solo responde true/false.
 */
export function verifyResendSignature(headers: WebhookHeaders, rawBody: string, secret: string | undefined): boolean {
  if (!secret) return false;

  const svixId = headerValue(headers, "svix-id");
  const svixTimestamp = headerValue(headers, "svix-timestamp");
  const svixSignature = headerValue(headers, "svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const timestampMs = Number(svixTimestamp) * 1000;
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > TIMESTAMP_TOLERANCE_MS) return false;

  const secretBase64 = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  let secretBytes: Buffer;
  try {
    secretBytes = Buffer.from(secretBase64, "base64");
  } catch {
    return false;
  }

  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expectedSignature = createHmac("sha256", secretBytes).update(signedContent).digest("base64");

  // Cada firma del header viene como "v1,<firma base64>".
  return svixSignature.split(" ").some((part) => {
    const commaIndex = part.indexOf(",");
    if (commaIndex === -1) return false;
    const sig = part.slice(commaIndex + 1);
    return safeEqualBase64(sig, expectedSignature);
  });
}

export const ALERT_EVENT_TYPES = ["email.bounced", "email.delivery_delayed", "email.complained"] as const;
export type AlertEventType = (typeof ALERT_EVENT_TYPES)[number];

export interface AlertInfo {
  type: AlertEventType;
  recipientEmail: string;
}

/**
 * Interpreta el payload ya parseado (solo se llama DESPUÉS de verificar la
 * firma) y decide si amerita una alerta. Devuelve null si el evento no es
 * de los que nos interesan, o si no se pudo identificar con confianza el
 * correo de la destinataria.
 */
export function extractAlertInfo(payload: unknown): AlertInfo | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  const type = typeof p.type === "string" ? p.type : undefined;
  if (!type || !(ALERT_EVENT_TYPES as readonly string[]).includes(type)) return null;

  const data = (p.data && typeof p.data === "object" ? p.data : {}) as Record<string, unknown>;
  const to = data.to;
  const recipientEmail = Array.isArray(to) ? String(to[0] || "") : typeof to === "string" ? to : "";
  if (!recipientEmail) return null;

  return { type: type as AlertEventType, recipientEmail: recipientEmail.toLowerCase().trim() };
}

const EVENT_LABELS_ES: Record<AlertEventType, string> = {
  "email.bounced": "El correo rebotó (la dirección no existe o lo rechazó el servidor de destino).",
  "email.delivery_delayed": "El envío se está retrasando — el servidor de destino todavía no lo ha aceptado.",
  "email.complained": "La persona marcó el correo como spam.",
};

export function alertLabelFor(type: AlertEventType): string {
  return EVENT_LABELS_ES[type];
}

function formatMexicoCityTime(date: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function buildAlertEmail(info: AlertInfo, when: Date): { subject: string; text: string } {
  const subject = "⚠️ Un correo de acceso no llegó";
  const text = [
    `Correo de la compradora: ${info.recipientEmail}`,
    `Problema: ${alertLabelFor(info.type)}`,
    `Hora: ${formatMexicoCityTime(when)} (Ciudad de México)`,
  ].join("\n");
  return { subject, text };
}
