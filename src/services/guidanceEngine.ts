// Motor de recomendaciones: reglas transparentes por edad, situación y
// filtro de seguridad. No es un algoritmo médico ni una IA — selecciona
// contenido pre-aprobado desde src/data (ver sección 24).

import type { AgeStage, HelpSituation, SafetyFlag } from "@/types";
import { getGuidance } from "@/data/guidanceContent";
import { SAFETY_ALERT_MESSAGE, FEVER_ALERT_UNDER_3_MONTHS, feverAlertOver3Months } from "@/data/safetyContent";

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

export interface SafetyAlertContent {
  title: string;
  body: string;
  cta: string;
}

// Contenido del mensaje de derivación médica. Solo "fiebre" tiene mensaje
// distinto según la edad (en menores de 3 meses cualquier fiebre es
// urgencia inmediata); "respiracion" y "prefiero_no_responder" siempre usan
// el mensaje genérico, sin excepción y sin tips caseros en ningún caso.
export function getSafetyAlertContent(flag: SafetyFlag, ageStage: AgeStage, childName: string): SafetyAlertContent {
  if (flag === "fiebre") {
    const content = ageStage === "0-3m" ? FEVER_ALERT_UNDER_3_MONTHS : feverAlertOver3Months(childName);
    return { ...content, cta: SAFETY_ALERT_MESSAGE.cta };
  }
  return SAFETY_ALERT_MESSAGE;
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
