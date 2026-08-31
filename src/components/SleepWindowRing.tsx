import { Moon } from "lucide-react";

// Anillo de progreso propio para "Próximo descanso" — un SVG sencillo, sin
// librerías de terceros. Muestra de forma orientativa cuánto se ha avanzado
// dentro de la ventana de sueño esperada, nunca un cronómetro exacto al
// segundo. Puede marcar hitos (por ejemplo, cuándo se registró que empezó
// una siesta) como pequeños puntos sobre el arco.
export function SleepWindowRing({
  progress,
  milestones = [],
  size = 96,
}: {
  progress: number;
  milestones?: number[];
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(1, progress));
  const strokeWidth = Math.max(6, Math.round(size / 11));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);
  const center = size / 2;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeOpacity={0.3}
          strokeWidth={strokeWidth}
          strokeDasharray="1 9"
          strokeLinecap="round"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: "drop-shadow(0 0 6px hsl(var(--accent) / 0.7))",
            transition: "stroke-dashoffset 0.6s ease",
          }}
        />
        {milestones.map((fraction, i) => {
          const f = Math.max(0, Math.min(1, fraction));
          const angle = f * 2 * Math.PI;
          const mx = center + radius * Math.cos(angle);
          const my = center + radius * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={mx}
              cy={my}
              r={strokeWidth / 2 + 1.5}
              fill="hsl(var(--primary-foreground))"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Moon className="w-[32%] h-[32%] text-accent" strokeWidth={2} />
      </span>
    </div>
  );
}
