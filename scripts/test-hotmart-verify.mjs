// Prueba manual (sin red, sin Supabase, sin Hotmart real) de la lógica de
// verificación del webhook. Correr con:
//   node --experimental-strip-types scripts/test-hotmart-verify.mjs
//
// Esto NO reemplaza probar con una notificación de prueba real desde el
// panel de Hotmart — solo confirma que el código de verificación hace lo
// que promete: nunca deja pasar una firma incorrecta o ausente.

import { verifyHotmartRequest, extractPurchaseInfo } from "../api/_lib/hotmart.ts";

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`OK   ${label}`);
  } else {
    console.log(`FAIL ${label}`);
    failures += 1;
  }
}

const HOTTOK = "mi-token-secreto-de-prueba";

// --- Verificación de firma ---
check(
  "acepta header x-hotmart-hottok correcto",
  verifyHotmartRequest({ "x-hotmart-hottok": HOTTOK }, {}, HOTTOK) === true
);

check(
  "acepta hottok correcto dentro del body (formato antiguo)",
  verifyHotmartRequest({}, { hottok: HOTTOK }, HOTTOK) === true
);

check(
  "rechaza header con token incorrecto",
  verifyHotmartRequest({ "x-hotmart-hottok": "token-falso" }, {}, HOTTOK) === false
);

check(
  "rechaza cuando no hay header ni body con token",
  verifyHotmartRequest({}, {}, HOTTOK) === false
);

check(
  "rechaza SIEMPRE si no hay HOTMART_HOTTOK configurado, aunque el request 'parezca' válido",
  verifyHotmartRequest({ "x-hotmart-hottok": "cualquier-cosa" }, {}, undefined) === false
);

check(
  "no se deja engañar por un token más largo que empieza igual",
  verifyHotmartRequest({ "x-hotmart-hottok": HOTTOK + "extra" }, {}, HOTTOK) === false
);

// --- Extracción de datos de la compra ---
const approvedPayloadV2 = {
  event: "PURCHASE_APPROVED",
  data: {
    purchase: { transaction: "HP12345678", status: "APPROVED" },
    buyer: { email: "Compradora@Ejemplo.com" },
  },
};

const infoV2 = extractPurchaseInfo(approvedPayloadV2);
check("extrae email en minúsculas del formato v2", infoV2?.email === "compradora@ejemplo.com");
check("extrae el id de transacción del formato v2", infoV2?.purchaseId === "HP12345678");
check("marca isApproved=true para PURCHASE_APPROVED", infoV2?.isApproved === true);

const canceledPayload = {
  event: "PURCHASE_CANCELED",
  data: {
    purchase: { transaction: "HP999", status: "CANCELED" },
    buyer: { email: "alguien@ejemplo.com" },
  },
};
check("no marca como aprobada una compra cancelada", extractPurchaseInfo(canceledPayload)?.isApproved === false);

check("devuelve null si falta el email", extractPurchaseInfo({ data: { purchase: { transaction: "X" } } }) === null);
check("devuelve null con payload vacío", extractPurchaseInfo({}) === null);
check("devuelve null con payload no-objeto", extractPurchaseInfo("no soy un objeto") === null);

check("una compra aprobada no se marca como reembolso/contracargo", infoV2?.isRefundOrChargeback === false);
check(
  "una compra cancelada (no reembolso) tampoco se marca como reembolso/contracargo",
  extractPurchaseInfo(canceledPayload)?.isRefundOrChargeback === false
);

// --- Reembolsos y contracargos ---
const refundPayload = {
  event: "PURCHASE_REFUNDED",
  data: { purchase: { transaction: "HP12345678", status: "REFUNDED" }, buyer: { email: "compradora@ejemplo.com" } },
};
const refundInfo = extractPurchaseInfo(refundPayload);
check("marca isRefundOrChargeback=true para PURCHASE_REFUNDED", refundInfo?.isRefundOrChargeback === true);
check("un reembolso no se marca como aprobado", refundInfo?.isApproved === false);
check("un reembolso conserva el mismo id de compra", refundInfo?.purchaseId === "HP12345678");

const chargebackPayload = {
  data: { purchase: { transaction: "HP999999", status: "CHARGEBACK" }, buyer: { email: "alguien@ejemplo.com" } },
};
check(
  "marca isRefundOrChargeback=true para status CHARGEBACK (sin campo event)",
  extractPurchaseInfo(chargebackPayload)?.isRefundOrChargeback === true
);

console.log("\n" + (failures === 0 ? `Todo bien: 0 fallos.` : `${failures} prueba(s) fallaron.`));
process.exit(failures === 0 ? 0 : 1);
