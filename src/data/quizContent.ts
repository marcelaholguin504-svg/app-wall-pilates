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

export function labelFor(options: QuizOption[], id: string | null): string {
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

// ═══════════════════════════════════════════════════════════════════════
// FASE B — bloques de aprendizaje, página de resultado, beneficios, cierre
// ═══════════════════════════════════════════════════════════════════════

export interface LearningBlock {
  n: 1 | 2 | 3;
  eyebrow: string;
  title: string;
  text: string;
}

export const LEARNING_BLOCKS: LearningBlock[] = [
  {
    n: 1,
    eyebrow: "Bloque de aprendizaje 1",
    title: "Esto es más común de lo que crees",
    text:
      "A cada edad le corresponde un ritmo distinto — y cuando no lo conocemos, cualquier horario nos puede parecer \"el equivocado\". No es que algo esté mal: es que nadie te enseñó cómo se ve lo normal a esta edad.",
  },
  {
    n: 2,
    eyebrow: "Bloque de aprendizaje 2",
    title: "Por qué lo que ya probaste no funcionó del todo",
    text:
      "La mayoría de los consejos y apps dan diez sugerencias a la vez. El cerebro cansado no necesita más opciones — necesita UNA acción clara, comprobar si funcionó, y recién ahí la siguiente.",
  },
  {
    n: 3,
    eyebrow: "Bloque de aprendizaje 3",
    title: "Lo que sientes tiene nombre, y no eres la única",
    text:
      "En comunidades de mamás en internet, esta frase se repite una y otra vez, casi con las mismas palabras: \"probé de todo y nada funcionaba para su edad\". El cansancio que sientes no es debilidad — es la consecuencia lógica de cuidar a alguien más antes que a ti misma, noche tras noche.",
  },
];

// Nota de transparencia (no se muestra en pantalla, ver Quiz.tsx): la frase
// entre comillas del Bloque 3 y la de "señal de pertenencia" del cierre son
// un patrón general de foros públicos, nunca un testimonio real de una
// persona con nombre y foto — así lo pide explícitamente el documento.

export type QuizSegmentId = "0-6m" | "6-12m" | "1-3a";

export interface QuizSegment {
  id: QuizSegmentId;
  diagnosticoBase: string;
}

export const QUIZ_SEGMENTS: Record<QuizSegmentId, QuizSegment> = {
  "0-6m": {
    id: "0-6m",
    diagnosticoBase: "A esta edad, el caos ES lo normal — no hay nada que arreglar todavía, hay que sobrevivir con guía.",
  },
  "6-12m": {
    id: "6-12m",
    diagnosticoBase: "Las regresiones no son un error tuyo, son parte del desarrollo — aquí está qué hacer mientras pasa.",
  },
  "1-3a": {
    id: "1-3a",
    diagnosticoBase: "Casi ninguna app de sueño está pensada para esta edad — por eso nada de lo que probaste funcionó del todo.",
  },
};

export function segmentForEdad(edad: string | null): QuizSegment {
  if (edad === "0-3m" || edad === "4-6m") return QUIZ_SEGMENTS["0-6m"];
  if (edad === "7-12m") return QUIZ_SEGMENTS["6-12m"];
  return QUIZ_SEGMENTS["1-3a"];
}

// Grupo de edad para reutilizar el mismo banco de recomendaciones de
// "Ayúdame Ahora" (src/data/guidanceContent.ts) — el quiz tiene sus propias
// opciones de edad (no el AgeStage completo de 6 valores de la app), así
// que se mapean directo a los 3 grupos que ya usa ese motor.
export type QuizAgeGroup = "infant" | "transitional" | "toddler";

export function ageGroupForEdad(edad: string | null): QuizAgeGroup {
  if (edad === "1-2a") return "transitional";
  if (edad === "2-3a") return "toddler";
  return "infant"; // 0-3m, 4-6m, 7-12m
}

// P6 ("¿Qué está pasando en este momento?") no tiene un HelpSituation
// idéntico en la app — es una interpretación razonable, no literal, de qué
// situación de "Ayúdame Ahora" se le parece más a cada opción del quiz.
export type HelpSituationLike =
  | "no_duerme"
  | "desperto_no_vuelve"
  | "multiples_despertares"
  | "llorando_inquieto"
  | "siesta_no_funciono"
  | "no_se_que_hacer";

export function helpSituationForSituacionAhora(situacionAhora: string | null): HelpSituationLike {
  switch (situacionAhora) {
    case "llorando":
      return "llorando_inquieto";
    case "sueno_no_duerme":
      return "no_duerme";
    case "duerme_y_despierta":
      return "multiples_despertares";
    case "despierto_tranquilo":
    case "quiere_jugar":
    case "madruga_hoy":
      return "desperto_no_vuelve";
    default:
      return "no_se_que_hacer";
  }
}

// Espejo textual de la respuesta a P5 (estado emocional).
export function mirrorEstadoEmocional(estadoEmocional: string | null): string {
  switch (estadoEmocional) {
    case "agotada_sigo_intentando":
      return "Sé que estás agotada, pero sigues intentando — eso ya dice mucho de ti.";
    case "culpable":
      return "Sé que te sientes culpable, y quiero que sepas algo: no lo estás haciendo mal.";
    case "esperanzada":
      return "Sé que tienes esperanza de que esto cambie pronto — y tienes razón en tenerla.";
    case "no_se_como_me_siento":
      return "Sé que ya no sabes ni cómo te sientes, solo quieres dormir — y eso también es válido.";
    default:
      return "Sé que esto ha sido difícil de sobrellevar.";
  }
}

// Validación del esfuerzo ya invertido, reflejando P4.
export function validationQueIntento(queIntento: string | null, displayName: string): string {
  if (queIntento === "nada_todavia") {
    return "Todavía no habías probado nada — y está bien: no sabías por dónde empezar, no porque te faltara esfuerzo.";
  }
  const label = labelFor(P4_QUE_INTENTO, queIntento).toLowerCase();
  return `Ya probaste ${label} — el problema nunca fue que no te esforzaras, era que nada estaba hecho para lo que ${displayName} necesita hoy.`;
}

// Cierre reflejando la meta personal (P9).
export function closeForMeta(meta: string | null): string {
  switch (meta) {
    case "dormir_yo":
      return "Esto es para que tú también puedas dormir, aunque sea unas horas seguidas, otra vez.";
    case "saber_que_hacer":
      return "Esto es para que sientas que sabes qué hacer, en vez de improvisar cada noche.";
    case "dejar_culpa":
      return "Esto es para que dejes de sentirte culpable.";
    case "tiempo_para_mi":
      return "Esto es para que vuelvas a tener un poco de tiempo para ti.";
    default:
      return "Esto es para que las cosas empiecen a sentirse distintas, para ambos.";
  }
}

// Frase para la línea de cuidadores compartidos (P8), solo si no es "Solo yo".
export function cuidadorClause(cuidadores: string | null): string | null {
  switch (cuidadores) {
    case "pareja":
      return "tu pareja";
    case "abuela_abuelo":
      return "una abuela o abuelo";
    case "ninera":
      return "una niñera";
    case "varias_personas":
      return "varias personas";
    default:
      return null; // "solo_yo" o sin respuesta: no se muestra la línea.
  }
}

export const BENEFITS: string[] = [
  "Una acción clara para cada situación, no una lista de veinte consejos genéricos",
  "El aviso antes de que se sobrecanse, no solo la explicación después de que ya pasó",
  "Guía específica para la edad exacta de tu bebé — no copy reciclado de otra etapa",
  "Puedes compartirlo con quien más te ayude a cuidarlo, sin pagar por separado",
  "Sin anuncios, sin dashboard que descifrar a las 3 AM",
];

// Subconjunto de 3 para el recordatorio corto del bloque de urgencia — texto
// literal del documento (más corto que los 5 completos de arriba).
export const URGENCY_BENEFITS_REMINDER: string[] = [
  "Una acción clara para cada situación, no veinte consejos genéricos",
  "El aviso antes de que se sobrecanse, no solo después",
  "Puedes compartirlo con quien más te ayude a cuidarlo",
];

// Patrón de foros públicos, NUNCA un testimonio real — ver nota arriba.
export const PERTENENCIA_QUOTE_URGENCIA =
  "Esta frustración se repite una y otra vez en comunidades de mamás: \"ya probé de todo y nada era para la edad de mi bebé\". No eres la única viviendo esto esta noche.";

export const GUARANTEE_TEXT = "Garantía de 7 días. Si no te sirve, te devolvemos tu dinero, sin preguntas.";

export const CHECKOUT_URL = "https://pay.hotmart.com/T107454781Q?checkoutMode=10";
