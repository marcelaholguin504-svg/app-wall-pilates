// Duerme Ya — token firmado para el enlace "Ya no quiero recibir estos
// correos" de los correos del Plan de 14 noches. Lleva el account_id (no
// el correo) para no exponerlo en la URL, firmado con HMAC-SHA256 usando
// PLAN_UNSUBSCRIBE_SECRET para que nadie pueda fabricar un token para una
// cuenta ajena ni editar el que ya recibió.

import { createHmac, timingSafeEqual } from "node:crypto";

function base64url(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function signAccountId(accountId: string, secret: string): string {
  return base64url(createHmac("sha256", secret).update(accountId).digest());
}

export function signUnsubscribeToken(accountId: string, secret: string): string {
  const payload = base64url(Buffer.from(accountId, "utf8"));
  const signature = signAccountId(accountId, secret);
  return `${payload}.${signature}`;
}

/** Devuelve el account_id si el token es válido, o null si no lo es. */
export function verifyUnsubscribeToken(token: string, secret: string | undefined): string | null {
  if (!secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  let accountId: string;
  try {
    accountId = Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  } catch {
    return null;
  }
  if (!accountId) return null;

  const expected = signAccountId(accountId, secret);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null;

  return accountId;
}
