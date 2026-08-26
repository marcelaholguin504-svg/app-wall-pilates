// CRUD de child_profiles contra Supabase. La cuenta (account_id) es siempre
// la fuente de verdad de a quién pertenece el perfil — nunca el dispositivo.

import { supabase } from "./supabaseClient";
import type { ChildProfile, PlanAction, SleepPlan } from "@/types";

interface ChildProfileRow {
  id: string;
  account_id: string;
  name: string;
  age_stage: ChildProfile["ageStage"];
  birth_date: string | null;
  caregiver_type: ChildProfile["caregiverType"];
  main_sleep_problem: ChildProfile["mainSleepProblem"];
  schedule_consistency: ChildProfile["scheduleConsistency"];
  improvement_goal: ChildProfile["improvementGoal"];
  photo_data_url: string | null;
  plan_morning: PlanAction[];
  plan_afternoon: PlanAction[];
  plan_night: PlanAction[];
  window_offset_minutes: number;
  created_at: string;
}

export function mapRowToChildProfile(row: ChildProfileRow): ChildProfile {
  return {
    id: row.id,
    accountId: row.account_id,
    name: row.name,
    ageStage: row.age_stage,
    birthDate: row.birth_date || undefined,
    caregiverType: row.caregiver_type,
    mainSleepProblem: row.main_sleep_problem,
    scheduleConsistency: row.schedule_consistency,
    improvementGoal: row.improvement_goal,
    photoDataUrl: row.photo_data_url || undefined,
    createdAt: row.created_at,
  };
}

export function mapRowToPlan(row: ChildProfileRow): SleepPlan {
  return {
    morning: row.plan_morning || [],
    afternoon: row.plan_afternoon || [],
    night: row.plan_night || [],
    updatedAt: null,
  };
}

export async function fetchChildProfileRow(accountId: string): Promise<ChildProfileRow | null> {
  const { data, error } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("account_id", accountId)
    .maybeSingle();
  if (error || !data) return null;
  return data as ChildProfileRow;
}

function toRow(accountId: string, child: ChildProfile) {
  return {
    id: child.id,
    account_id: accountId,
    name: child.name,
    age_stage: child.ageStage,
    birth_date: child.birthDate || null,
    caregiver_type: child.caregiverType,
    main_sleep_problem: child.mainSleepProblem,
    schedule_consistency: child.scheduleConsistency,
    improvement_goal: child.improvementGoal,
    photo_data_url: child.photoDataUrl || null,
  };
}

export async function upsertChildProfile(accountId: string, child: ChildProfile): Promise<void> {
  const { error } = await supabase.from("child_profiles").upsert(toRow(accountId, child), { onConflict: "id" });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("upsertChildProfile", error);
  }
}

export async function updatePlanSection(
  accountId: string,
  section: "morning" | "afternoon" | "night",
  actions: PlanAction[]
): Promise<void> {
  const column = section === "morning" ? "plan_morning" : section === "afternoon" ? "plan_afternoon" : "plan_night";
  const { error } = await supabase.from("child_profiles").update({ [column]: actions }).eq("account_id", accountId);
  if (error) {
    // eslint-disable-next-line no-console
    console.error("updatePlanSection", error);
  }
}

export async function updateWindowOffset(accountId: string, offsetMinutes: number): Promise<void> {
  const { error } = await supabase
    .from("child_profiles")
    .update({ window_offset_minutes: offsetMinutes })
    .eq("account_id", accountId);
  if (error) {
    // eslint-disable-next-line no-console
    console.error("updateWindowOffset", error);
  }
}
