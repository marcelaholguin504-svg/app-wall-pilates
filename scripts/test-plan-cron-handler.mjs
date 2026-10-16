// Prueba de integración de runPlanCron (sin Supabase ni Resend reales: se
// reemplazan por objetos falsos que registran las llamadas). Correr con:
//   node --experimental-strip-types scripts/test-plan-cron-handler.mjs

import { runPlanCron } from "../api/_lib/plan-cron.ts";

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`OK   ${label}`);
  } else {
    console.log(`FAIL ${label}`);
    failures += 1;
  }
}

function makeSelectBuilder(result) {
  const builder = {
    eq() {
      return builder;
    },
    not() {
      return builder;
    },
    in() {
      return builder;
    },
    order() {
      return builder;
    },
    then(resolve, reject) {
      return Promise.resolve(result).then(resolve, reject);
    },
  };
  return builder;
}

function makeFakeAdmin({ accountsResult, logsResult, insertResult, onInsert }) {
  const insertCalls = [];
  const admin = {
    from(table) {
      if (table === "accounts") {
        return { select: () => makeSelectBuilder(accountsResult) };
      }
      if (table === "plan_email_log") {
        return {
          select: () => makeSelectBuilder(logsResult),
          insert: (row) => {
            insertCalls.push(row);
            if (onInsert) onInsert(row);
            return Promise.resolve(insertResult ?? { error: null });
          },
        };
      }
      throw new Error(`tabla inesperada en la prueba: ${table}`);
    },
  };
  return { admin, insertCalls };
}

const NOW = new Date("2026-03-10T23:00:00Z"); // 18:00 en Bogotá

// --- Caso 1: cuenta nueva (sin historial) + DRY_RUN → no manda nada, no registra ---
{
  const accountsResult = {
    data: [
      { id: "acc-1", account_members: [{ email: "mama1@example.com", role: "admin", status: "activo" }] },
    ],
    error: null,
  };
  const logsResult = { data: [], error: null };
  const { admin, insertCalls } = makeFakeAdmin({ accountsResult, logsResult });
  const fetchCalls = [];
  const fetchImpl = async () => {
    fetchCalls.push(1);
    return { ok: true, json: async () => ({ id: "re_1" }) };
  };

  const result = await runPlanCron({
    admin,
    now: NOW,
    dryRun: true,
    fetchImpl,
    resendApiKey: "re_test",
    unsubscribeSecret: "secreto",
    baseUrl: "https://app-duerme-ya.vercel.app",
  });

  check("Caso 1: detecta la cuenta elegible", result.eligibleAccounts === 1);
  check("Caso 1: decide la noche 1 para la cuenta nueva", result.items.length === 1 && result.items[0].night === 1);
  check("Caso 1: en DRY_RUN queda marcado como simulado_dry_run", result.items[0].status === "simulado_dry_run");
  check("Caso 1: DRY_RUN nunca llama a Resend", fetchCalls.length === 0);
  check("Caso 1: DRY_RUN nunca escribe en plan_email_log", insertCalls.length === 0);
}

// --- Caso 2: envío real exitoso → manda por Resend y registra en plan_email_log ---
{
  const accountsResult = {
    data: [{ id: "acc-2", account_members: [{ email: "mama2@example.com", role: "admin", status: "activo" }] }],
    error: null,
  };
  const logsResult = {
    data: [{ account_id: "acc-2", night: 3, sent_at: "2026-03-09T23:00:00Z" }],
    error: null,
  };
  const { admin, insertCalls } = makeFakeAdmin({ accountsResult, logsResult });
  const fetchCalls = [];
  const fetchImpl = async (url, opts) => {
    fetchCalls.push({ url, opts });
    return { ok: true, json: async () => ({ id: "re_abc" }) };
  };

  const result = await runPlanCron({
    admin,
    now: NOW,
    dryRun: false,
    fetchImpl,
    resendApiKey: "re_test",
    unsubscribeSecret: "secreto",
    baseUrl: "https://app-duerme-ya.vercel.app",
  });

  check("Caso 2: avanza a la noche 4 (venía de la 3)", result.items.length === 1 && result.items[0].night === 4);
  check("Caso 2: queda como enviado", result.items[0].status === "enviado");
  check("Caso 2: sí llamó a Resend exactamente una vez", fetchCalls.length === 1);
  const body = JSON.parse(fetchCalls[0].opts.body);
  check("Caso 2: manda al correo de la cuenta, no a otro", body.to === "mama2@example.com");
  check("Caso 2: el remitente es el fijo del plan", body.from === "Duerme Ya <hola@duerme-ya.com>");
  check("Caso 2: el HTML trae el enlace de baja firmado para esa cuenta", body.html.includes("/api/plan-unsubscribe?token="));
  check("Caso 2: registra el envío en plan_email_log", insertCalls.length === 1 && insertCalls[0].night === 4 && insertCalls[0].account_id === "acc-2");
  check("Caso 2: guarda el id de mensaje de Resend", insertCalls[0].resend_message_id === "re_abc");
}

