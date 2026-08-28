// Acceso a cuentas y membresías (tabla account_members) — control de acceso
// real respaldado por Supabase. Todas las escrituras pasan por funciones
// RPC (ver supabase/migrations/0001_accounts_and_access.sql) que validan
// las reglas de negocio del lado del servidor; el cliente nunca inserta ni
// actualiza estas tablas directamente.

import { supabase } from "./supabaseClient";
import type { AccountMember, MemberStatus } from "@/types";

interface AccountMemberRow {
  id: string;
  account_id: string;
  email: string;
  role: "admin" | "cuidador";
  invited_by: string | null;
  status: MemberStatus;
  created_at: string;
}

function mapMember(row: AccountMemberRow): AccountMember {
  return {
    id: row.id,
    accountId: row.account_id,
    email: row.email,
    role: row.role,
    invitedBy: row.invited_by,
    status: row.status,
    createdAt: row.created_at,
  };
}

// Se llama ANTES de iniciar sesión, para decidir si mandamos el enlace
// mágico o mostramos el mensaje de "este correo no tiene acceso todavía".
export async function isEmailActiveMember(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_email_active_member", { p_email: email });
  if (error) {
    // Fallamos "cerrado": ante cualquier error, no enviamos el enlace.
    // eslint-disable-next-line no-console
    console.error("isEmailActiveMember", error);
    return false;
  }
  return Boolean(data);
}

// La membresía de la persona actualmente autenticada (su propio rol y cuenta).
export async function fetchMyMembership(email: string): Promise<AccountMember | null> {
  const { data, error } = await supabase
    .from("account_members")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .eq("status", "activo")
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return mapMember(data as AccountMemberRow);
}

// Todos los miembros de la cuenta del usuario actual (RLS ya limita el
// resultado a su propia cuenta).
export async function fetchAccountMembers(): Promise<AccountMember[]> {
  const { data, error } = await supabase
    .from("account_members")
    .select("*")
    .neq("status", "revocado")
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return (data as AccountMemberRow[]).map(mapMember);
}

export async function acceptPendingInvitation(): Promise<void> {
  await supabase.rpc("accept_pending_invitation");
}

export async function inviteCaregiver(email: string): Promise<AccountMember> {
  const { data, error } = await supabase.rpc("invite_caregiver", { p_email: email });
  if (error || !data) {
    throw new Error(error?.message || "No se pudo enviar la invitación.");
  }
  // Envía el enlace mágico de invitación. No requiere privilegios especiales:
  // signInWithOtp funciona con la clave publicable y no afecta la sesión
  // actual de quien invita.
  await supabase.auth.signInWithOtp({
    email: email.toLowerCase().trim(),
    options: { shouldCreateUser: true },
  });
  return mapMember(data as AccountMemberRow);
}

export async function revokeCaregiver(memberId: string): Promise<void> {
  const { error } = await supabase.rpc("revoke_caregiver", { p_member_id: memberId });
  if (error) throw new Error(error.message);
}
