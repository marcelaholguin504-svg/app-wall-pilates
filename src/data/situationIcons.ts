import { Moon, Eye, RefreshCcw, Frown, CloudMoon, HeartHandshake, Thermometer, Wind, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HelpSituation, SafetyFlag } from "@/types";

// Un solo ícono por situación/flag, reutilizado en Hoy y en Ayúdame Ahora
// para que el mismo concepto siempre se vea igual en toda la app.

export const SITUATION_ICONS: Record<HelpSituation, LucideIcon> = {
  no_duerme: Moon,
  desperto_no_vuelve: Eye,
  multiples_despertares: RefreshCcw,
  llorando_inquieto: Frown,
  siesta_no_funciono: CloudMoon,
  no_se_que_hacer: HeartHandshake,
};

export const SAFETY_FLAG_ICONS: Record<SafetyFlag, LucideIcon> = {
  solo_sueno: Moon,
  fiebre: Thermometer,
  respiracion: Wind,
  prefiero_no_responder: HelpCircle,
};
