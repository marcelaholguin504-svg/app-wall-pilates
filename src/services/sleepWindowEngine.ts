// Próximo descanso: ventana ORIENTATIVA (nunca un minuto exacto), calculada
// con reglas transparentes por edad + últimos registros + ajustes manuales
// del cuidador (ver sección 10 y 24). No es predicción médica ni IA.

import type { AgeStage, SleepEvent, SleepWindow } from "@/types";

// Ventana típica de tiempo despierto antes del próximo sueño, por etapa.
// Valores orientativos y amplios a propósito.
const AWAKE_WINDOW_MINUTES: Record<AgeStage, [number, number]> = {
  "0-3m": [45, 90],
  "4-6m": [90, 150],
  "7-12m": [150, 240],
  "13-18m": [240, 330],
  "19-24m": [300, 360],
  "2-3a": [330, 420],
};

function lastWakeOrNapEnd(events: SleepEvent[]): SleepEvent | null {
  const candidates = events
    .filter((e) => e.type === "wake" || e.type === "nap_end" || e.type === "night_wake")
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return candidates[0] || null;
}

export function computeNextSleepWindow(
  ageStage: AgeStage,
  events: SleepEvent[],
  offsetMinutes: number
): SleepWindow | null {
  const anchor = lastWakeOrNapEnd(events);
  if (!anchor) return null;

  const [minAwake, maxAwake] = AWAKE_WINDOW_MINUTES[ageStage];
  const anchorTime = new Date(anchor.timestamp).getTime();

  const startMs = anchorTime + (minAwake + offsetMinutes) * 60000;
  const endMs = anchorTime + (maxAwake + offsetMinutes) * 60000;

  return {
    label: "Próxima ventana orientativa",
    startISO: new Date(startMs).toISOString(),
    endISO: new Date(endMs).toISOString(),
    isAdjusted: offsetMinutes !== 0,
    anchorISO: anchor.timestamp,
  };
}

// Progreso 0–1 a través de todo el tiempo despierto esperado (desde el
// último despertar/fin de siesta hasta el final de la ventana orientativa).
// Es un indicador visual sutil, no una cuenta regresiva exacta.
export function computeWindowProgress(window: SleepWindow, now: number = Date.now()): number {
  const anchorMs = new Date(window.anchorISO).getTime();
  const endMs = new Date(window.endISO).getTime();
  if (endMs <= anchorMs) return 0;
  const fraction = (now - anchorMs) / (endMs - anchorMs);
  return Math.max(0, Math.min(1, fraction));
}

export const WINDOW_ADJUSTMENT_STEP = 15;
export const WINDOW_ADJUSTMENT_MAX = 90;

export function adjustOffset(current: number, direction: "earlier" | "later"): number {
  const delta = direction === "earlier" ? -WINDOW_ADJUSTMENT_STEP : WINDOW_ADJUSTMENT_STEP;
  const next = current + delta;
  return Math.max(-WINDOW_ADJUSTMENT_MAX, Math.min(WINDOW_ADJUSTMENT_MAX, next));
}
