import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

// Contenedor circular con fondo suave para íconos de Lucide, en vez de
// emojis sueltos (se ven distinto entre dispositivos y dan sensación de
// plantilla genérica). Usa únicamente los tokens de color ya definidos en
// index.css/tailwind.config.ts — nunca colores nuevos.

const TONES = {
  primary: "bg-primary/20 text-primary",
  accent: "bg-accent/20 text-accent",
  muted: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/20 text-destructive",
  success: "bg-success/20 text-success",
} as const;

const SIZES = {
  sm: { box: "w-8 h-8", icon: "w-4 h-4" },
  md: { box: "w-10 h-10", icon: "w-5 h-5" },
  lg: { box: "w-16 h-16", icon: "w-8 h-8" },
} as const;

export type IconBadgeTone = keyof typeof TONES;
export type IconBadgeSize = keyof typeof SIZES;

export function IconBadge({
  icon: Icon,
  tone = "primary",
  size = "md",
  className = "",
}: {
  icon: LucideIcon;
  tone?: IconBadgeTone;
  size?: IconBadgeSize;
  className?: string;
}) {
  const { box, icon } = SIZES[size];
  return (
    <span className={cn("inline-flex items-center justify-center rounded-full shrink-0", TONES[tone], box, className)}>
      <Icon className={icon} strokeWidth={2} />
    </span>
  );
}
