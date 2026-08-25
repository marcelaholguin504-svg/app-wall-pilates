import type { AgeStage, HelpSituation } from "@/types";

export type AgeGroup = "infant" | "transitional" | "toddler";

export function ageStageToGroup(stage: AgeStage): AgeGroup {
  if (stage === "0-3m" || stage === "4-6m" || stage === "7-12m") return "infant";
  if (stage === "13-18m") return "transitional";
  return "toddler";
}

export const SITUATION_OPTIONS: { id: HelpSituation; label: string }[] = [
  { id: "no_duerme", label: "No consigue dormirse." },
  { id: "desperto_no_vuelve", label: "Se despertó y no vuelve a dormir." },
  { id: "multiples_despertares", label: "Ya se despertó varias veces." },
  { id: "llorando_inquieto", label: "Está llorando o muy inquieto." },
  { id: "siesta_no_funciono", label: "Su siesta no funcionó." },
  { id: "no_se_que_hacer", label: "No sé qué hacer." },
];

export const FOLLOW_UP_QUESTIONS: Record<HelpSituation, { question: string; options: string[] }> = {
  no_duerme: { question: "¿Parece tener sueño?", options: ["Sí, claro", "No mucho", "No estoy segura"] },
  desperto_no_vuelve: {
    question: "¿Cuánto hace que se despertó?",
    options: ["Menos de 10 minutos", "Entre 10 y 30 minutos", "Más de 30 minutos"],
  },
  multiples_despertares: {
    question: "¿Cuántas veces se ha despertado esta noche?",
    options: ["Una o dos", "Tres o más", "Perdí la cuenta"],
  },
  llorando_inquieto: {
    question: "¿Notas si algo lo detonó?",
    options: ["No, empezó así", "Ruido o cambio repentino", "No estoy segura"],
  },
  siesta_no_funciono: {
    question: "¿Logró dormir algo, aunque sea poco?",
    options: ["Nada", "Muy poco", "Un rato, pero se despertó pronto"],
  },
  no_se_que_hacer: {
    question: "¿Qué se siente más presente ahora?",
    options: ["Cansancio", "Confusión", "Un poco de todo"],
  },
};

interface GuidanceContent {
  steps: string[];
  alternative: string[];
}

type GuidanceBank = Record<HelpSituation, Record<AgeGroup, GuidanceContent>>;

