import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch } from "../state/AppContext.jsx";
import Screen from "../components/Screen.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { Button, Card, Badge } from "../components/ui.jsx";
import { formatAge, formatTime, formatMinutesUntil, isWithinNightRange } from "../lib/dateUtils.js";
import { getNextSleepEvent, getLastSleepRange, isAdaptiveScheduleActive } from "../lib/sleepEngine.js";
import { QUICK_LOG_TYPES, CAREGIVER_ROLES } from "../content/caregiverRoles.js";

function greeting(hour) {
  if (hour < 6) return "Buenas noches";
  if (hour < 12) return "Buenos días";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

export default function Home() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const nightMode =
    state.settings.nightModeAuto && isWithinNightRange(state.settings.nightModeStart, state.settings.nightModeEnd, now);

  const nextEvent = useMemo(() => getNextSleepEvent(state.child, state.sleepLogs, now), [state.child, state.sleepLogs, now]);
  const lastSleep = useMemo(() => getLastSleepRange(state.sleepLogs), [state.sleepLogs]);
  const adaptive = isAdaptiveScheduleActive(state.sleepLogs);

  const roleInfo = CAREGIVER_ROLES.find((r) => r.id === state.settings.activeCaregiverRole);
  const routineMinutesBefore = 20;

  function handleQuickLog(type) {
    dispatch({ type: "LOG_SLEEP_EVENT", logType: type.id });
    setToast(`${type.emoji} ${type.label} — registrado`);
    setTimeout(() => setToast(""), 2200);
  }

  function handleStartRoutine() {
    const routineType = nextEvent?.type === "night" ? "nocturna" : "siesta";
    navigate(`/rutinas/${routineType}`);
  }

  if (!state.child) return null;

  return (
    <Screen>
      <div className={`px-5 pt-8 ${nightMode ? "bg-night-950" : ""}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-moon-300 text-sm">
              {greeting(now.getHours())}, {roleInfo?.label.toLowerCase() || "cuidador"} {roleInfo?.emoji}
            </p>
            <h1 className="font-display text-2xl font-extrabold">
              {state.child.name} <span className="text-moon-300 font-semibold text-lg">· {formatAge(state.child.birthDate)}</span>
            </h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-moon-500 to-dawn-500 flex items-center justify-center text-xl shadow-glow shrink-0">
            {roleInfo?.emoji || "🌙"}
          </div>
        </div>

        {nextEvent && (
          <Card className="bg-gradient-to-br from-moon-700 via-moon-600 to-night-800 border-none mb-4 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <p className="uppercase text-[11px] tracking-widest font-bold text-white/70 mb-1">
              {nextEvent.type === "night" ? "Próximo sueño" : "Próxima siesta"}
              {adaptive && <span className="ml-2 normal-case font-medium">· ajustado a sus registros</span>}
            </p>
            <p className="font-display text-4xl font-extrabold text-white mb-1">{formatTime(nextEvent.date)}</p>
            <p className="text-white/80 text-sm mb-4">Empieza la rutina en: {formatMinutesUntil(new Date(nextEvent.date.getTime() - routineMinutesBefore * 60000))}</p>

            <div className="flex flex-col gap-2.5">
              <Button variant="secondary" className="!bg-white/15 !border-white/30" onClick={handleStartRoutine}>
                🌙 Empezar rutina
              </Button>
              <Button variant="sos" size={nightMode ? "lg" : "md"} onClick={() => navigate("/sos")}>
                🆘 Mi bebé no duerme
              </Button>
            </div>
          </Card>
        )}

        {!nextEvent && (
          <Button variant="sos" size="lg" className="mb-4" onClick={() => navigate("/sos")}>
            🆘 Mi bebé no duerme
          </Button>
        )}

        <Card className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-1">Último sueño</p>
          {lastSleep ? (
            <p className="text-white font-semibold">
              {formatTime(lastSleep.start)} {lastSleep.end ? `– ${formatTime(lastSleep.end)}` : "– en curso"}
            </p>
          ) : (
            <p className="text-white/50 text-sm">Aún no hay registros. Usa los botones de abajo para empezar.</p>
          )}
        </Card>

        <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-2.5 px-1">Registro rápido</p>
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {QUICK_LOG_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => handleQuickLog(type)}
              className="bg-night-800 border border-night-600 rounded-2xl py-4 px-2 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <span className="text-xl">{type.emoji}</span>
              <span className="text-[11px] font-semibold text-center leading-tight text-moon-300">+ {type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-night-700 border border-night-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-card z-[150] animate-fadeUp">
          {toast}
        </div>
      )}

      <BottomNav />
    </Screen>
  );
}
