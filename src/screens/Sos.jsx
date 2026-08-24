import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch, sosUsesRemainingToday } from "../state/AppContext.jsx";
import { Button, Card, Badge } from "../components/ui.jsx";
import { formatAge, formatTime, isWithinNightRange } from "../lib/dateUtils.js";
import {
  SITUATIONS,
  PEDIATRIC_ALERT_QUESTIONS,
  PEDIATRIC_ALERT_MESSAGE,
  getStrategiesFor,
  FALLBACK_STRATEGY,
} from "../content/sosContent.js";
import { trackEvent } from "../lib/analytics.js";
import { EVENTS } from "../content/analyticsEvents.js";

function findLastLog(logs, type) {
  return logs.find((l) => l.type === type) || null;
}

function findLastNapRange(logs) {
  const lastStart = logs.find((l) => l.type === "nap_start");
  if (!lastStart) return null;
  const end = logs.find((l) => l.type === "nap_end" && new Date(l.timestamp) > new Date(lastStart.timestamp));
  return { start: lastStart.timestamp, end: end?.timestamp || null };
}

function timeAwakeSince(logs) {
  const candidates = ["wake", "nap_end"]
    .map((t) => findLastLog(logs, t))
    .filter(Boolean)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  if (!candidates[0]) return null;
  const mins = Math.round((Date.now() - new Date(candidates[0].timestamp).getTime()) / 60000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export default function Sos() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("chequeo"); // chequeo | alerta | estrategia | exito | agotado | limite
  const [situationId, setSituationId] = useState(null);
  const [alertFlags, setAlertFlags] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  const nightMode = isWithinNightRange(state.settings.nightModeStart, state.settings.nightModeEnd);
  const remainingToday = sosUsesRemainingToday(state);

  const context = useMemo(() => {
    const lastWake = findLastLog(state.sleepLogs, "wake");
    const lastNap = findLastNapRange(state.sleepLogs);
    return {
      age: state.child ? formatAge(state.child.birthDate) : null,
      wokeAt: lastWake ? formatTime(lastWake.timestamp) : null,
      lastNap: lastNap ? `${formatTime(lastNap.start)}${lastNap.end ? " – " + formatTime(lastNap.end) : ""}` : null,
      usualBedTime: state.child?.usualBedTime || null,
      awakeSince: timeAwakeSince(state.sleepLogs),
    };
  }, [state.child, state.sleepLogs]);

  function toggleAlertFlag(id) {
    setAlertFlags((flags) => (flags.includes(id) ? flags.filter((f) => f !== id) : [...flags, id]));
  }

  function startWithSituation(id) {
    setSituationId(id);
    if (alertFlags.length > 0) {
      setPhase("alerta");
      return;
    }
    proceedToStrategy(id);
  }

  function proceedToStrategy(sitId) {
    trackEvent(EVENTS.SOS_STARTED, { situation: sitId });
    dispatch({ type: "SOS_RESET_SESSION" });

    if (state.subscription.plan === "free" && remainingToday <= 0) {
      setPhase("limite");
      return;
    }
    if (state.subscription.plan === "free") {
      dispatch({ type: "SOS_INCREMENT_USAGE" });
    }

    const strategies = getStrategiesFor(sitId);
    const first = strategies[0];
    setCurrentStrategy(first || FALLBACK_STRATEGY);
    setUsedFallback(!first);
    setPhase("estrategia");
  }

  function handleTriedFallback() {
    // Uso del consejo general gratuito, sin contar contra el límite diario.
    setCurrentStrategy(FALLBACK_STRATEGY);
    setUsedFallback(true);
    setPhase("estrategia");
  }

  function handleWorked() {
    trackEvent(EVENTS.SOS_SUCCESSFUL, { situation: situationId, strategyId: currentStrategy?.id });
    trackEvent(EVENTS.SOS_COMPLETED, { situation: situationId, outcome: "success" });
    setPhase("exito");
  }

  function handleNotYet() {
    if (currentStrategy?.id) {
      dispatch({ type: "SOS_MARK_TRIED", strategyId: currentStrategy.id });
    }
    const strategies = getStrategiesFor(situationId);
    const tried = [...state.sos.sessionTried, currentStrategy?.id].filter(Boolean);
    const next = strategies.find((s) => !tried.includes(s.id));

    if (next) {
      setCurrentStrategy(next);
      setUsedFallback(false);
      setPhase("estrategia");
    } else if (!usedFallback) {
      setCurrentStrategy(FALLBACK_STRATEGY);
      setUsedFallback(true);
      setPhase("estrategia");
    } else {
      trackEvent(EVENTS.SOS_COMPLETED, { situation: situationId, outcome: "exhausted" });
      setPhase("agotado");
    }
  }

  function restart() {
    setPhase("chequeo");
    setSituationId(null);
    setAlertFlags([]);
    setCurrentStrategy(null);
    setUsedFallback(false);
    dispatch({ type: "SOS_RESET_SESSION" });
  }

  const sosButtonSize = nightMode ? "text-lg py-5" : "text-base py-4";

  return (
    <div className={`min-h-screen px-5 pt-6 pb-10 ${nightMode ? "bg-night-950" : ""}`}>
      <button onClick={() => navigate("/inicio")} className="text-moon-300 text-sm font-semibold mb-4">
        ✕ Cerrar
      </button>

      {phase === "chequeo" && (
        <>
          <h1 className="font-display text-2xl font-extrabold mb-1">Mi bebé no duerme</h1>
          <p className="text-moon-300 text-sm mb-5">Vamos a encontrar qué hacer ahora, paso a paso.</p>

          <Card className="mb-5 bg-night-800/60">
            <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-3">Lo que ya sabemos</p>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {context.age && (
                <>
                  <span className="text-white/50">Edad</span>
                  <span className="font-semibold">{context.age}</span>
                </>
              )}
              {context.wokeAt && (
                <>
                  <span className="text-white/50">Se despertó</span>
                  <span className="font-semibold">{context.wokeAt}</span>
                </>
              )}
              {context.lastNap && (
                <>
                  <span className="text-white/50">Última siesta</span>
                  <span className="font-semibold">{context.lastNap}</span>
                </>
              )}
              {context.awakeSince && (
                <>
                  <span className="text-white/50">Tiempo despierto</span>
                  <span className="font-semibold">{context.awakeSince}</span>
                </>
              )}
              {context.usualBedTime && (
                <>
                  <span className="text-white/50">Hora habitual de dormir</span>
                  <span className="font-semibold">{context.usualBedTime}</span>
                </>
              )}
            </div>
          </Card>

          <p className="text-sm font-bold text-white mb-3">¿Qué está pasando ahora?</p>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {SITUATIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => startWithSituation(s.id)}
                className={`bg-night-800 border-2 border-night-600 rounded-2xl ${sosButtonSize} px-3 flex flex-col items-center gap-2 active:scale-95 active:border-moon-500 transition-all`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-sm font-semibold text-center leading-tight">{s.label}</span>
              </button>
            ))}
          </div>

          <details className="mb-2">
            <summary className="text-xs text-white/40 font-semibold cursor-pointer select-none">
              ¿Notas algo más además del sueño? Tócalo aquí
            </summary>
            <div className="mt-3 flex flex-col gap-2">
              {PEDIATRIC_ALERT_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => toggleAlertFlag(q.id)}
                  className={`text-left text-sm rounded-xl px-3.5 py-2.5 border ${
                    alertFlags.includes(q.id)
                      ? "bg-alert-500/20 border-alert-500 text-alert-400"
                      : "bg-night-800 border-night-600 text-white/70"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </details>
        </>
      )}

      {phase === "alerta" && (
        <div className="flex flex-col items-center text-center pt-10">
          <div className="text-6xl mb-5">🩺</div>
          <h2 className="font-display text-xl font-extrabold mb-3 text-alert-400">{PEDIATRIC_ALERT_MESSAGE.title}</h2>
          <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-[320px]">{PEDIATRIC_ALERT_MESSAGE.body}</p>
          <Button size="lg" onClick={() => navigate("/inicio")}>
            {PEDIATRIC_ALERT_MESSAGE.cta}
          </Button>
        </div>
      )}

      {phase === "limite" && (
        <div className="flex flex-col items-center text-center pt-10">
          <div className="text-6xl mb-5">🌙</div>
          <h2 className="font-display text-xl font-extrabold mb-3">Ya usaste tu SOS de hoy</h2>
          <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-[320px]">
            El plan gratuito incluye 3 usos de SOS al día. Con Sueño+ tienes SOS ilimitado a cualquier hora.
          </p>
          <Button size="lg" onClick={() => navigate("/suscripcion")} className="mb-3">
            Ver Sueño+ 🌙
          </Button>
          <Button variant="ghost" size="sm" onClick={handleTriedFallback}>
            Prefiero un consejo general gratuito
          </Button>
        </div>
      )}

      {phase === "estrategia" && currentStrategy && (
        <div className="pt-4">
          <Badge tone="moon">Prueba esto primero</Badge>
          <h2 className="font-display text-2xl font-extrabold mt-4 mb-3 leading-tight">{currentStrategy.title}</h2>
          {currentStrategy.detail && <p className="text-white/70 text-sm leading-relaxed mb-8">{currentStrategy.detail}</p>}

          <p className="text-center text-sm font-bold text-moon-300 mb-3">¿Funcionó?</p>
          <div className="flex gap-3">
            <Button variant="success" size="lg" onClick={handleWorked}>
              😴 Sí, se durmió
            </Button>
            <Button variant="secondary" size="lg" onClick={handleNotYet}>
              😩 Todavía no
            </Button>
          </div>
        </div>
      )}

      {phase === "exito" && (
        <div className="flex flex-col items-center text-center pt-14">
          <div className="text-6xl mb-5 animate-breathe">🌙</div>
          <h2 className="font-display text-xl font-extrabold mb-3">Qué bueno, lo lograste</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-[300px]">
            Descansa un poco tú también. Guardamos esto para seguir ajustando su horario.
          </p>
          <Button size="lg" onClick={() => navigate("/inicio")}>
            Volver a inicio
          </Button>
        </div>
      )}

      {phase === "agotado" && (
        <div className="flex flex-col items-center text-center pt-14">
          <div className="text-6xl mb-5">🤍</div>
          <h2 className="font-display text-xl font-extrabold mb-3">Ya probamos varias opciones</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-[300px]">
            A veces el cuerpo solo necesita un poco más de tiempo y calma. Si algo te preocupa además del sueño, no dudes en contactar a tu pediatra.
          </p>
          <div className="flex flex-col gap-2.5 w-full">
            <Button size="lg" onClick={restart}>
              Volver a intentar
            </Button>
            <Button variant="secondary" size="md" onClick={() => navigate("/inicio")}>
              Volver a inicio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
