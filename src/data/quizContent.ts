// Contenido literal del quiz de validación (/quiz), tal cual el documento
// de diseño. Es un funnel separado del onboarding de la app — no reutiliza
// los tipos de AgeStage/SleepProblem etc. porque sus opciones son distintas
// (por ejemplo, aquí "1-2 años" es una sola opción, no dos etapas).

export interface QuizOption {
  id: string;
  label: string;
  emoji?: string;
}

export const P1_EDAD: QuizOption[] = [
  { id: "0-3m", label: "0-3 meses" },
  { id: "4-6m", label: "4-6 meses" },
  { id: "7-12m", label: "7-12 meses" },
  { id: "1-2a", label: "1-2 años" },
  { id: "2-3a", label: "2-3 años" },
];

export const P2_PATRON: QuizOption[] = [
  { id: "cuesta_dormirse", label: "Le cuesta dormirse" },
  { id: "despierta_muchas_veces", label: "Se despierta muchas veces" },
  { id: "no_siestas", label: "No quiere hacer siestas" },
  { id: "madruga", label: "Se despierta demasiado temprano" },
  { id: "solo_cargado", label: "Solo duerme si lo cargan" },
  { id: "horario_cambia", label: "Su horario cambia constantemente" },
];

export const P3_DURACION: QuizOption[] = [
  { id: "recien_empezo", label: "Recién empezó (días)" },
  { id: "unas_semanas", label: "Unas semanas" },
  { id: "uno_dos_meses", label: "Ya lleva 1-2 meses" },
  { id: "desde_siempre", label: "Desde siempre, no recuerdo que haya sido distinto" },
];

export const P4_QUE_INTENTO: QuizOption[] = [
  { id: "otras_apps", label: "Otras apps de sueño" },
  { id: "consejos_familia", label: "Consejos de familiares o amigas" },
  { id: "redes_sociales", label: "Videos o cuentas de redes sociales" },
  { id: "dejarlo_llorar", label: "Dejarlo llorar un poco a ver si se acostumbra" },
  { id: "nada_todavia", label: "Nada todavía, no sé por dónde empezar" },
];

export const P5_ESTADO_EMOCIONAL: QuizOption[] = [
  { id: "agotada_sigo_intentando", label: "Agotada, pero sigo intentando" },
  { id: "culpable", label: "Culpable, como si estuviera haciendo algo mal" },
  { id: "esperanzada", label: "Con esperanza de que algo cambie pronto" },
  { id: "no_se_como_me_siento", label: "Ya no sé ni cómo me siento, solo quiero dormir" },
];

export const P6_SITUACION_AHORA: QuizOption[] = [
  { id: "llorando", emoji: "😢", label: "Está llorando" },
  { id: "despierto_tranquilo", emoji: "👀", label: "Está despierto pero tranquilo" },
  { id: "quiere_jugar", emoji: "🤸", label: "Quiere jugar" },
  { id: "sueno_no_duerme", emoji: "😴", label: "Tiene sueño pero no logra dormirse" },
  { id: "duerme_y_despierta", emoji: "🔄", label: "Se duerme y vuelve a despertarse" },
  { id: "madruga_hoy", emoji: "🌅", label: "Se despertó demasiado temprano" },
];

export const P7_ALERTA_SEGURIDAD: QuizOption[] = [
  { id: "solo_sueno", label: "No, solo el sueño" },
  { id: "fiebre", label: "Fiebre o se ve enfermo" },
  { id: "llora_distinto", label: "Llora de forma distinta a lo normal" },
  { id: "prefiero_no_responder", label: "Prefiero no responder ahora" },
];

export const P8_CUIDADORES: QuizOption[] = [
  { id: "solo_yo", label: "Solo yo" },
  { id: "pareja", label: "Mi pareja" },
  { id: "abuela_abuelo", label: "Una abuela o abuelo" },
  { id: "ninera", label: "Una niñera" },
  { id: "varias_personas", label: "Varias personas" },
];

export const P9_META: QuizOption[] = [
  { id: "dormir_yo", label: "Dormir yo también, aunque sea unas horas seguidas" },
  { id: "saber_que_hacer", label: "Sentir que sé qué hacer, en vez de improvisar cada noche" },
  { id: "dejar_culpa", label: "Dejar de sentirme culpable" },
  { id: "tiempo_para_mi", label: "Tener un poco de tiempo para mí otra vez" },
];

export interface QuizAnswers {
  name: string | null;
  edad: string | null;
  patron: string | null;
  duracion: string | null;
  queIntento: string | null;
  estadoEmocional: string | null;
  situacionAhora: string | null;
  alertaSeguridad: string | null;
  cuidadores: string | null;
  meta: string | null;
}

export const INITIAL_QUIZ_ANSWERS: QuizAnswers = {
  name: null,
  edad: null,
  patron: null,
  duracion: null,
  queIntento: null,
  estadoEmocional: null,
  situacionAhora: null,
  alertaSeguridad: null,
  cuidadores: null,
  meta: null,
};

function labelFor(options: QuizOption[], id: string | null): string {
  return options.find((o) => o.id === id)?.label || "—";
}

// Para el resumen de QA al final de la Fase A: nombre del campo + su
// etiqueta legible, en el mismo orden en que se preguntaron.
export function answersSummary(answers: QuizAnswers): { question: string; value: string }[] {
  return [
    { question: "Edad", value: labelFor(P1_EDAD, answers.edad) },
    { question: "Patrón que más se repite", value: labelFor(P2_PATRON, answers.patron) },
    { question: "Hace cuánto pasa esto", value: labelFor(P3_DURACION, answers.duracion) },
    { question: "Qué ha probado", value: labelFor(P4_QUE_INTENTO, answers.queIntento) },
    { question: "Cómo se siente", value: labelFor(P5_ESTADO_EMOCIONAL, answers.estadoEmocional) },
    { question: "Qué está pasando ahora", value: labelFor(P6_SITUACION_AHORA, answers.situacionAhora) },
    { question: "Alerta de seguridad", value: labelFor(P7_ALERTA_SEGURIDAD, answers.alertaSeguridad) },
    { question: "Quién más cuida", value: labelFor(P8_CUIDADORES, answers.cuidadores) },
    { question: "Qué le gustaría recuperar", value: labelFor(P9_META, answers.meta) },
  ];
}
