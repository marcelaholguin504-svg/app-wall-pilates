-- Duerme Ya — autoservicio real de borrado de datos.
-- Aplicar DESPUÉS de 0001_accounts_and_access.sql.
--
-- Cómo aplicar: Supabase → tu proyecto → SQL Editor → pega este archivo
-- completo → Run. Idempotente: puede ejecutarse más de una vez.

-- Un cuidador invitado (no la administradora) deja la cuenta por su cuenta.
-- Solo borra SU PROPIA membresía — el perfil del niño, los registros y el
-- acceso de los demás cuidadores no se tocan.
create or replace function public.leave_account()
returns void
language plpgsql security definer set search_path = public, auth
as $$
declare
  v_role public.account_role;
begin
  select role into v_role
  from public.account_members
  where lower(email) = lower(auth.email()) and status = 'activo'
  order by created_at asc
  limit 1;

  if v_role is null then
    raise exception 'No tienes una cuenta activa.';
  end if;

  if v_role = 'admin' then
    raise exception 'Como administradora, usa "Borrar todos mis datos" en vez de salir de la cuenta.';
  end if;

  delete from public.account_members
  where lower(email) = lower(auth.email()) and status = 'activo';
end;
$$;

grant execute on function public.leave_account() to authenticated;

-- Solo la administradora activa de la cuenta puede ejecutar esto. Borra la
-- fila de accounts; account_members, child_profiles y sleep_events tienen
-- "on delete cascade" hacia accounts (ver 0001), así que se borran solos —
-- incluyendo la membresía de la propia administradora y la de todos los
-- cuidadores invitados.
create or replace function public.delete_account_data()
returns void
language plpgsql security definer set search_path = public, auth
as $$
declare
  v_account_id uuid;
  v_role public.account_role;
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
    raise exception 'Solo la administradora puede borrar todos los datos de la cuenta.';
  end if;

  delete from public.accounts where id = v_account_id;
end;
$$;

grant execute on function public.delete_account_data() to authenticated;
