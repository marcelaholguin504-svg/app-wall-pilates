import { useMemo } from "react";
import { useAppState } from "@/hooks/useApp";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { SleepHoursChart } from "@/components/SleepHoursChart";
import { buildPatternInsights } from "@/services/patternsEngine";
import { computeDailySleepHours, hasEnoughDataForChart } from "@/services/sleepHoursEngine";

export default function Patterns() {
  const state = useAppState();
  const insights = useMemo(() => buildPatternInsights(state.events), [state.events]);
  const dailyHours = useMemo(() => computeDailySleepHours(state.events), [state.events]);
  const showChart = hasEnoughDataForChart(dailyHours);

  const child = state.child;
  if (!child) return null;

  return (
    <Screen>
      <div className="px-5 pt-8">
        <h1 className="font-display text-2xl font-extrabold mb-1">Patrones</h1>
        <p className="text-muted-foreground text-sm mb-6">Lo que estamos observando en {child.name}</p>

        <Card className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Horas de sueño — últimos 7 días
          </p>
          {showChart ? (
            <SleepHoursChart data={dailyHours} />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              No tenemos suficientes registros todavía. Sigue usando Duerme Ya y empezaremos a mostrarte patrones.
            </p>
          )}
        </Card>

        {insights.length === 0 ? (
          <Card>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No tenemos suficientes registros todavía. Sigue usando Duerme Ya y empezaremos a mostrarte patrones.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <p className="text-sm leading-relaxed">{insight.text}</p>
              </Card>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground/70 leading-relaxed mt-6 text-center px-4">
          Estas observaciones son orientativas y se basan solo en lo que has registrado.
        </p>
      </div>
      <BottomNav />
    </Screen>
  );
}
