// Aviso proactivo ANTES de la ventana de sueño (sección de mejoras): solo
// visual, dentro de la app mientras está abierta — nada de notificaciones
// push del sistema (esa es una fase futura con infraestructura aparte).

import type { SleepEvent, SleepEventType, SleepWindow } from "@/types";

const ASLEEP_TYPES: SleepEventType[] = ["nap_start", "night_sleep"];

// Empieza a mostrarse hasta 30 minutos antes del inicio de la ventana, y
// desaparece en cuanto la ventana ya comenzó o el bebé ya se durmió.
export const PROACTIVE_ALERT_WINDOW_MINUTES = 30;

export function minutesUntilSleepWindow(
  window: SleepWindow | null,
  events: SleepEvent[],
  now: number = Date.now()
): number | null {
  if (!window) return null;

  const lastEvent = events[0];
  const babyAlreadyAsleep = Boolean(lastEvent && ASLEEP_TYPES.includes(lastEvent.type));
  if (babyAlreadyAsleep) return null;

  const startMs = new Date(window.startISO).getTime();
  const diffMinutes = (startMs - now) / 60000;
  if (diffMinutes <= 0 || diffMinutes > PROACTIVE_ALERT_WINDOW_MINUTES) return null;

  return Math.max(1, Math.round(diffMinutes));
}
