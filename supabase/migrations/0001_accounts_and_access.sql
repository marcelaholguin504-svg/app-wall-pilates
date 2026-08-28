-- Duerme Ya — cuentas, membresías y control de acceso.
--
-- Cómo aplicar esta migración:
--   Supabase → tu proyecto → SQL Editor → pega este archivo completo → Run.
--   (O, si usas Supabase CLI: `supabase db push`.)
--
-- Idempotente: puede ejecutarse más de una vez sin romper nada existente.

create extension if not exists pgcrypto;

-- =========================================================================
-- 1. TIPOS Y TABLAS
-- =========================================================================

do $$ begin
  create type public.account_role as enum ('admin', 'cuidador');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.member_status as enum ('activo', 'invitación pendiente', 'revocado');
exception when duplicate_object then null; end $$;

-- Una cuenta = una familia/compra en Hotmart.
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  hotmart_purchase_id text unique
);

-- Quién tiene acceso a cada cuenta y con qué rol.
create table if not exists public.account_members (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  email text not null,
  role public.account_role not null,
  invited_by text,
  status public.member_status not null default 'invitación pendiente',
  created_at timestamptz not null default now(),
  constraint account_members_email_lower check (email = lower(email))
);

create unique index if not exists account_members_account_email_key
  on public.account_members (account_id, email);
create index if not exists account_members_email_idx on public.account_members (email);

-- Perfil del niño, asociado a la cuenta (no al dispositivo). Un perfil por
-- cuenta en este MVP — soportar varios niños por cuenta queda fuera de
-- alcance por ahora.
create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references public.accounts(id) on delete cascade,
  name text not null,
  age_stage text not null,
  birth_date date,
  caregiver_type text not null,
  main_sleep_problem text not null,
  schedule_consistency text not null,
  improvement_goal text not null,
  photo_data_url text,
  plan_morning jsonb not null default '[]'::jsonb,
  plan_afternoon jsonb not null default '[]'::jsonb,
  plan_night jsonb not null default '[]'::jsonb,
  window_offset_minutes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Registros de sueño, asociados a la cuenta. Revocar el acceso de un
-- cuidador NUNCA borra lo que registró (no hay FK hacia account_members).
create table if not exists public.sleep_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  type text not null check (type in ('wake', 'nap_start', 'nap_end', 'night_sleep', 'night_wake')),
  timestamp timestamptz not null,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists sleep_events_account_idx on public.sleep_events (account_id, timestamp desc);

-- =========================================================================
-- 2. TRIGGERS DE MANTENIMIENTO
-- =========================================================================

create or replace function public.lowercase_email()
returns trigger language plpgsql as $$
begin
  new.email = lower(trim(new.email));
  return new;
end;
$$;

drop trigger if exists account_members_lowercase_email on public.account_members;
create trigger account_members_lowercase_email
  before insert or update on public.account_members
  for each row execute function public.lowercase_email();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists child_profiles_set_updated_at on public.child_profiles;
create trigger child_profiles_set_updated_at
  before update on public.child_profiles
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 3. FUNCIONES DE APOYO PARA RLS (SECURITY DEFINER)
-- =========================================================================
-- Nota: estas funciones son las que ejecutan lecturas contra account_members
-- "saltándose" RLS de forma controlada, para evitar recursión infinita en
-- las políticas de la propia tabla account_members.

create or replace function public.current_account_id()
returns uuid
language sql stable security definer set search_path = public, auth
as $$
  select am.account_id
  from public.account_members am
  where lower(am.email) = lower(auth.email())
    and am.status = 'activo'
  order by am.created_at asc
  limit 1;
$$;

create or replace function public.current_role_in_account()
returns public.account_role
language sql stable security definer set search_path = public, auth
as $$
  select am.role
  from public.account_members am
  where lower(am.email) = lower(auth.email())
    and am.status = 'activo'
  order by am.created_at asc
  limit 1;
$$;

-- =========================================================================
-- 4. RLS
-- =========================================================================

alter table public.accounts enable row level security;
alter table public.account_members enable row level security;
alter table public.child_profiles enable row level security;
alter table public.sleep_events enable row level security;

drop policy if exists "members can view their own account" on public.accounts;
create policy "members can view their own account"
  on public.accounts for select
  using (id = public.current_account_id());

drop policy if exists "members can view members of their account" on public.account_members;
create policy "members can view members of their account"
  on public.account_members for select
  using (account_id = public.current_account_id());

-- Nota: a propósito NO hay políticas de insert/update/delete para
-- account_members ni accounts. Toda escritura pasa por las funciones
-- SECURITY DEFINER de la sección 5, que corren con permisos de owner y
-- validan la regla de negocio (quién puede invitar, límite de 4, etc.)
-- antes de escribir.

drop policy if exists "members can view child profile" on public.child_profiles;
create policy "members can view child profile"
  on public.child_profiles for select
  using (account_id = public.current_account_id());

drop policy if exists "members can insert child profile" on public.child_profiles;
create policy "members can insert child profile"
  on public.child_profiles for insert
  with check (account_id = public.current_account_id());

drop policy if exists "members can update child profile" on public.child_profiles;
create policy "members can update child profile"
  on public.child_profiles for update
  using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

