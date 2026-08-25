// Motor de recomendaciones: reglas transparentes por edad, situación y
// filtro de seguridad. No es un algoritmo médico ni una IA — selecciona
// contenido pre-aprobado desde src/data (ver sección 24).

import type { AgeStage, HelpSituation, SafetyFlag } from "@/types";
import { getGuidance } from "@/data/guidanceContent";
import { SAFETY_ALERT_MESSAGE } from "@/data/safetyContent";

export interface GuidanceOutcome {
  blocked: boolean;
  alertTitle?: string;
  alertBody?: string;
  alertCta?: string;
  steps?: string[];
  alternative?: string[];
}

// El filtro de seguridad se detiene ante CUALQUIER respuesta distinta de
// "solo el sueño" — incluyendo "prefiero no responder ahora" (sección 8).
export function safetyFilterBlocks(flag: SafetyFlag): boolean {
  return flag !== "solo_sueno";
}

export function getGuidanceOutcome(situation: HelpSituation, ageStage: AgeStage, safetyFlag: SafetyFlag): GuidanceOutcome {
  if (safetyFilterBlocks(safetyFlag)) {
    return {
      blocked: true,
      alertTitle: SAFETY_ALERT_MESSAGE.title,
      alertBody: SAFETY_ALERT_MESSAGE.body,
      alertCta: SAFETY_ALERT_MESSAGE.cta,
    };
  }
  const content = getGuidance(situation, ageStage);
  return { blocked: false, steps: content.steps, alternative: content.alternative };
}
