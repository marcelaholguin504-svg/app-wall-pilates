// Capa de contenido: banco de estrategias para el flujo SOS "Mi bebé no duerme".
// Este archivo puede revisarse y actualizarse sin tocar la lógica de la app.
// Ninguna estrategia aquí reemplaza el criterio del pediatra.

export const SITUATIONS = [
  { id: "llorando", emoji: "😢", label: "Está llorando" },
  { id: "despierto_tranquilo", emoji: "👀", label: "Está despierto pero tranquilo" },
  { id: "quiere_jugar", emoji: "🤸", label: "Quiere jugar" },
  { id: "sueno_no_duerme", emoji: "😴", label: "Tiene sueño pero no logra dormirse" },
  { id: "se_despierta", emoji: "🔄", label: "Se duerme y vuelve a despertarse" },
  { id: "madruga", emoji: "🌅", label: "Se despertó demasiado temprano" },
];

// Preguntas de alerta pediátrica. Si el cuidador marca alguna, se detiene
// el flujo de recomendaciones de sueño y se deriva a consulta médica.
export const PEDIATRIC_ALERT_QUESTIONS = [
  {
    id: "fiebre",
    label: "¿Tiene fiebre o se siente muy caliente?",
  },
  {
    id: "llanto_inconsolable",
    label: "¿Lleva llorando sin parar por más de 20 minutos y nada lo calma?",
  },
  {
    id: "rechaza_alimento",
    label: "¿Ha rechazado comer o tomar líquidos por varias horas?",
  },
  {
    id: "dificultad_respirar",
    label: "¿Notas que respira con dificultad o de forma distinta a lo habitual?",
  },
  {
    id: "otro_sintoma",
    label: "¿Notas algo más en su cuerpo o comportamiento que te preocupa (además del sueño)?",
  },
];

export const PEDIATRIC_ALERT_MESSAGE = {
  title: "Esto va más allá del sueño",
  body:
    "Lo que describes podría no tratarse solo de una dificultad para dormir. No podemos evaluarlo por ti: lo más seguro es que te pongas en contacto con el pediatra o los servicios de salud de tu localidad.",
  cta: "Entendido",
};

