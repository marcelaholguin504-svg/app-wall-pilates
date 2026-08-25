import type { EducationalArticle, SleepProblem } from "@/types";

// Contenido educativo breve, mostrado según el problema principal registrado
// en el perfil (ver sección 15). Nada de artículos largos.

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: "despertares_por_que",
    title: "¿Por qué puede despertarse tantas veces?",
    minutes: 3,
    problems: ["despierta_muchas_veces", "cada_noche_diferente"],
    body: "Los ciclos de sueño son más cortos en los primeros años, así que despertar entre ciclos es esperable. Lo que suele cambiar es si logra retomar el sueño solo o necesita ayuda cada vez. Eso no es un error tuyo: es parte de cómo se está desarrollando su sueño.",
  },
  {
    id: "despertares_revisar",
    title: "Qué revisar antes del próximo despertar",
    minutes: 2,
    problems: ["despierta_muchas_veces", "cada_noche_diferente"],
    body: "Antes de decidir qué hacer, revisa lo básico: temperatura del cuarto, comodidad de la ropa, si comió lo suficiente antes de dormir y si hubo algún cambio en la rutina de hoy. A veces la respuesta está en algo simple.",
  },
  {
    id: "cuesta_dormirse_normal",
    title: "Qué puede ser normal a esta etapa",
    minutes: 2,
    problems: ["cuesta_dormirse", "no_queda_en_cama"],
    body: "Costarle quedarse dormido puede relacionarse con el tiempo despierto antes de la rutina, con estímulo de más cerca de la hora de dormir, o simplemente con la etapa que está viviendo. No siempre hay una sola causa.",
  },
  {
    id: "cuesta_dormirse_rutina",
    title: "El papel de una señal constante",
    minutes: 2,
    problems: ["cuesta_dormirse"],
    body: "Repetir la misma señal (una frase, una canción, el mismo orden de pasos) ayuda a que el cuerpo reconozca que se acerca el sueño. No necesita ser perfecta ni larga, solo constante.",
  },
  {
    id: "acompanado_apego",
    title: "¿Por qué solo duerme si estás cerca?",
    minutes: 3,
    problems: ["solo_duerme_acompanado"],
    body: "Buscar cercanía para dormir es una respuesta natural, no una mala costumbre. Si quieres ir ajustándolo gradualmente, los cambios pequeños y constantes suelen sostenerse mejor que los cambios bruscos de una noche a otra.",
  },
  {
    id: "madruga_luz",
    title: "El papel de la luz en las madrugadas",
    minutes: 2,
    problems: ["madruga"],
    body: "La luz de la madrugada es una de las señales más fuertes para el cuerpo. Un cuarto bien oscuro hasta la hora habitual puede ayudar a sostener el sueño un poco más.",
  },
  {
    id: "siestas_cortas",
    title: "Por qué las siestas pueden ser tan cortas",
    minutes: 3,
    problems: ["siestas_dificiles"],
    body: "Un ciclo de siesta suele durar lo mismo que un ciclo nocturno corto. Si termina rápido, no significa que algo esté mal: es el mismo mecanismo, solo que de día es más fácil despertar del todo.",
  },
  {
    id: "siestas_ventana",
    title: "Ajustar la ventana antes de la siesta",
    minutes: 2,
    problems: ["siestas_dificiles"],
    body: "Si el tiempo despierto antes de la siesta es muy corto o muy largo, puede costarle más conciliar el sueño. Ir ajustando de a poco esa ventana suele ayudar más que cambiar todo de golpe.",
  },
  {
    id: "toddler_limites",
    title: "Límites cálidos en esta etapa",
    minutes: 3,
    problems: ["no_queda_en_cama", "negocia_hora_dormir"],
    body: "A esta edad es común que busquen extender la hora de dormir: es parte de cómo exploran su independencia. Mantener el mismo límite, con calma y sin abrir grandes negociaciones, suele funcionar mejor que cambiar la regla cada noche.",
  },
  {
    id: "toddler_eleccion",
    title: "Dar una elección pequeña, sin perder el límite",
    minutes: 2,
    problems: ["no_queda_en_cama", "negocia_hora_dormir"],
    body: "Ofrecer una decisión pequeña dentro de la rutina (qué cuento, qué peluche, luz sí o no) puede darle sensación de control sin que eso mueva la hora real de dormir.",
  },
  {
    id: "cada_noche_diferente_explicacion",
    title: "Cuando cada noche parece distinta",
    minutes: 2,
    problems: ["cada_noche_diferente"],
    body: "El sueño infantil no siempre es lineal: una buena noche no garantiza la siguiente. Observar patrones a lo largo de varios días, no de una sola noche, suele dar una imagen más clara.",
  },
];

export function articlesForProblem(problemId: SleepProblem, limit = 3): EducationalArticle[] {
  return EDUCATIONAL_ARTICLES.filter((a) => a.problems.includes(problemId)).slice(0, limit);
}
