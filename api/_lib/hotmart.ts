// Lógica pura de verificación y parseo de notificaciones de Hotmart,
// separada del handler HTTP para poder probarla sin necesitar el runtime
// de Vercel (ver scripts/test-hotmart-verify.mjs).
//
// IMPORTANTE — sin probar contra Hotmart real: Hotmart ha usado distintos
// formatos de webhook a lo largo del tiempo. Este verificador acepta el
// token HOTTOK tanto en el header `X-HOTMART-HOTTOK` (formato de Webhook
// v2, el recomendado actualmente) como en un campo `hottok` dentro del
// cuerpo JSON (formato de Postback más antiguo), para no fallar si el
// proyecto usa una integración configurada de forma distinta. Verifica el
// comportamiento real enviando una "Notificación de prueba" desde el panel
// de Hotmart (Herramientas → Webhook) y revisando los logs de esta función
// en Vercel.

import { timingSafeEqual } from "node:crypto";

export interface HotmartHeaders {
  [key: string]: string | string[] | undefined;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function headerValue(headers: HotmartHeaders, name: string): string | null {
  const raw = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] : raw;
}

/**
 * Verifica que la notificación realmente venga de Hotmart, comparando el
 * HOTTOK configurado contra el que llega en el header o en el cuerpo.
 * Nunca crea nada por su cuenta — solo responde true/false.
 */
export function verifyHotmartRequest(
  headers: HotmartHeaders,
  body: unknown,
  expectedHottok: string | undefined
): boolean {
  if (!expectedHottok) return false;

  const fromHeader = headerValue(headers, "x-hotmart-hottok");
  if (fromHeader && safeEqual(fromHeader, expectedHottok)) return true;

  const bodyHottok =
    body && typeof body === "object" && "hottok" in (body as Record<string, unknown>)
      ? String((body as Record<string, unknown>).hottok ?? "")
      : null;
  if (bodyHottok && safeEqual(bodyHottok, expectedHottok)) return true;

  return false;
}

export interface PurchaseInfo {
  email: string;
  purchaseId: string;
  isApproved: boolean;
}

/**
 * Extrae correo del comprador, id de la compra, y si el evento es una
 * compra aprobada, probando varias formas de payload conocidas de Hotmart.
 * Devuelve null si no logra identificar los datos mínimos con confianza:
 * en ese caso el webhook NO debe crear nada (fail closed).
 */
export function extractPurchaseInfo(payload: unknown): PurchaseInfo | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  const event = typeof p.event === "string" ? p.event : undefined;
  const data = (p.data && typeof p.data === "object" ? (p.data as Record<string, unknown>) : p) as Record<
    string,
    unknown
  >;
  const purchase = (data.purchase && typeof data.purchase === "object" ? data.purchase : data) as Record<
    string,
    unknown
  >;

  const status =
    typeof purchase.status === "string"
      ? purchase.status
      : typeof (purchase.payment as Record<string, unknown> | undefined)?.status === "string"
        ? ((purchase.payment as Record<string, unknown>).status as string)
        : undefined;

  const isApproved =
    event === "PURCHASE_APPROVED" || event === "PURCHASE_COMPLETE" || status === "APPROVED" || status === "COMPLETE";

  const buyer = (data.buyer && typeof data.buyer === "object" ? data.buyer : purchase.buyer) as
    | Record<string, unknown>
    | undefined;

  const email =
    (typeof buyer?.email === "string" && buyer.email) ||
    (typeof (data.customer as Record<string, unknown> | undefined)?.email === "string" &&
      (data.customer as Record<string, unknown>).email) ||
    null;

  const purchaseId =
    (typeof purchase.transaction === "string" && purchase.transaction) ||
    (typeof purchase.order_ref === "string" && purchase.order_ref) ||
    (typeof p.id === "string" && p.id) ||
    null;

  if (!email || !purchaseId) return null;

  return { email: String(email).toLowerCase().trim(), purchaseId: String(purchaseId), isApproved };
}