// Cada estrategia: id único, situaciones donde aplica, texto de acción concreta,
// un detalle breve opcional y una etiqueta de respaldo.
export const STRATEGIES = [
  // --- Llorando ---
  {
    id: "llorando_upa_baja_luz",
    situationIds: ["llorando"],
    title: "Cárgalo en brazos y baja la luz",
    detail: "Sostenlo pecho con pecho, en un espacio con poca luz, meciéndolo despacio de forma constante.",
  },
  {
    id: "llorando_shh_mecer",
    situationIds: ["llorando"],
    title: "Combina un 'shhh' suave con un mecido rítmico",
    detail: "El sonido constante junto con un movimiento repetitivo suele calmar el llanto por sobreestimulación.",
  },
  {
    id: "llorando_revisar_panal",
    situationIds: ["llorando"],
    title: "Revisa si el pañal o la ropa le incomodan",
    detail: "Una etiqueta, un pliegue o un pañal sucio pueden ser la causa de un llanto repentino.",
  },
  {
    id: "llorando_ambiente",
    situationIds: ["llorando"],
    title: "Baja un poco la temperatura del cuarto",
    detail: "Un ambiente demasiado abrigado puede generar molestia. Un cuarto fresco y sin corrientes de aire ayuda a calmar.",
  },

  // --- Despierto tranquilo ---
  {
    id: "tranquilo_penumbra",
    situationIds: ["despierto_tranquilo"],
    title: "Déjalo en la cuna con luz tenue, sin estimularlo",
    detail: "A veces solo necesita tiempo tranquilo para conciliar el sueño por sí mismo, sin intervención.",
  },
  {
    id: "tranquilo_sonido_blanco",
    situationIds: ["despierto_tranquilo"],
    title: "Activa un sonido suave y constante",
    detail: "El ruido blanco o un arrullo repetitivo ayuda a que el ambiente se sienta igual de calmado que antes de despertar.",
  },
  {
    id: "tranquilo_espera_breve",
    situationIds: ["despierto_tranquilo"],
    title: "Espera unos minutos antes de intervenir",
    detail: "Obsérvalo sin actuar de inmediato: muchos bebés vuelven a dormirse solos si no se les estimula.",
  },

  // --- Quiere jugar ---
  {
    id: "jugar_bajar_estimulo",
    situationIds: ["quiere_jugar"],
    title: "Reduce todo estímulo: sin pantallas, sin juegos, sin conversación",
    detail: "Háblale en voz muy baja y evita el contacto visual prolongado para enviar la señal de que es hora de dormir.",
  },
  {
    id: "jugar_oscuridad_total",
    situationIds: ["quiere_jugar"],
    title: "Oscurece por completo el cuarto",
    detail: "La luz es una de las señales más fuertes para el cuerpo. Sin ella, el impulso de jugar suele bajar en pocos minutos.",
  },
  {
    id: "jugar_rutina_corta",
    situationIds: ["quiere_jugar"],
    title: "Repite la señal de su rutina de sueño (canción o frase fija)",
    detail: "Una señal breve y siempre igual le recuerda que no es momento de juego, aunque esté con energía.",
  },

  // --- Sueño pero no logra dormirse ---
  {
    id: "sueno_pexels_swaddle",
    situationIds: ["sueno_no_duerme"],
    title: "Envuélvelo o arrópalo de forma segura y firme",
    detail: "La sensación de contención (sin cubrir cara ni cabeza) puede ayudarlo a relajarse para dormir.",
  },
  {
    id: "sueno_ruido_blanco",
    situationIds: ["sueno_no_duerme"],
    title: "Pon ruido blanco a volumen moderado y constante",
    detail: "Enmascara sonidos del entorno que podrían mantenerlo alerta.",
  },
  {
    id: "sueno_movimiento_suave",
    situationIds: ["sueno_no_duerme"],
    title: "Un movimiento suave y repetitivo (mecedora, caminar despacio)",
    detail: "El movimiento constante y previsible favorece la transición hacia el sueño.",
  },
  {
    id: "sueno_reduce_tiempo_despierto",
    situationIds: ["sueno_no_duerme"],
    title: "Revisa si ya pasó demasiado tiempo despierto",
    detail: "Un bebé sobrecansado puede costarle más conciliar el sueño. Iniciar la rutina un poco antes la próxima vez puede ayudar.",
  },

  // --- Se duerme y despierta ---
  {
    id: "rebote_espera",
    situationIds: ["se_despierta"],
    title: "Dale una pausa breve antes de intervenir",
    detail: "Muchos bebés se remueven o se quejan brevemente entre ciclos de sueño y se vuelven a dormir solos.",
  },
  {
    id: "rebote_mano_quieta",
    situationIds: ["se_despierta"],
    title: "Coloca una mano firme y quieta sobre su pecho o espalda",
    detail: "Sin levantarlo, esto puede ayudarlo a conectar el siguiente ciclo de sueño sin necesidad de cargarlo.",
  },
  {
    id: "rebote_temperatura",
    situationIds: ["se_despierta"],
    title: "Revisa que no tenga calor, frío o esté incómodo",
    detail: "Los despertares frecuentes a veces se deben a la temperatura del cuarto o de su ropa de dormir.",
  },
  {
    id: "rebote_sonido_continuo",
    situationIds: ["se_despierta"],
    title: "Deja el sonido ambiental encendido toda la noche",
    detail: "Un fondo sonoro constante reduce el impacto de ruidos que podrían despertarlo entre ciclos.",
  },

  // --- Madrugó ---
  {
    id: "madruga_oscuridad",
    situationIds: ["madruga"],
    title: "Mantén el cuarto completamente oscuro hasta la hora habitual",
    detail: "La luz de la madrugada es una señal fuerte para despertar. Cortinas oscuras marcan una gran diferencia.",
  },
  {
    id: "madruga_no_estimular",
    situationIds: ["madruga"],
    title: "Si aún es muy temprano, no lo estimules ni lo saques de la cuna",
    detail: "Entra en silencio, con luz tenue, y dale la oportunidad de retomar el sueño antes de iniciar el día.",
  },
  {
    id: "madruga_revisar_siesta_previa",
    situationIds: ["madruga"],
    title: "Anota la hora: podría ayudar a ajustar la siesta de mañana",
    detail: "Un despertar muy temprano puede relacionarse con el horario de la última siesta o de la cena.",
  },
];

// Estrategias generales de respaldo si ya se probaron todas las específicas.
export const FALLBACK_STRATEGY = {
  id: "fallback_general",
  title: "Dale contención cercana y constante unos minutos más",
  detail:
    "A veces el cuerpo necesita un poco más de tiempo. Mantén el ambiente calmado, oscuro y silencioso, y vuelve a intentarlo en unos minutos.",
};

export function getStrategiesFor(situationId) {
  return STRATEGIES.filter((s) => s.situationIds.includes(situationId));
}
