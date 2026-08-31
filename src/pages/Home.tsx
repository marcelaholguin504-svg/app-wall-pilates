import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon } from "lucide-react";
import { useAppState, useAppDispatch } from "@/hooks/useApp";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";
import ChildAvatar from "@/components/ChildAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/IconBadge";
import { SleepWindowRing } from "@/components/SleepWindowRing";
import { greeting, formatTime, daysAgo } from "@/utils/dateFormat";
import { computeNextSleepWindow, computeWindowProgress, adjustOffset } from "@/services/sleepWindowEngine";
import { minutesUntilSleepWindow } from "@/services/proactiveAlertEngine";
import { SITUATION_ICONS } from "@/data/situationIcons";
import type { HelpSituation } from "@/types";

const QUICK_SITUATIONS: { id: HelpSituation; label: string }[] = [
  { id: "no_duerme", label: "No logra dormirse" },
  { id: "desperto_no_vuelve", label: "Se acaba de despertar" },
  { id: "multiples_despertares", label: "Se está despertando muchas veces" },
  { id: "siesta_no_funciono", label: "Tenemos problemas con las siestas" },
  { id: "no_se_que_hacer", label: "No sé qué hacer ahora" },
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

  // Se recalcula cada minuto para que el aviso proactivo aparezca y
  // desaparezca solo mientras la pantalla sigue abierta, sin recargar.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const minutesUntilWindow = useMemo(
    () => minutesUntilSleepWindow(window_, state.events, now),
    [window_, state.events, now]
  );

  const windowProgress = useMemo(() => (window_ ? computeWindowProgress(window_, now) : 0), [window_, now]);

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
            <h1 className="font-display text-xl font-extrabold leading-tight flex items-center gap-2">
              <span>
                {greeting(new Date().getHours())}, {child.name}
              </span>
              <IconBadge icon={Moon} size="sm" />
            </h1>
            <p className="text-muted-foreground text-sm">
              {lastEvent ? `Último registro hace ${daysAgo(lastEvent.timestamp) === 0 ? "unas horas" : `${daysAgo(lastEvent.timestamp)} día(s)`}` : "Aún no hay registros hoy"}
            </p>
          </div>
        </div>

        {minutesUntilWindow !== null && (
          <div className="mb-5 rounded-2xl border-2 border-accent/40 bg-accent/10 p-4 flex items-start gap-3 animate-fadeUp">
            <IconBadge icon={Moon} tone="accent" />
            <p className="text-sm leading-relaxed text-foreground/90">
              {child.name} podría estar empezando a cansarse. No es que hagas algo mal — solo es su momento. Faltan
              aproximadamente {minutesUntilWindow} minutos para su ventana de sueño.
            </p>
          </div>
        )}

        <Card className="mb-5 bg-gradient-to-br from-primary/25 via-card to-card border-primary/30">
          <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1.5">Próximo descanso</p>
          {window_ ? (
            <div className="flex items-center gap-4">
              <SleepWindowRing progress={windowProgress} size={60} />
              <div className="flex-1 min-w-0">
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
              </div>
            </div>
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
              <IconBadge icon={SITUATION_ICONS[s.id]} />
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
