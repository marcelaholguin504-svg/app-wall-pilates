import { Moon, Star, ArrowRight, Circle } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";

// Ilustraciones genéricas para los bloques de aprendizaje del quiz — CSS y
// componentes ya existentes (IconBadge, Lucide), sin datos del bebé de
// quien responde y sin generar ninguna imagen nueva. Mismo lenguaje visual
// que el resto de la app (paleta, degradados, IconBadge).

const GENERIC_AGE_WINDOWS: { label: string; widthPct: number }[] = [
  { label: "0-3 meses", widthPct: 35 },
  { label: "4-6 meses", widthPct: 55 },
  { label: "7-12 meses", widthPct: 75 },
  { label: "1-2 años", widthPct: 88 },
  { label: "2-3 años", widthPct: 100 },
];

// Bloque 1: franjas horizontales genéricas por edad (mismo estilo de barra
// con degradado que ya usa SleepHoursChart en Patrones, pero como CSS puro
// — no hay datos reales de nadie aquí, solo una referencia ilustrativa).
export function AwakeWindowsIllustration() {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {GENERIC_AGE_WINDOWS.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-20 shrink-0">{row.label}</span>
          <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${row.widthPct}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-muted-foreground/70 text-center mt-1">
        Tiempo típico despierto antes del próximo sueño, según la edad — orientativo, no de tu bebé.
      </p>
    </div>
  );
}

// Bloque 2: muchas ramas a la vez (confuso) vs. un solo paso claro.
export function SingleStepPathIllustration() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div>
        <p className="text-xs font-bold text-muted-foreground mb-2">Diez sugerencias a la vez</p>
        <div className="flex items-center gap-1.5 flex-wrap opacity-60">
          {Array.from({ length: 6 }).map((_, i) => (
            <Circle key={i} className="w-3.5 h-3.5 text-muted-foreground" fill="currentColor" />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-primary mb-2">Una acción clara</p>
        <div className="flex items-center gap-2">
          <IconBadge icon={ArrowRight} tone="accent" size="sm" />
          <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>
      </div>
    </div>
  );
}

// Bloque 3: siluetas cálidas de lunas/estrellas — decorativo, sin gráfico de datos.
export function WarmCommunityIllustration() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <IconBadge icon={Star} tone="muted" size="sm" className="opacity-60" />
      <IconBadge icon={Moon} tone="primary" size="md" />
      <IconBadge icon={Star} tone="accent" size="lg" className="animate-breathe" />
      <IconBadge icon={Moon} tone="primary" size="sm" className="opacity-80" />
      <IconBadge icon={Star} tone="muted" size="sm" className="opacity-60" />
    </div>
  );
}
