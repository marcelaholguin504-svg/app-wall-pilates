-- Duerme Ya — eventos de embudo del quiz (/quiz), para medir abandono real
-- por paso independientemente de los umbrales de privacidad de Meta.
--
-- Cómo aplicar: Supabase → tu proyecto → SQL Editor → pega este archivo
-- completo → Run. Idempotente: puede ejecutarse más de una vez.
--
-- Sin datos personales: solo identificadores técnicos de sesión/paso y
-- parámetros UTM de marketing. Nunca nombre, correo, ni respuestas del quiz.

create table if not exists public.quiz_funnel_events (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  step_number smallint not null,
  step_id text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_at timestamptz not null default now()
);

create index if not exists quiz_funnel_events_step_idx on public.quiz_funnel_events (step_number);
create index if not exists quiz_funnel_events_session_idx on public.quiz_funnel_events (session_id);

alter table public.quiz_funnel_events enable row level security;

-- Cualquier visitante anónimo del quiz puede insertar SUS PROPIOS eventos
-- (no hay sesión de usuario en /quiz) — pero nadie puede leer, actualizar ni
-- borrar desde el cliente: solo tú, desde el SQL Editor o con la
-- service_role key. Esto evita que cualquiera pueda leer el tráfico de
-- otras sesiones desde el navegador.
drop policy if exists "quiz_funnel_events_insert_anon" on public.quiz_funnel_events;
create policy "quiz_funnel_events_insert_anon"
  on public.quiz_funnel_events
  for insert
  to anon, authenticated
  with check (true);

-- Embudo: sesiones únicas por paso y % de abandono vs. el paso anterior.
-- (Referencia — no se ejecuta como parte de la migración.)
--
-- with sessions_per_step as (
--   select step_number, step_id, count(distinct session_id) as sesiones
--   from public.quiz_funnel_events
--   group by step_number, step_id
-- )
-- select
--   step_number,
--   step_id,
--   sesiones,
--   lag(sesiones) over (order by step_number) as sesiones_paso_anterior,
--   round(
--     100.0 * (1 - sesiones::numeric / nullif(lag(sesiones) over (order by step_number), 0)),
--     1
--   ) as pct_abandono_vs_anterior
-- from sessions_per_step
-- order by step_number;
