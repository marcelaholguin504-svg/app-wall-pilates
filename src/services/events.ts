// Servicio interno mínimo de eventos (ver sección 20, extensión). Hoy solo
// registra en consola y en memoria — NO es analítica real y no se conecta a
// ningún servicio externo. Es la interfaz preparada para cuando se decida
// conectar analítica real, sin tener que instrumentar la app desde cero.

import type { EventName } from "@/types";

interface LoggedEvent {
  name: EventName;
  payload: Record<string, unknown>;
  at: string;
}

const log: LoggedEvent[] = [];

export function trackEvent(name: EventName, payload: Record<string, unknown> = {}): void {
  const entry: LoggedEvent = { name, payload, at: new Date().toISOString() };
  log.push(entry);
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[eventos] ${name}`, payload);
  }
}

export function getEventLog(): LoggedEvent[] {
  return [...log];
}
