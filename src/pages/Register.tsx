import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sunrise, Moon, Sun, MoonStar, Eye, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppState, useAppDispatch } from "@/hooks/useApp";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/IconBadge";
import { formatDayTime } from "@/utils/dateFormat";
import type { SleepEventType } from "@/types";

const EVENT_TYPES: { id: SleepEventType; icon: LucideIcon; label: string }[] = [
  { id: "wake", icon: Sunrise, label: "Despertó" },
  { id: "nap_start", icon: Moon, label: "Empezó una siesta" },
  { id: "nap_end", icon: Sun, label: "Terminó una siesta" },
  { id: "night_sleep", icon: MoonStar, label: "Se durmió por la noche" },
  { id: "night_wake", icon: Eye, label: "Despertar nocturno" },
];

function eventLabel(type: SleepEventType) {
  return EVENT_TYPES.find((e) => e.id === type)?.label || type;
}

function eventIcon(type: SleepEventType): LucideIcon {
  return EVENT_TYPES.find((e) => e.id === type)?.icon || Moon;
}

export default function RegisterPage() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const child = state.child;
  if (!child) return null;

  function logEvent(type: SleepEventType) {
    dispatch({ type: "ADD_EVENT", eventType: type });
    setToast(`${eventLabel(type)} — registrado`);
    setTimeout(() => setToast(""), 2000);
  }

  const todayEvents = state.events.filter((e) => new Date(e.timestamp).toDateString() === new Date().toDateString());

  return (
    <Screen>
      <div className="px-5 pt-8">
        <h1 className="font-display text-2xl font-extrabold mb-1">Registrar</h1>
        <p className="text-muted-foreground text-sm mb-6">Un toque es suficiente. Nada más que registrar aquí.</p>

        <div className="grid grid-cols-2 gap-2.5 mb-8">
          {EVENT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => logEvent(type.id)}
              className="bg-card border border-border rounded-2xl py-5 px-3 flex flex-col items-center gap-2 touch-target active:scale-95 transition-transform"
            >
              <IconBadge icon={type.icon} />
              <span className="text-xs font-semibold text-center leading-tight">{type.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end mb-2">
          <button onClick={() => navigate("/patrones")} className="flex items-center gap-1 text-xs font-bold text-primary">
            <TrendingUp className="w-3.5 h-3.5" /> Ver patrones →
          </button>
        </div>

        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2.5 px-1">Hoy</p>
        <div className="flex flex-col gap-2">
          {todayEvents.length === 0 && (
            <Card>
              <p className="text-sm text-muted-foreground">Aún no has registrado nada hoy.</p>
            </Card>
          )}
          {todayEvents.map((e) => (
            <Card key={e.id} className="flex items-center gap-3 py-3">
              <IconBadge icon={eventIcon(e.type)} size="sm" />
              <span className="flex-1 text-sm font-semibold">{eventLabel(e.type)}</span>
              <span className="text-xs text-muted-foreground">{formatDayTime(e.timestamp)}</span>
              <button
                onClick={() => dispatch({ type: "DELETE_EVENT", id: e.id })}
                className="text-muted-foreground/60 text-lg px-1 touch-target"
                aria-label="Eliminar registro"
              >
                ×
              </button>
            </Card>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-card border border-border text-foreground text-sm font-semibold px-5 py-3 rounded-full shadow-card z-[150] animate-fadeUp">
          {toast}
        </div>
      )}

      <BottomNav />
    </Screen>
  );
}
