// Horas de sueño por día para el gráfico simple de Patrones. Reglas
// transparentes por pares de eventos (inicio de sueño -> siguiente evento
// de fin) — nada de IA ni estimaciones inventadas cuando faltan datos.

import type { SleepEvent, SleepEventType } from "@/types";

const SLEEP_START_TYPES: SleepEventType[] = ["nap_start", "night_sleep"];
const SLEEP_END_TYPES: SleepEventType[] = ["nap_end", "wake", "night_wake"];

// Protege contra un intervalo absurdo si falta el evento de "fin" real y
// el siguiente evento registrado quedó varios días después.
const MAX_INTERVAL_HOURS = 14;

export interface DailySleepHours {
  dateISO: string; // yyyy-mm-dd
  hours: number;
}

export function computeDailySleepHours(events: SleepEvent[], days = 7): DailySleepHours[] {
  const sorted = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const hoursByDayKey = new Map<string, number>();
  let openStartMs: number | null = null;

  for (const event of sorted) {
    const t = new Date(event.timestamp).getTime();
    if (SLEEP_START_TYPES.includes(event.type)) {
      openStartMs = t;
    } else if (SLEEP_END_TYPES.includes(event.type) && openStartMs !== null) {
      const durationHours = (t - openStartMs) / 3600000;
      if (durationHours > 0 && durationHours <= MAX_INTERVAL_HOURS) {
        const dayKey = new Date(openStartMs).toDateString();
        hoursByDayKey.set(dayKey, (hoursByDayKey.get(dayKey) || 0) + durationHours);
      }
      openStartMs = null;
    }
  }

  const today = new Date();
  const result: DailySleepHours[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const hours = hoursByDayKey.get(key) || 0;
    result.push({ dateISO: d.toISOString().slice(0, 10), hours: Math.round(hours * 10) / 10 });
  }
  return result;
}

// "No hay suficientes registros todavía" si menos de 3 de los últimos 7
// días tienen al menos un intervalo de sueño completo calculado.
export function hasEnoughDataForChart(dailyHours: DailySleepHours[]): boolean {
  return dailyHours.filter((d) => d.hours > 0).length >= 3;
}
