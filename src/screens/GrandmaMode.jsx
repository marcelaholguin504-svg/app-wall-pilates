import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppContext.jsx";
import { formatTime, formatMinutesUntil } from "../lib/dateUtils.js";
import { getNextSleepEvent } from "../lib/sleepEngine.js";

export default function GrandmaMode() {
  const state = useAppState();
  const navigate = useNavigate();

  const nextEvent = useMemo(
    () => getNextSleepEvent(state.child, state.sleepLogs),
    [state.child, state.sleepLogs]
  );

  if (!state.child || !nextEvent) return null;

  const routineStart = new Date(nextEvent.date.getTime() - 20 * 60000);

  return (
    <div className="min-h-screen bg-night-950 flex flex-col px-6 py-8">
      <button onClick={() => navigate("/cuidadores")} className="text-moon-300 text-base font-bold mb-6 text-left">
        ← Salir del Modo Abuela
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-2xl text-white/70 mb-1">{state.child.name}</p>
        <p className="text-moon-300 text-lg font-bold uppercase tracking-wide mb-8">
          {nextEvent.type === "night" ? "Hora de dormir" : "Próxima siesta"}
        </p>
        <p className="font-display text-7xl font-extrabold mb-4">{formatTime(nextEvent.date)}</p>
        <p className="text-white/60 text-xl">Empieza a preparar en {formatMinutesUntil(routineStart)}</p>
      </div>

      <div className="flex flex-col gap-4 pb-4">
        <button
          onClick={() => navigate(`/rutinas/${nextEvent.type === "night" ? "nocturna" : "siesta"}`)}
          className="w-full rounded-3xl py-7 text-2xl font-display font-extrabold bg-gradient-to-br from-moon-500 to-moon-700 text-white shadow-glow active:scale-95 transition-transform"
        >
          🌙 Empezar rutina
        </button>
        <button
          onClick={() => navigate("/sos")}
          className="w-full rounded-3xl py-7 text-2xl font-display font-extrabold bg-gradient-to-br from-alert-400 to-alert-500 text-white shadow-glow active:scale-95 transition-transform"
        >
          🆘 No quiere dormir
        </button>
      </div>
    </div>
  );
}
