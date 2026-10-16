// Duerme Ya — lógica pura de "a quién le toca qué noche", separada del
// handler del cron para poder probarla sin Supabase ni Resend reales (ver
// scripts/test-plan-schedule.mjs).
//
// Regla: cada cuenta elegible recibe exactamente LA SIGUIENTE noche que le
// falta (nunca salta ninguna, aunque se haya perdido un día de cron), hasta
// la 14. Nunca más de un correo por cuenta el mismo día calendario (zona
// America/Bogota), incluso si el cron se llega a ejecutar dos veces el
// mismo día. La "noche 1" es, a propósito, la primera ejecución del cron
// después de la compra — no se calculan horas exactas desde plan_start_at.

export const TOTAL_NIGHTS = 14;

export interface AccountForPlan {
  accountId: string;
  email: string;
}

export interface LastSent {
  night: number;
  /** Fecha calendario (America/Bogota) del último envío, formato YYYY-MM-DD. */
  sentDateBogota: string;
}

export interface PlanSendDecision {
  accountId: string;
  email: string;
  night: number;
}

export function bogotaDateString(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(date);
}

/**
 * Decide, para cada cuenta elegible, si le corresponde un correo hoy y
 * cuál noche es. `lastSentByAccount` debe traer, para cada cuenta, el
 * último registro de plan_email_log (o null si nunca se le ha enviado
 * nada). Las cuentas ya dadas de baja o sin plan_start_at NO deben venir
 * en `accounts` — ese filtro se hace en la consulta a Supabase, antes de
 * llamar a esta función.
 */
export function decidePlanSends(
  accounts: AccountForPlan[],
  lastSentByAccount: Map<string, LastSent | null>,
  todayBogota: string
): PlanSendDecision[] {
  const decisions: PlanSendDecision[] = [];

  for (const account of accounts) {
    const lastSent = lastSentByAccount.get(account.accountId) ?? null;

    if (lastSent && lastSent.sentDateBogota === todayBogota) {
      // Ya se le mandó algo hoy — nunca dos correos el mismo día.
      continue;
    }

    const nextNight = (lastSent?.night ?? 0) + 1;
    if (nextNight > TOTAL_NIGHTS) {
      // Ya completó las 14 noches — el plan se detiene solo.
      continue;
    }

    decisions.push({ accountId: account.accountId, email: account.email, night: nextNight });
  }

  return decisions;
}
