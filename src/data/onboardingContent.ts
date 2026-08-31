import { Moon, Frown, Users, AlarmClock, CloudMoon, RefreshCcw, BedDouble, MessageCircle, type LucideIcon } from "lucide-react";
import type { ImprovementGoal, ScheduleConsistency, SleepProblem } from "@/types";

export const SLEEP_PROBLEM_OPTIONS: { id: SleepProblem; icon: LucideIcon; label: string; toddlerOnly?: boolean }[] = [
  { id: "despierta_muchas_veces", icon: Moon, label: "Se despierta muchas veces" },
  { id: "cuesta_dormirse", icon: Frown, label: "Le cuesta quedarse dormido" },
  { id: "solo_duerme_acompanado", icon: Users, label: "Solo duerme si alguien está cerca" },
  { id: "madruga", icon: AlarmClock, label: "Se despierta demasiado temprano" },
  { id: "siestas_dificiles", icon: CloudMoon, label: "Las siestas son difíciles o muy cortas" },
  { id: "cada_noche_diferente", icon: RefreshCcw, label: "Cada noche parece diferente" },
  { id: "no_queda_en_cama", icon: BedDouble, label: "No quiere quedarse en su cama/cuna", toddlerOnly: true },
  { id: "negocia_hora_dormir", icon: MessageCircle, label: "Negocia o pide cosas para retrasar la hora de dormir", toddlerOnly: true },
];

export const SCHEDULE_CONSISTENCY_OPTIONS: { id: ScheduleConsistency; label: string }[] = [
  { id: "rutina_clara", label: "Tenemos una rutina bastante clara." },
  { id: "intentamos_pero_cambia", label: "Intentamos tenerla, pero cambia." },
  { id: "depende_del_dia", label: "Depende mucho del día." },
  { id: "sin_rutina_definida", label: "No tenemos una rutina definida." },
  { id: "no_se_que_probar", label: "Ya no sé qué horario probar." },
];

export const IMPROVEMENT_GOAL_OPTIONS: { id: ImprovementGoal; label: string }[] = [
  { id: "dormirse_con_menos_dificultad", label: "Que se duerma con menos dificultad." },
  { id: "reducir_despertares", label: "Reducir los despertares." },
  { id: "rutina_predecible", label: "Tener una rutina más predecible." },
  { id: "mejorar_siestas", label: "Mejorar las siestas." },
  { id: "saber_que_hacer_al_despertar", label: "Saber qué hacer cuando se despierta." },
  { id: "sentir_que_tengo_un_plan", label: "Sentir que tengo un plan." },
];
