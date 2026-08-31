// Anillo de progreso propio para "Próximo descanso" — un SVG sencillo,
// sin librerías de terceros. Muestra de forma orientativa cuánto se ha
// avanzado dentro de la ventana de sueño esperada, nunca un cronómetro
// exacto al segundo.
export function SleepWindowRing({ progress, size = 64 }: { progress: number; size?: number }) {
  const clamped = Math.max(0, Math.min(1, progress));
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted-foreground))"
        strokeOpacity={0.3}
        strokeWidth={strokeWidth}
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{
          filter: "drop-shadow(0 0 5px hsl(var(--accent) / 0.7))",
          transition: "stroke-dashoffset 0.6s ease",
        }}
      />
    </svg>
  );
}
