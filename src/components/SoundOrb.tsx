import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

// Tratamiento elevado, solo para Sonidos — un momento de deleite, no un
// botón funcional más. Círculo más grande, degradado radial lavanda→dorado,
// halo de resplandor y un brillo superior sutil (efecto "glass" simple).
// Todo con CSS/paleta existente, sin assets externos.
export function SoundOrb({
  icon: Icon,
  active = false,
  className = "",
}: {
  icon: LucideIcon;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex items-center justify-center rounded-full shrink-0 w-[72px] h-[72px] overflow-hidden transition-shadow duration-300",
        active && "animate-breathe",
        className
      )}
      style={{
        background: "radial-gradient(circle at 32% 26%, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
        boxShadow: active ? "0 0 28px 6px hsl(var(--accent) / 0.5)" : "0 0 14px 2px hsl(var(--accent) / 0.22)",
      }}
    >
      <span className="pointer-events-none absolute inset-x-2.5 top-2 h-1/3 rounded-full bg-white/30 blur-[5px]" />
      <Icon className="relative w-7 h-7 text-primary-foreground" strokeWidth={2} />
    </span>
  );
}
