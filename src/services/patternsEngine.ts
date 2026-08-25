// Patrones simples y honestos, sin puntajes ni alertas rojas (ver sección 13).
// Reglas transparentes basadas en conteos de registros — nada de IA ni
// diagnóstico.

import type { SleepEvent } from "@/types";

export interface PatternInsight {
  id: string;
  text: string;
}

const DAY_MS = 86400000;

export function buildPatternInsights(events: SleepEvent[]): PatternInsight[] {
  const distinctDays = new Set(events.map((e) => new Date(e.timestamp).toDateString()));
  if (events.length < 5 || distinctDays.size < 2) return [];

  const now = Date.now();
  const insights: PatternInsight[] = [];

  const nightWakes = events.filter((e) => e.type === "night_wake");
  const recent3 = nightWakes.filter((e) => now - new Date(e.timestamp).getTime() <= 3 * DAY_MS).length;
  const prior3 = nightWakes.filter((e) => {
    const diff = now - new Date(e.timestamp).getTime();
    return diff > 3 * DAY_MS && diff <= 6 * DAY_MS;
  }).length;
  if (recent3 > 0 || prior3 > 0) {
    if (recent3 > prior3) {
      insights.push({ id: "wakes_up", text: "Esta semana hubo más despertares nocturnos que la semana anterior." });
    } else if (recent3 < prior3) {
      insights.push({ id: "wakes_down", text: "Esta semana hubo menos despertares nocturnos que la semana anterior." });
    } else {
      insights.push({ id: "wakes_same", text: "Los despertares nocturnos se mantuvieron parecidos a la semana anterior." });
    }
  }

  const napStarts = events.filter((e) => e.type === "nap_start" && now - new Date(e.timestamp).getTime() <= 3 * DAY_MS);
  if (napStarts.length >= 2) {
    const morningCount = napStarts.filter((e) => new Date(e.timestamp).getHours() < 12).length;
    if (morningCount / napStarts.length >= 0.6) {
      insights.push({ id: "naps_morning", text: "Durante los últimos días, las siestas fueron más frecuentes en la mañana." });
    }
  }

  const nightSleeps = events.filter((e) => e.type === "night_sleep" && now - new Date(e.timestamp).getTime() <= 7 * DAY_MS);
  if (nightSleeps.length >= 3) {
    insights.push({
      id: "consistency",
      text: `Registraste el inicio del sueño nocturno ${nightSleeps.length} veces esta semana.`,
    });
  }

  return insights;
}
