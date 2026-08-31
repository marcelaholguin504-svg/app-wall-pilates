import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { IconBadge, type IconBadgeTone } from "@/components/IconBadge";

export function ChoiceCard({
  emoji,
  icon,
  iconTone = "primary",
  label,
  selected,
  onClick,
  className = "",
}: {
  emoji?: string;
  icon?: LucideIcon;
  iconTone?: IconBadgeTone;
  label: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-2xl px-4 py-4 border-2 font-semibold transition-all touch-target flex items-center gap-3 active:scale-[0.98]",
        selected ? "bg-primary/20 border-primary scale-[1.01]" : "bg-card border-border",
        className
      )}
    >
      {icon && <IconBadge icon={icon} tone={selected ? "primary" : iconTone} />}
      {!icon && emoji && <span className="text-2xl shrink-0">{emoji}</span>}
      <span className="text-sm leading-snug">{label}</span>
    </button>
  );
}

export function ChoiceGrid({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: { id: string; emoji?: string; icon?: LucideIcon; label: string }[];
  value: string | null;
  onChange: (id: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-2.5", columns === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {options.map((opt) => (
        <ChoiceCard
          key={opt.id}
          emoji={opt.emoji}
          icon={opt.icon}
          label={opt.label}
          selected={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={columns === 2 ? "flex-col text-center items-center py-5" : ""}
        />
      ))}
    </div>
  );
}
