// Mensajes humanos y breves. Se muestran solo cuando son contextualmente
// relevantes, nunca de forma excesiva (ver principio de la sección 9).

export const EMOTIONAL_MESSAGES = [
  "Una noche difícil no significa que estés haciendo algo mal.",
  "Hoy puede ser diferente a ayer. Podemos ajustar el plan.",
  "No tienes que acertar con el minuto exacto.",
  "Vamos paso a paso.",
  "Esto puede ocurrir durante esta etapa.",
];

export function randomEmotionalMessage(): string {
  return EMOTIONAL_MESSAGES[Math.floor(Math.random() * EMOTIONAL_MESSAGES.length)];
}
