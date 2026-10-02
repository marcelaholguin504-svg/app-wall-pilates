// Prueba manual (sin red, sin Resend real) de la lógica de verificación y
// de interpretación de eventos del webhook. Correr con:
//   node --experimental-strip-types scripts/test-resend-verify.mjs
//
// Esto NO reemplaza mandar un evento de prueba real desde el panel de
// Resend — solo confirma que el código de verificación hace lo que
// promete: nunca deja pasar una firma incorrecta, ausente, o vieja.

import { createHmac } from "node:crypto";
import {
  verifyResendSignature,
  extractAlertInfo,
  alertLabelFor,
  buildAlertEmail,
} from "../api/_lib/resend.ts";

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`OK   ${label}`);
  } else {
    console.log(`FAIL ${label}`);
    failures += 1;
  }
}

// Secreto de prueba con el mismo formato que usa Resend/Svix: "whsec_" +
// base64 de 24 bytes aleatorios (no es un secreto real).
const SECRET = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";

function sign(id, timestamp, body, secret = SECRET) {
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${id}.${timestamp}.${body}`;
  const sig = createHmac("sha256", secretBytes).update(signedContent).digest("base64");
  return `v1,${sig}`;
}

const body = JSON.stringify({ type: "email.bounced", data: { to: ["mama@example.com"] } });
const id = "msg_test_123";
const now = Math.floor(Date.now() / 1000).toString();

// --- Verificación de firma ---
check(
  "acepta una firma correcta y reciente",
  verifyResendSignature({ "svix-id": id, "svix-timestamp": now, "svix-signature": sign(id, now, body) }, body, SECRET) ===
    true
);

check(
  "rechaza si falta el header svix-signature",
  verifyResendSignature({ "svix-id": id, "svix-timestamp": now }, body, SECRET) === false
);

check(
  "rechaza si el secreto no coincide",
  verifyResendSignature(
    { "svix-id": id, "svix-timestamp": now, "svix-signature": sign(id, now, body, "whsec_" + Buffer.from("otro-secreto-cualquiera").toString("base64")) },
    body,
    SECRET
  ) === false
);

check(
  "rechaza si el cuerpo fue alterado después de firmarlo",
  verifyResendSignature(
    { "svix-id": id, "svix-timestamp": now, "svix-signature": sign(id, now, body) },
    body.replace("bounced", "delivered"),
    SECRET
  ) === false
);

const oldTimestamp = (Math.floor(Date.now() / 1000) - 10 * 60).toString(); // 10 minutos atrás
check(
  "rechaza una firma vieja (fuera de la tolerancia de 5 minutos)",
  verifyResendSignature(
    { "svix-id": id, "svix-timestamp": oldTimestamp, "svix-signature": sign(id, oldTimestamp, body) },
    body,
    SECRET
  ) === false
);

check("rechaza si no hay secreto configurado", verifyResendSignature({ "svix-id": id, "svix-timestamp": now }, body, undefined) === false);

check(
  "acepta cuando el header trae varias firmas separadas por espacio (rotación de secretos) y una es correcta",
  verifyResendSignature(
    {
      "svix-id": id,
      "svix-timestamp": now,
      "svix-signature": `v1,firma-vieja-invalida== ${sign(id, now, body)}`,
    },
    body,
    SECRET
  ) === true
);

// --- Interpretación de eventos ---
check(
  "reconoce email.bounced y extrae el correo",
  JSON.stringify(extractAlertInfo({ type: "email.bounced", data: { to: ["mama@example.com"] } })) ===
    JSON.stringify({ type: "email.bounced", recipientEmail: "mama@example.com" })
);

check(
  "reconoce email.delivery_delayed",
  extractAlertInfo({ type: "email.delivery_delayed", data: { to: "mama@example.com" } })?.type === "email.delivery_delayed"
);

check(
  "reconoce email.complained",
  extractAlertInfo({ type: "email.complained", data: { to: "mama@example.com" } })?.type === "email.complained"
);

check("ignora eventos que no son de alerta (ej. email.delivered)", extractAlertInfo({ type: "email.delivered", data: { to: "mama@example.com" } }) === null);

check("ignora un payload sin destinatario", extractAlertInfo({ type: "email.bounced", data: {} }) === null);

check("ignora un payload vacío", extractAlertInfo(null) === null);

// --- Contenido de la alerta: en español, sin tecnicismos ---
const info = extractAlertInfo({ type: "email.bounced", data: { to: ["mama@example.com"] } });
const email = buildAlertEmail(info, new Date("2026-01-15T22:05:00Z"));
check("el asunto es el pedido", email.subject === "⚠️ Un correo de acceso no llegó");
check("el cuerpo incluye el correo de la compradora", email.text.includes("mama@example.com"));
check("el cuerpo explica el problema en español sencillo", email.text.includes(alertLabelFor("email.bounced")));
check("el cuerpo incluye la hora en formato de Ciudad de México", /\d{1,2}:\d{2}/.test(email.text) && email.text.includes("Ciudad de México"));

console.log(`\n${failures === 0 ? "Todas las pruebas pasaron." : `${failures} prueba(s) fallaron.`}`);
process.exit(failures === 0 ? 0 : 1);
