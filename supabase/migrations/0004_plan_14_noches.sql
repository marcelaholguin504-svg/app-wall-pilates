-- Duerme Ya — Plan de 14 noches: un correo automático por noche tras la
-- compra, hasta 14, y se detiene sola.
--
-- Cómo aplicar: Supabase → tu proyecto → SQL Editor → pega este archivo
-- completo → Run. Es la MISMA base de datos que usa producción (no hay un
-- proyecto de Supabase separado para pruebas). Idempotente: puede
-- ejecutarse más de una vez sin romper nada existente.
--
-- Qué hace exactamente, para que quede claro antes de correrlo:
--   - Agrega dos columnas nuevas a accounts (plan_start_at, plan_unsubscribed).
--     Todas las cuentas existentes quedan con plan_start_at = NULL (el cron
--     las ignora: a las clientas que ya compraron antes de este cambio no
--     les llega nada automáticamente).
--   - Crea una tabla nueva, plan_email_log.
--   - NO borra ni modifica ninguna fila existente de accounts,
--     account_members, child_profiles, sleep_events ni quiz_funnel_events.
--   - NO cambia ninguna política de RLS ni función existente.

alter table public.accounts
  add column if not exists plan_start_at timestamptz,
  add column if not exists plan_unsubscribed boolean not null default false;

create table if not exists public.plan_email_log (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  night smallint not null check (night between 1 and 14),
  sent_at timestamptz not null default now(),
  resend_message_id text
);

create unique index if not exists plan_email_log_account_night_key
  on public.plan_email_log (account_id, night);

-- RLS activada por seguridad, sin políticas para anon/authenticated — igual
-- que accounts hoy: solo la service_role (cron y webhooks) la toca.
alter table public.plan_email_log enable row level security;
