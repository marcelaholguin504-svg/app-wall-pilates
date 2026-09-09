// Integración mínima de Meta Pixel, exclusiva del funnel /quiz (no se activa
// en el resto de la app). Requiere la variable de entorno
// VITE_META_PIXEL_ID con el ID del píxel ya conectado en Meta Business
// Manager. Sin esa variable, no se carga ningún script externo y los
// eventos solo se ven en consola en desarrollo — el quiz nunca se rompe por
// falta de configuración, pero tampoco se manda ningún evento falso.

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: unknown;
  }
}

let initialized = false;

function getPixelId(): string | undefined {
  return import.meta.env.VITE_META_PIXEL_ID as string | undefined;
}

export function initMetaPixel(): void {
  if (initialized) return;
  initialized = true;

  const pixelId = getPixelId();
  if (!pixelId) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        "[metaPixel] VITE_META_PIXEL_ID no está configurado — los eventos del quiz solo se ven en consola, no se envían a Meta."
      );
    }
    return;
  }

  if (window.fbq) return;

  const n: Window["fbq"] = function (...args: unknown[]) {
    (n as any).callMethod ? (n as any).callMethod.apply(n, args) : n!.queue!.push(args);
  } as any;
  n!.queue = [];
  n!.loaded = true;
  n!.version = "2.0";
  window.fbq = n;
  window._fbq = n;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  n!("init", pixelId);
  n!("track", "PageView");
}

export function trackQuizEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[metaPixel] ${eventName}`, params);
  }
  if (!getPixelId() || !window.fbq) return;
  window.fbq("trackCustom", eventName, params);
}
