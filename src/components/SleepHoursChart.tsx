import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, type TooltipContentProps } from "recharts";
import type { DailySleepHours } from "@/services/sleepHoursEngine";
import { weekdayShort } from "@/utils/dateFormat";

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload as DailySleepHours;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-card">
      <p className="text-xs font-bold text-foreground">{weekdayShort(point.dateISO)}</p>
      <p className="text-xs text-muted-foreground">{point.hours} h de sueño</p>
    </div>
  );
}

export function SleepHoursChart({ data }: { data: DailySleepHours[] }) {
  return (
    <div className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="sleepBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="dateISO"
            tickFormatter={weekdayShort}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <Tooltip content={ChartTooltip} cursor={{ fill: "hsl(var(--primary))", opacity: 0.08 }} />
          <Bar dataKey="hours" fill="url(#sleepBarGradient)" radius={[8, 8, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
