// Arquitectura preparada para analítica de eventos. Hoy solo registra en
// consola; el punto de integración futuro (Mixpanel, Amplitude, GA, etc.)
// se conecta reemplazando el cuerpo de trackEvent.

export function trackEvent(eventName, payload = {}) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${eventName}`, payload);
  }
}
