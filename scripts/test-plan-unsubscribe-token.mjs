// Prueba manual (sin red) del token firmado de baja del Plan de 14 noches.
// Correr con:
//   node --experimental-strip-types scripts/test-plan-unsubscribe-token.mjs

import { signUnsubscribeToken, verifyUnsubscribeToken } from "../api/_lib/plan-unsubscribe-token.ts";

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`OK   ${label}`);
  } else {
    console.log(`FAIL ${label}`);
    failures += 1;
  }
}

const SECRET = "un-secreto-de-prueba-bastante-largo";
const ACCOUNT_ID = "11111111-1111-1111-1111-111111111111";

const token = signUnsubscribeToken(ACCOUNT_ID, SECRET);

check("el token no contiene el correo (no aplica aquí, pero tampoco debe traer @)", !token.includes("@"));
check("verifica correctamente un token recién firmado", verifyUnsubscribeToken(token, SECRET) === ACCOUNT_ID);

check("rechaza un token con la firma alterada", verifyUnsubscribeToken(token.slice(0, -2) + "zz", SECRET) === null);

const [payload] = token.split(".");
check(
  "rechaza si el account_id del payload fue cambiado por otro (firma ya no coincide)",
  verifyUnsubscribeToken(`${payload}x.firma-cualquiera`, SECRET) === null
);

check("rechaza si el secreto no coincide", verifyUnsubscribeToken(token, "otro-secreto-cualquiera") === null);
check("rechaza si no hay secreto configurado", verifyUnsubscribeToken(token, undefined) === null);
check("rechaza un token sin el separador '.'", verifyUnsubscribeToken("tokensinformatovalido", SECRET) === null);
check("rechaza una cadena vacía", verifyUnsubscribeToken("", SECRET) === null);

const otherAccountToken = signUnsubscribeToken("22222222-2222-2222-2222-222222222222", SECRET);
check("dos cuentas distintas producen tokens distintos", otherAccountToken !== token);
check(
  "el token de una cuenta no sirve para dar de baja a otra",
  verifyUnsubscribeToken(otherAccountToken, SECRET) === "22222222-2222-2222-2222-222222222222" &&
    verifyUnsubscribeToken(otherAccountToken, SECRET) !== ACCOUNT_ID
);

console.log(`\n${failures === 0 ? "Todas las pruebas pasaron." : `${failures} prueba(s) fallaron.`}`);
process.exit(failures === 0 ? 0 : 1);
