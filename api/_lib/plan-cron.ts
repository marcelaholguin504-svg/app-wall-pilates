// Duerme Ya — orquestación del cron diario del Plan de 14 noches, separada
// del handler HTTP para poder probarla con un cliente de Supabase y un
// fetch falsos (ver scripts/test-plan-cron-handler.mjs), igual que ya se
// hace con api/_lib/resend.ts.

import { planEmailForNight } from "./plan-emails.js";
import { buildPlanEmailHtml, buildPlanEmailPlainText } from "./plan-template.js";
import { signUnsubscribeToken } from "./plan-unsubscribe-token.js";
import { bogotaDateString, decidePlanSends, type AccountForPlan, type LastSent } from "./plan-schedule.js";

// Firma mínima del cliente de Supabase que esta función necesita — deja
// usar tanto el SupabaseClient real como un objeto falso en las pruebas.
export interface SupabaseLike {
  from(table: string): {
    select(columns: string): any;
    insert(row: Record<string, unknown>): PromiseLike<{ error: unknown }>;
  };
}

export interface PlanCronDeps {
  admin: SupabaseLike;
  now: Date;
  dryRun: boolean;
  fetchImpl: typeof fetch;
  resendApiKey: string | undefined;
  unsubscribeSecret: string | undefined;
  baseUrl: string;
}

export interface PlanCronResultItem {
  accountId: string;
  email: string;
  night: number;
  status: "enviado" | "simulado_dry_run" | "fallo_envio" | "fallo_configuracion";
}

export interface PlanCronResult {
  eligibleAccounts: number;
  items: PlanCronResultItem[];
}

interface AccountMemberRow {
  email: string;
  role: string;
  status: string;
}

interface AccountRow {
  id: string;
  account_members: AccountMemberRow[] | null;
}

interface PlanEmailLogRow {
  account_id: string;
  night: number;
  sent_at: string;
}

function activeAdminEmail(members: AccountMemberRow[] | null): string | null {
  const admin = (members ?? []).find((m) => m.role === "admin" && m.status === "activo");
  return admin ? admin.email : null;
}

export async function runPlanCron(deps: PlanCronDeps): Promise<PlanCronResult> {
  const { admin, now, dryRun, fetchImpl, resendApiKey, unsubscribeSecret, baseUrl } = deps;

  const { data: accountRows, error: accountsError } = await admin
    .from("accounts")
    .select("id, account_members(email, role, status)")
    .eq("plan_unsubscribed", false)
    .not("plan_start_at", "is", null);

  if (accountsError) {
    throw new Error(`[plan-cron] error consultando cuentas elegibles: ${JSON.stringify(accountsError)}`);
  }

  const eligible: AccountForPlan[] = [];
  for (const row of (accountRows ?? []) as AccountRow[]) {
    const email = activeAdminEmail(row.account_members);
    if (email) eligible.push({ accountId: row.id, email });
  }

  if (eligible.length === 0) {
    return { eligibleAccounts: 0, items: [] };
  }

  const accountIds = eligible.map((a) => a.accountId);
  const { data: logRows, error: logsError } = await admin
    .from("plan_email_log")
    .select("account_id, night, sent_at")
    .in("account_id", accountIds)
    .order("night", { ascending: false });

  if (logsError) {
    throw new Error(`[plan-cron] error consultando plan_email_log: ${JSON.stringify(logsError)}`);
  }

  const lastSentByAccount = new Map<string, LastSent | null>();
  for (const row of (logRows ?? []) as PlanEmailLogRow[]) {
    if (lastSentByAccount.has(row.account_id)) continue; // ya tenemos la noche más alta (viene ordenado desc).
    lastSentByAccount.set(row.account_id, { night: row.night, sentDateBogota: bogotaDateString(new Date(row.sent_at)) });
  }

  const todayBogota = bogotaDateString(now);
  const decisions = decidePlanSends(eligible, lastSentByAccount, todayBogota);

  const items: PlanCronResultItem[] = [];

  for (const decision of decisions) {
    if (dryRun) {
      items.push({ ...decision, status: "simulado_dry_run" });
      continue;
    }

    const email = planEmailForNight(decision.night);
    if (!email || !resendApiKey || !unsubscribeSecret) {
      console.error("[plan-cron] configuración incompleta o noche sin contenido", decision.night);
      items.push({ ...decision, status: "fallo_configuracion" });
      continue;
    }

    const token = signUnsubscribeToken(decision.accountId, unsubscribeSecret);
    const unsubscribeUrl = `${baseUrl}/api/plan-unsubscribe?token=${encodeURIComponent(token)}`;
    const html = buildPlanEmailHtml(email.subject, email.body, unsubscribeUrl);
    const text = buildPlanEmailPlainText(email.subject, email.body, unsubscribeUrl);

    let resendMessageId: string | null = null;
    let sendOk = false;
    try {
      const response = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Duerme Ya <hola@duerme-ya.com>",
          to: decision.email,
          subject: email.subject,
          html,
          text,
        }),
      });
      if (response.ok) {
        sendOk = true;
        try {
          const json = (await response.json()) as { id?: string };
          resendMessageId = json?.id ?? null;
        } catch {
          resendMessageId = null;
        }
      } else {
        console.error("[plan-cron] Resend respondió con error", response.status, await response.text());
      }
    } catch (err) {
      console.error("[plan-cron] error de red enviando el correo del plan", err);
    }

    if (!sendOk) {
      // No se registra: así el próximo día el cron vuelve a intentar esta
      // misma noche, en vez de saltarla.
      items.push({ ...decision, status: "fallo_envio" });
      continue;
    }

    const { error: insertError } = await admin.from("plan_email_log").insert({
      account_id: decision.accountId,
      night: decision.night,
      resend_message_id: resendMessageId,
    });

    if (insertError) {
      console.error("[plan-cron] el correo se envió pero no se pudo registrar en plan_email_log", insertError);
    }

    items.push({ ...decision, status: "enviado" });
  }

  return { eligibleAccounts: eligible.length, items };
}