// --- Caso 3: Resend falla al enviar → NO se registra (para reintentar al día siguiente) ---
{
  const accountsResult = {
    data: [{ id: "acc-3", account_members: [{ email: "mama3@example.com", role: "admin", status: "activo" }] }],
    error: null,
  };
  const logsResult = { data: [], error: null };
  const { admin, insertCalls } = makeFakeAdmin({ accountsResult, logsResult });
  const fetchImpl = async () => ({ ok: false, status: 500, text: async () => "error de resend" });

  const result = await runPlanCron({
    admin,
    now: NOW,
    dryRun: false,
    fetchImpl,
    resendApiKey: "re_test",
    unsubscribeSecret: "secreto",
    baseUrl: "https://app-duerme-ya.vercel.app",
  });

  check("Caso 3: queda como fallo_envio", result.items[0].status === "fallo_envio");
  check("Caso 3: NUNCA registra un envío que falló (se reintenta mañana)", insertCalls.length === 0);
}

// --- Caso 4: a esa cuenta ya se le mandó algo HOY → no hace nada, ni consulta Resend ---
{
  const accountsResult = {
    data: [{ id: "acc-4", account_members: [{ email: "mama4@example.com", role: "admin", status: "activo" }] }],
    error: null,
  };
  const logsResult = { data: [{ account_id: "acc-4", night: 2, sent_at: "2026-03-10T20:00:00Z" }], error: null };
  const { admin, insertCalls } = makeFakeAdmin({ accountsResult, logsResult });
  const fetchCalls = [];
  const fetchImpl = async () => {
    fetchCalls.push(1);
    return { ok: true, json: async () => ({}) };
  };

  const result = await runPlanCron({
    admin,
    now: NOW,
    dryRun: false,
    fetchImpl,
    resendApiKey: "re_test",
    unsubscribeSecret: "secreto",
    baseUrl: "https://app-duerme-ya.vercel.app",
  });

  check("Caso 4: no decide ningún envío (ya recibió uno hoy)", result.items.length === 0);
  check("Caso 4: no llama a Resend", fetchCalls.length === 0);
  check("Caso 4: no escribe en plan_email_log", insertCalls.length === 0);
}

// --- Caso 5: sin cuentas elegibles (ninguna con plan_start_at, o todas dadas de baja) ---
{
  const { admin } = makeFakeAdmin({ accountsResult: { data: [], error: null }, logsResult: { data: [], error: null } });
  const result = await runPlanCron({
    admin,
    now: NOW,
    dryRun: false,
    fetchImpl: async () => ({ ok: true, json: async () => ({}) }),
    resendApiKey: "re_test",
    unsubscribeSecret: "secreto",
    baseUrl: "https://app-duerme-ya.vercel.app",
  });
  check("Caso 5: sin cuentas elegibles, no hace ninguna consulta extra ni falla", result.eligibleAccounts === 0 && result.items.length === 0);
}

// --- Caso 6: faltan variables de entorno (RESEND_API_KEY/secreto) → no intenta mandar nada ---
{
  const accountsResult = {
    data: [{ id: "acc-6", account_members: [{ email: "mama6@example.com", role: "admin", status: "activo" }] }],
    error: null,
  };
  const { admin, insertCalls } = makeFakeAdmin({ accountsResult, logsResult: { data: [], error: null } });
  const fetchCalls = [];
  const fetchImpl = async () => {
    fetchCalls.push(1);
    return { ok: true, json: async () => ({}) };
  };

  const result = await runPlanCron({
    admin,
    now: NOW,
    dryRun: false,
    fetchImpl,
    resendApiKey: undefined,
    unsubscribeSecret: undefined,
    baseUrl: "https://app-duerme-ya.vercel.app",
  });

  check("Caso 6: queda como fallo_configuracion", result.items[0]?.status === "fallo_configuracion");
  check("Caso 6: nunca llama a Resend sin las variables configuradas", fetchCalls.length === 0);
  check("Caso 6: no escribe en plan_email_log", insertCalls.length === 0);
}

console.log(`\n${failures === 0 ? "Todas las pruebas pasaron." : `${failures} prueba(s) fallaron.`}`);
process.exit(failures === 0 ? 0 : 1);
