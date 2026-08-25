export type AgeStage = "0-3m" | "4-6m" | "7-12m" | "13-18m" | "19-24m" | "2-3a";

export const TODDLER_STAGES: AgeStage[] = ["19-24m", "2-3a"];

export type CaregiverType = "mama" | "papa" | "abuela" | "abuelo" | "ninera" | "otro";

export type SleepProblem =
  | "despierta_muchas_veces"
  | "cuesta_dormirse"
  | "solo_duerme_acompanado"
  | "madruga"
  | "siestas_dificiles"
  | "cada_noche_diferente"
  | "no_queda_en_cama"
  | "negocia_hora_dormir";

export type ScheduleConsistency =
  | "rutina_clara"
  | "intentamos_pero_cambia"
  | "depende_del_dia"
  | "sin_rutina_definida"
  | "no_se_que_probar";

export type ImprovementGoal =
  | "dormirse_con_menos_dificultad"
  | "reducir_despertares"
  | "rutina_predecible"
  | "mejorar_siestas"
  | "saber_que_hacer_al_despertar"
  | "sentir_que_tengo_un_plan";

export interface ChildProfile {
  id: string;
  name: string;
  ageStage: AgeStage;
  birthDate?: string;
  caregiverType: CaregiverType;
  mainSleepProblem: SleepProblem;
  scheduleConsistency: ScheduleConsistency;
  improvementGoal: ImprovementGoal;
  photoDataUrl?: string;
  createdAt: string;
}

export interface Caregiver {
  id: string;
  name: string;
  type: CaregiverType;
}

export type SleepEventType = "wake" | "nap_start" | "nap_end" | "night_sleep" | "night_wake";

export interface SleepEvent {
  id: string;
  type: SleepEventType;
  timestamp: string;
}

export interface SleepWindow {
  label: string;
  startISO: string;
  endISO: string;
  isAdjusted: boolean;
}

export interface PlanAction {
  id: string;
  text: string;
}

export interface SleepPlan {
  morning: PlanAction[];
  afternoon: PlanAction[];
  night: PlanAction[];
  updatedAt: string | null;
}

export type SoundType = "rain" | "waves" | "white" | "pink" | "brown" | "fan" | "rain_journey" | "lullaby" | "heartbeat";

export interface Sound {
  id: string;
  label: string;
  icon: string;
  type: SoundType;
}

export type TimerOption = 15 | 30 | 45 | 60 | 0;

export type HelpSituation =
  | "no_duerme"
  | "desperto_no_vuelve"
  | "multiples_despertares"
  | "llorando_inquieto"
  | "siesta_no_funciono"
  | "no_se_que_hacer";

export type SafetyFlag = "solo_sueno" | "fiebre" | "respiracion" | "prefiero_no_responder";

export interface GuidanceStep {
  id: string;
  situation: HelpSituation;
  ageStages: AgeStage[];
  title: string;
  steps: string[];
  alternative: string[];
}

export interface EducationalArticle {
  id: string;
  title: string;
  minutes: number;
  body: string;
  problems: SleepProblem[];
}

export type EventName =
  | "onboarding_iniciado"
  | "onboarding_completado"
  | "perfil_creado"
  | "perfil_editado"
  | "foto_actualizada"
  | "ayudame_ahora_iniciado"
  | "ayudame_ahora_completado"
  | "alerta_seguridad_mostrada"
  | "sonido_reproducido"
  | "registro_creado"
  | "cuidador_agregado"
  | "plan_editado"
  | "ventana_sueno_ajustada";
