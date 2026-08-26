// CRUD de sleep_events contra Supabase, siempre acotado a la cuenta.

import { supabase } from "./supabaseClient";
import type { SleepEvent, SleepEventType } from "@/types";

interface SleepEventRow {
  id: string;
  account_id: string;
  type: SleepEventType;
  timestamp: string;
}

function mapRow(row: SleepEventRow): SleepEvent {
  return { id: row.id, accountId: row.account_id, type: row.type, timestamp: row.timestamp };
}

export async function fetchSleepEvents(accountId: string, limit = 400): Promise<SleepEvent[]> {
  const { data, error } = await supabase
    .from("sleep_events")
    .select("*")
    .eq("account_id", accountId)
    .order("timestamp", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return (data as SleepEventRow[]).map(mapRow);
}

export async function insertSleepEvent(event: SleepEvent, createdByEmail: string | null): Promise<void> {
  const { error } = await supabase.from("sleep_events").insert({
    id: event.id,
    account_id: event.accountId,
    type: event.type,
    timestamp: event.timestamp,
    created_by: createdByEmail,
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("insertSleepEvent", error);
  }
}

export async function deleteSleepEvent(id: string): Promise<void> {
  const { error } = await supabase.from("sleep_events").delete().eq("id", id);
  if (error) {
    // eslint-disable-next-line no-console
    console.error("deleteSleepEvent", error);
  }
}
