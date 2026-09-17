// Tracking de embudo del quiz (/quiz) en Supabase — complementa, no
// reemplaza, los eventos de Meta Pixel de src/services/metaPixel.ts. Con
// tráfico bajo, los umbrales de privacidad de Meta ocultan datos por
// evento/paso; esta tabla permite ver el abandono real paso a paso.
//
// Nunca se guarda aquí nombre, correo, ni ninguna respuesta del quiz —
// solo session_id (anónimo, por pestaña), el paso técnico, y los UTM de
// la campaña.

import { supabase } from "./supabaseClient";
import { generateUUID } from "@/utils/id";

const SESSION_KEY = "quiz_session_id";
const UTM_KEY = "quiz_utm_params";

export interface QuizUtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

const EMPTY_UTMS: QuizUtmParams = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
};

export function getOrCreateQuizSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = generateUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    // sessionStorage no disponible (navegación privada estricta, etc.):
    // seguimos funcionando, solo sin persistir el id entre pasos.
    return generateUUID();
  }
}

// Captura los UTM de la URL una sola vez por sesión (al primer load), para
// que se mantengan asociados aunque la persona navegue dentro del quiz sin
// esos parámetros ya presentes en la URL.
export function captureUtmParams(): QuizUtmParams {
  try {
    const stored = sessionStorage.getItem(UTM_KEY);
    if (stored) return JSON.parse(stored) as QuizUtmParams;

    const params = new URLSearchParams(window.location.search);
    const utms: QuizUtmParams = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
    };
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utms));
    return utms;
  } catch {
    return EMPTY_UTMS;
  }
}

function insertFunnelRow(stepNumber: number, stepId: string) {
  const sessionId = getOrCreateQuizSessionId();
  const utms = captureUtmParams();
  void supabase
    .from("quiz_funnel_events")
    .insert({ session_id: sessionId, step_number: stepNumber, step_id: stepId, ...utms })
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error("quizFunnelTracking.insertFunnelRow", error);
      }
    });
}

export function trackFunnelStep(stepNumber: number, stepId: string): void {
  insertFunnelRow(stepNumber, stepId);
}

// Paso sintético (no forma parte de FLOW): el clic real al checkout desde
// Urgencia, para poder ver ese último escalón de conversión en el embudo.
export const CHECKOUT_CLICK_STEP_NUMBER = 17;
export const CHECKOUT_CLICK_STEP_ID = "checkout_click";

export function trackFunnelCheckoutClick(): void {
  insertFunnelRow(CHECKOUT_CLICK_STEP_NUMBER, CHECKOUT_CLICK_STEP_ID);
}
