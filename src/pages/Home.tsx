import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch } from "@/hooks/useApp";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";
import ChildAvatar from "@/components/ChildAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { greeting, formatTime, daysAgo } from "@/utils/dateFormat";
import { computeNextSleepWindow, adjustOffset } from "@/services/sleepWindowEngine";
import type { HelpSituation } from "@/types";

const QUICK_SITUATIONS: { id: HelpSituation; emoji: string; label: string }[] = [
  { id: "no_duerme", emoji: "😣", label: "No logra dormirse" },
  { id: "desperto_no_vuelve", emoji: "🌙", label: "Se acaba de despertar" },
  { id: "multiples_despertares", emoji: "🔄", label: "Se está despertando muchas veces" },
  { id: "siesta_no_funciono", emoji: "💤", label: "Tenemos problemas con las siestas" },
  { id: "no_se_que_hacer", emoji: "🤍", label: "No sé qué hacer ahora" },
];

export default function Home() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const child = state.child;

  const window_ = useMemo(
    () => (child ? computeNextSleepWindow(child.ageStage, state.events, state.windowOffsetMinutes) : null),
    [child, state.events, state.windowOffsetMinutes]
  );

  const lastEvent = state.events[0];

  if (!child) return null;

  function goHelp(situation?: HelpSituation) {
    navigate("/ayudame-ahora", { state: situation ? { preselect: situation } : undefined });
  }

  function adjustWindow(direction: "earlier" | "later") {
    dispatch({ type: "SET_WINDOW_OFFSET", offset: adjustOffset(state.windowOffsetMinutes, direction) });
  }

  return (
    <Screen>
      <div className="px-5 pt-8">
        <div className="flex items-center gap-3.5 mb-5">
          <ChildAvatar photoDataUrl={child.photoDataUrl} size={52} />
          <div>
            <h1 className="font-display text-xl font-extrabold leading-tight">
              {greeting(new Date().getHours())}, {child.name} 🌙
            </h1>
            <p className="text-muted-foreground text-sm">
              {lastEvent ? `Último registro hace ${daysAgo(lastEvent.timestamp) === 0 ? "unas horas" : `${daysAgo(lastEvent.timestamp)} día(s)`}` : "Aún no hay registros hoy"}
            </p>
          </div>
        </div>

        <Card className="mb-5 bg-gradient-to-br from-primary/25 via-card to-card border-primary/30">
          <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1.5">Próximo descanso</p>
          {window_ ? (
            <>
              <p className="font-display text-2xl font-extrabold mb-1">
                {formatTime(window_.startISO)} – {formatTime(window_.endISO)}
              </p>
              <p className="text-muted-foreground text-xs mb-4">Observa también sus señales de sueño.</p>
              <div className="flex gap-2.5">
                <Button variant="secondary" size="sm" onClick={() => adjustWindow("earlier")}>
                  Ya tiene sueño
                </Button>
                <Button variant="secondary" size="sm" onClick={() => adjustWindow("later")}>
                  Todavía no
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed">
              No tenemos suficientes registros todavía. Registra cuándo se despierta y empezaremos a mostrarte su próxima ventana orientativa.
            </p>
          )}
        </Card>

        <p className="text-sm font-bold mb-3">¿Qué está pasando ahora?</p>
        <div className="flex flex-col gap-2.5 mb-6">
          {QUICK_SITUATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => goHelp(s.id)}
              className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 text-left touch-target active:scale-[0.98] transition-transform"
            >
              <span className="text-xl shrink-0">{s.emoji}</span>
              <span className="text-sm font-semibold">{s.label}</span>
            </button>
          ))}
        </div>

        <Button variant="accent" size="lg" onClick={() => goHelp()} className="animate-breathe">
          AYÚDAME AHORA
        </Button>
      </div>

      <BottomNav />
    </Screen>
  );
}