export const GUIDANCE_BANK: GuidanceBank = {
  no_duerme: {
    infant: {
      steps: [
        "Baja luces y estímulos a su alrededor.",
        "Mantén la rutina tranquila que ya reconoce.",
        "Observa durante unos minutos si aparecen señales claras de sueño (bostezos, frotarse los ojos).",
      ],
      alternative: [
        "Ofrece contacto cercano y constante (upa, mano firme) sin agregar más estímulo.",
        "Prueba un sonido constante y suave de fondo.",
      ],
    },
    transitional: {
      steps: [
        "Reduce la luz y baja el volumen de todo lo que lo rodea.",
        "Repite la misma señal breve de siempre (frase o canción corta) para avisar que es hora de dormir.",
        "Dale unos minutos tranquilos en su espacio antes de intervenir.",
      ],
      alternative: [
        "Quédate cerca, con una presencia calmada, sin iniciar juego ni conversación.",
        "Prueba bajar aún más la luz o encender un sonido constante.",
      ],
    },
    toddler: {
      steps: [
        "Recuérdale con calma cuál es el siguiente paso de su rutina, sin abrir negociación.",
        'Ofrece una elección pequeña y limitada (ej. "¿luz apagada o encendida?") para darle algo de control sin perder el límite de la hora de dormir.',
        "Mantén tu tono y presencia estables, aunque pida quedarse despierto un poco más.",
      ],
      alternative: [
        "Vuelve a acompañarlo a su cama con calma, las veces que sea necesario, sin alargar la conversación.",
        "Si pide algo puntual (agua, ir al baño), resuélvelo una sola vez y regresa a la rutina.",
      ],
    },
  },
  desperto_no_vuelve: {
    infant: {
      steps: [
        "Espera un par de minutos antes de intervenir: puede volver a dormirse solo.",
        "Si sigue despierto, revisa que esté cómodo (pañal, temperatura).",
        "Mantén la luz baja y evita estimularlo si aún parece de noche.",
      ],
      alternative: [
        "Ofrece contacto breve y calmado, sin encender luces fuertes.",
        "Prueba un sonido constante de fondo para sostener el ambiente de sueño.",
      ],
    },
    transitional: {
      steps: [
        "Dale un momento antes de entrar: a veces se remueve y se vuelve a dormir solo.",
        "Si entras, mantén todo tranquilo y con poca luz.",
        "Evita sacarlo de la cuna o cama si el objetivo es que retome el sueño.",
      ],
      alternative: [
        "Quédate a su lado un momento, en silencio, sin cargarlo si no es necesario.",
        "Revisa temperatura y comodidad antes de otra estrategia.",
      ],
    },
    toddler: {
      steps: [
        "Si aún no es su hora de despertar, entra con calma y recuérdale que sigue siendo hora de dormir.",
        "Evita encender luces fuertes o iniciar una conversación larga.",
        "Acompáñalo de vuelta a su cama con el mismo límite tranquilo, sin negociar.",
      ],
      alternative: [
        "Ofrece su objeto de apego o una versión corta de la rutina para volver a dormir.",
        "Si insiste en levantarse, mantén la respuesta breve y constante cada vez.",
      ],
    },
  },
  multiples_despertares: {
    infant: {
      steps: [
        "Responde con calma, sin encender luces brillantes.",
        "Revisa lo básico primero: pañal, temperatura, hambre.",
        "Vuelve a acostarlo antes de que esté completamente despierto, si es posible.",
      ],
      alternative: [
        "Prueba mantener un sonido constante toda la noche para sostener el ambiente.",
        "Considera si algo cambió hoy (siesta, rutina, ambiente) que pueda estar afectando esta noche.",
      ],
    },
    transitional: {
      steps: [
        "Mantén cada respuesta breve, tranquila y parecida a las anteriores.",
        "Evita prender luces o iniciar actividad.",
        "Revisa comodidad antes de otra estrategia.",
      ],
      alternative: [
        "Prueba acompañarlo sin cargarlo, con una mano firme o palabras suaves.",
        "Anota la hora de estos despertares: puede ayudarte a ver un patrón en Registrar.",
      ],
    },
    toddler: {
      steps: [
        "Responde cada vez de forma parecida y breve, sin agregar cosas nuevas a la rutina.",
        "Recuérdale el límite con calma, sin abrir negociación en cada despertar.",
        "Evita encender pantallas o luces fuertes entre despertares.",
      ],
      alternative: [
        "Ofrece su objeto de apego u otra herramienta de calma que ya conozca.",
        "Si los despertares son muy seguidos, considera si algo del día (siesta, pantallas, emociones) pudo influir.",
      ],
    },
  },
  llorando_inquieto: {
    infant: {
      steps: [
        "Cárgalo cerca de tu pecho y baja la luz del cuarto.",
        "Prueba un sonido constante y suave ('shhh' o ruido blanco).",
        "Mécelo con un movimiento rítmico y constante.",
      ],
      alternative: [
        "Revisa si algo lo incomoda: ropa, pañal, temperatura.",
        "Dale un poco más de tiempo en brazos antes de intentar acostarlo de nuevo.",
      ],
    },
    transitional: {
      steps: [
        "Ofrece contacto cercano y calmado, con voz baja.",
        "Baja luces y reduce estímulos a su alrededor.",
        "Mantén un movimiento o sonido constante mientras se calma.",
      ],
      alternative: [
        "Revisa comodidad física antes de seguir intentando calmarlo.",
        "Dale unos minutos de contención sin agregar más estímulo.",
      ],
    },
    toddler: {
      steps: [
        "Baja tu propio tono de voz y muévete despacio: esto ayuda a que baje su ritmo también.",
        'Nombra lo que puede estar sintiendo ("veo que estás molesto") sin intentar razonar de más.',
        "Ofrece contención física si la acepta, sin exigirle que se calme de inmediato.",
      ],
      alternative: [
        "Dale un momento de espacio tranquilo, cerca de ti, sin presionar.",
        "Vuelve a intentar la rutina una vez que baje la intensidad del llanto.",
      ],
    },
  },
  siesta_no_funciono: {
    infant: {
      steps: [
        "Observa cuánto tiempo lleva despierto: puede estar sobrecansado o no lo suficiente.",
        "Prueba un ambiente más oscuro y silencioso para el próximo intento.",
        "Si acaba de despertar de una siesta muy corta, dale unos minutos antes de decidir el siguiente paso.",
      ],
      alternative: [
        "Considera adelantar o atrasar un poco el próximo intento de siesta.",
        "Prueba un espacio distinto si el habitual no está funcionando hoy.",
      ],
    },
    transitional: {
      steps: [
        "Revisa el tiempo despierto antes de la siesta: puede necesitar ajuste.",
        "Prueba una versión corta de su rutina antes de la siesta.",
        "Mantén el espacio oscuro y tranquilo.",
      ],
      alternative: [
        "Si no logra dormir, ofrece un momento de descanso tranquilo aunque no se duerma.",
        "Ajusta el horario del siguiente intento según cómo va el día.",
      ],
    },
    toddler: {
      steps: [
        "Recuérdale con calma que es momento de descanso, aunque no se duerma de inmediato.",
        "Mantén el mismo lugar y la rutina corta de siempre para la siesta.",
        "Si no se duerme, un rato tranquilo y sin pantallas también ayuda a descansar.",
      ],
      alternative: [
        "Considera si está en transición de dejar la siesta: puede necesitar un horario nocturno más temprano ese día.",
        "Prueba de nuevo mañana a la misma hora, sin forzarlo hoy.",
      ],
    },
  },
  no_se_que_hacer: {
    infant: {
      steps: [
        "Respira: no necesitas la respuesta perfecta en este momento.",
        "Baja luces y estímulos mientras decides el siguiente paso.",
        "Observa una señal a la vez: ¿tiene hambre, sueño, incomodidad?",
      ],
      alternative: [
        "Ofrece contacto cercano y calmado mientras observas qué necesita.",
        "Si nada cambia en varios minutos, prueba con la rutina habitual de sueño.",
      ],
    },
    transitional: {
      steps: [
        "Baja el ritmo general: menos luz, menos estímulo, menos preguntas.",
        "Vuelve a lo conocido: su rutina o señal habitual de dormir.",
        "Date un momento para observar antes de decidir qué probar.",
      ],
      alternative: [
        "Ofrece cercanía tranquila sin necesidad de resolverlo todo de inmediato.",
        "Prueba un sonido constante mientras decides el siguiente paso.",
      ],
    },
    toddler: {
      steps: [
        "Recuerda que no tienes que tener todas las respuestas ahora mismo.",
        "Vuelve a los pasos conocidos de su rutina como punto de partida.",
        "Mantén tu presencia calmada: eso también ayuda, aunque no tengas un plan perfecto.",
      ],
      alternative: [
        "Ofrece una elección pequeña para darle algo de control sin perder el rumbo.",
        "Si la situación se siente distinta a lo habitual, anótalo para revisarlo con calma después en Registrar.",
      ],
    },
  },
};

export function getGuidance(situation: HelpSituation, ageStage: AgeStage): GuidanceContent {
  return GUIDANCE_BANK[situation][ageStageToGroup(ageStage)];
}
