// Capa de contenido: Sabiduría de las Abuelas.
// Clasificación honesta y explícita de cada técnica tradicional.
// "tradicional"  -> práctica de generaciones, sin evidencia suficiente para confirmar su efectividad.
// "respaldada"   -> compatible con evidencia o recomendaciones pediátricas actuales.
// "no_recomendada" -> práctica tradicional hoy considerada insegura o no recomendable.

export const WISDOM_CATEGORIES = {
  tradicional: {
    emoji: "👵",
    label: "Tradicional",
    description: "Usada por generaciones, sin evidencia científica suficiente para confirmar su efectividad.",
  },
  respaldada: {
    emoji: "🧠",
    label: "Respaldada",
    description: "Compatible con evidencia o recomendaciones pediátricas actuales.",
  },
  no_recomendada: {
    emoji: "🚫",
    label: "Ya no se recomienda",
    description: "Práctica tradicional hoy considerada insegura o no recomendable.",
  },
};

export const GRANDMA_WISDOM = [
  {
    id: "envolver_swaddle",
    title: "Envolver al bebé (fajar)",
    category: "respaldada",
    description:
      "Envolver de forma segura, sin apretar caderas ni cubrir la cabeza, puede ayudar a que el bebé se sienta contenido y duerma mejor. Se recomienda dejar de fajar en cuanto empieza a intentar girarse solo.",
  },
  {
    id: "sonido_shhh",
    title: "El 'shhh' cerca del oído",
    category: "respaldada",
    description:
      "El sonido constante imita el ambiente dentro del vientre y es una técnica de calma ampliamente usada y respaldada.",
  },
  {
    id: "mecer_en_brazos",
    title: "Mecer en brazos con movimiento rítmico",
    category: "respaldada",
    description: "El movimiento suave y repetitivo favorece la relajación y es una práctica segura a cualquier edad.",
  },
  {
    id: "acostar_boca_arriba",
    title: "Dormir siempre boca arriba, en superficie firme",
    category: "respaldada",
    description:
      "Es la posición recomendada por organizaciones pediátricas para reducir riesgos durante el sueño, sin almohadas, peluches ni bordes sueltos en la cuna.",
  },
  {
    id: "ajo_muneca",
    title: "Ponerle un manojo de ajo o azabache en la muñeca",
    category: "tradicional",
    description:
      "Una costumbre muy extendida para 'proteger' al bebé. No existe evidencia de que influya en el sueño; su valor es principalmente cultural y afectivo.",
  },
  {
    id: "agua_de_anis",
    title: "Darle agüita de anís o manzanilla para dormir",
    category: "no_recomendada",
    description:
      "Ofrecer líquidos distintos a la leche materna o fórmula en los primeros meses no se recomienda: puede interferir con la alimentación y no es una práctica seguida por pediatría actual. Consulta siempre antes de dar cualquier infusión.",
  },
  {
    id: "dormir_boca_abajo",
    title: "Acostarlo boca abajo porque 'duerme más profundo'",
    category: "no_recomendada",
    description:
      "Aunque es una creencia común y se ve más calmado, dormir boca abajo en los primeros meses ya no se recomienda por razones de seguridad. Usa siempre la posición boca arriba.",
  },
  {
    id: "ruido_de_casa",
    title: "No hacer silencio total en casa para que se acostumbre a dormir con ruido",
    category: "respaldada",
    description:
      "Acostumbrar al bebé a los sonidos cotidianos de la casa (sin ruidos súbitos o muy fuertes) puede ayudarlo a no depender de un silencio absoluto para dormir.",
  },
  {
    id: "mantita_en_cuna",
    title: "Ponerle cobijas, cojines o peluches sueltos en la cuna para que esté 'calientito'",
    category: "no_recomendada",
    description:
      "Los objetos sueltos dentro de la cuna aumentan el riesgo durante el sueño. Se recomienda una cuna despejada y usar ropa de dormir adecuada en su lugar.",
  },
  {
    id: "cantar_arrullo",
    title: "Cantarle el mismo arrullo cada noche",
    category: "respaldada",
    description:
      "Una melodía repetida se convierte en una señal reconocible de que es momento de dormir, y fortalece el vínculo con quien lo canta.",
  },
];
