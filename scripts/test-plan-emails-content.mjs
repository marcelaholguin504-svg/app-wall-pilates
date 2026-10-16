// Prueba manual (sin red) del contenido de los 14 correos y de su
// conversión a HTML/texto plano. Correr con:
//   node --experimental-strip-types scripts/test-plan-emails-content.mjs
//
// Esto NO verifica que el texto sea idéntico palabra por palabra al
// documento original (eso requiere lectura humana) — confirma que están
// las 14 noches, en orden, con el cierre de seguridad, y que la plantilla
// no rompe nada al convertirlas.

import { PLAN_EMAILS, planEmailForNight } from "../api/_lib/plan-emails.ts";
import { buildPlanEmailHtml, buildPlanEmailPlainText, bodyToHtml } from "../api/_lib/plan-template.ts";

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`OK   ${label}`);
  } else {
    console.log(`FAIL ${label}`);
    failures += 1;
  }
}

check("hay exactamente 14 correos", PLAN_EMAILS.length === 14);
check(
  "están numerados del 1 al 14, en orden, sin huecos ni repetidos",
  PLAN_EMAILS.every((e, i) => e.night === i + 1)
);

for (const email of PLAN_EMAILS) {
  check(`noche ${email.night}: el asunto menciona "Noche ${email.night}"`, email.subject.includes(`Noche ${email.night}`));
  check(`noche ${email.night}: el saludo es el esperado`, email.body.includes("Hola, mamá 💛"));
  check(
    `noche ${email.night}: trae el cierre de seguridad exacto`,
    email.body.includes("Si ves fiebre, dificultad para respirar o algo que te preocupe, llama a tu pediatra.")
  );
}

check("planEmailForNight(1) devuelve la noche 1", planEmailForNight(1)?.night === 1);
check("planEmailForNight(14) devuelve la noche 14", planEmailForNight(14)?.night === 14);
check("planEmailForNight(0) devuelve null (no existe noche 0)", planEmailForNight(0) === null);
check("planEmailForNight(15) devuelve null (el plan termina en 14)", planEmailForNight(15) === null);

// --- Conversión a HTML/texto plano no debe romperse con ningún correo ---
const UNSUB_URL = "https://app-duerme-ya.vercel.app/api/plan-unsubscribe?token=abc.def";
for (const email of PLAN_EMAILS) {
  const html = buildPlanEmailHtml(email.subject, email.body, UNSUB_URL);
  const text = buildPlanEmailPlainText(email.subject, email.body, UNSUB_URL);
  check(`noche ${email.night}: el HTML incluye el enlace de baja`, html.includes(UNSUB_URL));
  check(`noche ${email.night}: el texto plano incluye el enlace de baja`, text.includes(UNSUB_URL));
  check(`noche ${email.night}: el HTML no deja asteriscos de markdown sin convertir`, !html.includes("**"));
}

// --- La negrita y las listas se convierten correctamente (noche 5 tiene ambas) ---
const night5Html = bodyToHtml(planEmailForNight(5).body);
check("noche 5: convierte la lista de la cuna segura a <ul><li>", night5Html.includes("<ul") && night5Html.includes("<li>"));
check("noche 5: convierte **negrita** a <strong>", night5Html.includes("<strong>siempre boca arriba</strong>"));

console.log(`\n${failures === 0 ? "Todas las pruebas pasaron." : `${failures} prueba(s) fallaron.`}`);
process.exit(failures === 0 ? 0 : 1);
