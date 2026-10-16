// Prueba manual (sin red, sin Supabase) de la lógica de "a quién le toca
// qué noche" del Plan de 14 noches. Correr con:
//   node --experimental-strip-types scripts/test-plan-schedule.mjs

import { decidePlanSends, bogotaDateString, TOTAL_NIGHTS } from "../api/_lib/plan-schedule.ts";

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`OK   ${label}`);
  } else {
    console.log(`FAIL ${label}`);
    failures += 1;
  }
}

check("el plan dura 14 noches", TOTAL_NIGHTS === 14);

const TODAY = "2026-03-10";
const YESTERDAY = "2026-03-09";

// --- Cuenta nueva: nunca se le ha mandado nada → le toca la noche 1 ---
{
  const accounts = [{ accountId: "a1", email: "mama1@example.com" }];
  const lastSent = new Map([["a1", null]]);
  const decisions = decidePlanSends(accounts, lastSent, TODAY);
  check("cuenta nueva recibe la noche 1", decisions.length === 1 && decisions[0].night === 1);
  check("mantiene el correo correcto", decisions[0].email === "mama1@example.com");
}

// --- Ya recibió la noche 3 ayer → hoy le toca la 4 (no salta, no repite) ---
{
  const accounts = [{ accountId: "a2", email: "mama2@example.com" }];
  const lastSent = new Map([["a2", { night: 3, sentDateBogota: YESTERDAY }]]);
  const decisions = decidePlanSends(accounts, lastSent, TODAY);
  check("avanza a la siguiente noche sin saltar", decisions.length === 1 && decisions[0].night === 4);
}

// --- Se perdió varios días (el cron no corrió) → igual le toca SOLO la siguiente, no varias de golpe ---
{
  const accounts = [{ accountId: "a3", email: "mama3@example.com" }];
  const lastSent = new Map([["a3", { night: 5, sentDateBogota: "2026-02-20" }]]); // hace semanas
  const decisions = decidePlanSends(accounts, lastSent, TODAY);
  check("después de días perdidos, manda solo la siguiente noche (la 6), nunca varias", decisions.length === 1 && decisions[0].night === 6);
}

// --- Ya se le mandó algo HOY → nunca un segundo correo el mismo día ---
{
  const accounts = [{ accountId: "a4", email: "mama4@example.com" }];
  const lastSent = new Map([["a4", { night: 2, sentDateBogota: TODAY }]]);
  const decisions = decidePlanSends(accounts, lastSent, TODAY);
  check("no manda dos correos el mismo día aunque el cron se reintente", decisions.length === 0);
}

// --- Ya completó las 14 noches → el plan se detiene solo ---
{
  const accounts = [{ accountId: "a5", email: "mama5@example.com" }];
  const lastSent = new Map([["a5", { night: 14, sentDateBogota: YESTERDAY }]]);
  const decisions = decidePlanSends(accounts, lastSent, TODAY);
  check("se detiene después de la noche 14, no manda una 15", decisions.length === 0);
}

// --- Varias cuentas a la vez, cada una en su propio punto del plan ---
{
  const accounts = [
    { accountId: "a1", email: "uno@example.com" },
    { accountId: "a2", email: "dos@example.com" },
    { accountId: "a3", email: "tres@example.com" },
  ];
  const lastSent = new Map([
    ["a1", null],
    ["a2", { night: 7, sentDateBogota: YESTERDAY }],
    ["a3", { night: 14, sentDateBogota: YESTERDAY }],
  ]);
  const decisions = decidePlanSends(accounts, lastSent, TODAY);
  check("procesa varias cuentas de forma independiente", decisions.length === 2);
  check("a1 recibe la noche 1", decisions.find((d) => d.accountId === "a1")?.night === 1);
  check("a2 recibe la noche 8", decisions.find((d) => d.accountId === "a2")?.night === 8);
  check("a3 (ya completó el plan) no aparece", decisions.find((d) => d.accountId === "a3") === undefined);
}

// --- bogotaDateString: formato estable YYYY-MM-DD ---
check(
  "bogotaDateString da formato YYYY-MM-DD",
  /^\d{4}-\d{2}-\d{2}$/.test(bogotaDateString(new Date("2026-01-15T22:05:00Z")))
);

console.log(`\n${failures === 0 ? "Todas las pruebas pasaron." : `${failures} prueba(s) fallaron.`}`);
process.exit(failures === 0 ? 0 : 1);