drop policy if exists "members can view sleep events" on public.sleep_events;
create policy "members can view sleep events"
  on public.sleep_events for select
  using (account_id = public.current_account_id());

drop policy if exists "members can insert sleep events" on public.sleep_events;
create policy "members can insert sleep events"
  on public.sleep_events for insert
  with check (account_id = public.current_account_id());

drop policy if exists "members can delete sleep events" on public.sleep_events;
create policy "members can delete sleep events"
  on public.sleep_events for delete
  using (account_id = public.current_account_id());

-- =========================================================================
-- 5. FUNCIONES RPC (lo único que puede escribir en accounts/account_members)
-- =========================================================================

-- Se llama justo después de que el magic link confirma la sesión. Si el
-- correo tenía una invitación pendiente, la marca como activa. No hace nada
-- si no había invitación pendiente (idempotente y seguro de llamar siempre).
create or replace function public.accept_pending_invitation()
returns void
language plpgsql security definer set search_path = public, auth
as $$
begin
  update public.account_members
  set status = 'activo'
  where lower(email) = lower(auth.email())
    and status = 'invitación pendiente';
end;
$$;

grant execute on function public.accept_pending_invitation() to authenticated;

-- Invita a un cuidador nuevo. Solo la administradora activa de la cuenta
-- puede ejecutar esto. Aplica el límite de 4 cuidadores adicionales.
create or replace function public.invite_caregiver(p_email text)
returns public.account_members
language plpgsql security definer set search_path = public, auth
as $$
declare
  v_account_id uuid;
  v_role public.account_role;
  v_count int;
  v_email text := lower(trim(p_email));
  v_new public.account_members;
begin
  select account_id, role into v_account_id, v_role
  from public.account_members
  where lower(email) = lower(auth.email()) and status = 'activo'
  order by created_at asc
  limit 1;

  if v_account_id is null then
    raise exception 'No tienes una cuenta activa.';
  end if;

  if v_role <> 'admin' then
    raise exception 'Solo la administradora puede invitar cuidadores.';
  end if;

  if v_email = '' or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Escribe un correo válido.';
  end if;

  select count(*) into v_count
  from public.account_members
  where account_id = v_account_id
    and role = 'cuidador'
    and status in ('activo', 'invitación pendiente');

  if v_count >= 4 then
    raise exception 'Ya invitaste al máximo de cuidadores (4). Si necesitas más, contáctanos.';
  end if;

  insert into public.account_members (account_id, email, role, invited_by, status)
  values (v_account_id, v_email, 'cuidador', lower(auth.email()), 'invitación pendiente')
  on conflict (account_id, email) do update
    set status = 'invitación pendiente', invited_by = excluded.invited_by
  returning * into v_new;

  return v_new;
end;
$$;

grant execute on function public.invite_caregiver(text) to authenticated;

-- Revoca el acceso de un cuidador. No borra sus registros de sueño (esa
-- tabla no tiene relación con account_members). No permite revocar a la
-- administradora.
create or replace function public.revoke_caregiver(p_member_id uuid)
returns void
language plpgsql security definer set search_path = public, auth
as $$
declare
  v_caller_account_id uuid;
  v_caller_role public.account_role;
  v_target public.account_members;
begin
  select account_id, role into v_caller_account_id, v_caller_role
  from public.account_members
  where lower(email) = lower(auth.email()) and status = 'activo'
  order by created_at asc
  limit 1;

  if v_caller_role is distinct from 'admin' then
    raise exception 'Solo la administradora puede quitar el acceso de un cuidador.';
  end if;

  select * into v_target from public.account_members where id = p_member_id;

  if v_target.id is null or v_target.account_id <> v_caller_account_id then
    raise exception 'Ese cuidador no pertenece a tu cuenta.';
  end if;

  if v_target.role = 'admin' then
    raise exception 'No puedes quitar el acceso de la administradora.';
  end if;

  update public.account_members set status = 'revocado' where id = p_member_id;
end;
$$;

grant execute on function public.revoke_caregiver(uuid) to authenticated;

-- Verifica si un correo tiene acceso activo. Se llama ANTES de iniciar
-- sesión (por eso también se otorga a "anon"). Solo devuelve un booleano:
-- nunca expone si el correo existe con otro estado, para no permitir
-- adivinar qué correos sí tienen cuenta.
create or replace function public.is_email_active_member(p_email text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.account_members
    where lower(email) = lower(trim(p_email)) and status = 'activo'
  );
$$;

grant execute on function public.is_email_active_member(text) to anon, authenticated;

-- =========================================================================
-- 6. PERMISOS DE TABLA
-- =========================================================================
-- Las políticas de RLS de arriba restringen QUÉ FILAS se ven; estos GRANT
-- controlan qué operaciones puede siquiera intentar cada rol. accounts y
-- account_members deliberadamente NO reciben insert/update/delete aquí:
-- esas operaciones solo pasan por las funciones de la sección 5.

grant usage on schema public to anon, authenticated;

grant select on public.accounts to authenticated;
grant select on public.account_members to authenticated;

grant select, insert, update on public.child_profiles to authenticated;
grant select, insert, delete on public.sleep_events to authenticated;
