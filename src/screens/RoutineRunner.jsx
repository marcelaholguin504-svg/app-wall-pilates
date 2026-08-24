import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState, useAppDispatch } from "../state/AppContext.jsx";
import { Button, Sheet, TextInput } from "../components/ui.jsx";
import { ROUTINE_TYPES, DEFAULT_ROUTINES } from "../content/routines.js";
import { generateId } from "../lib/ids.js";

const COMPLETION_LOG = {
  nocturna: { type: "sleep", label: "Registrar que se durmió" },
  siesta: { type: "nap_start", label: "Registrar inicio de siesta" },
  despertar: { type: "wake", label: "Registrar que se despertó" },
};

export default function RoutineRunner() {
  const { type } = useParams();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const info = ROUTINE_TYPES[type];
  const steps = state.routines[type] || DEFAULT_ROUTINES[type];

  const [mode, setMode] = useState("preview"); // preview | running | done
  const [current, setCurrent] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draftSteps, setDraftSteps] = useState(steps);

  if (!info) return null;

  function startRoutine() {
    setCurrent(0);
    setMode("running");
  }

  function nextStep() {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      setMode("done");
    }
  }

  function prevStep() {
    if (current > 0) setCurrent(current - 1);
  }

  function saveEdits() {
    const cleaned = draftSteps.filter((s) => s.text.trim());
    dispatch({ type: "UPDATE_ROUTINE", routineType: type, steps: cleaned });
    setEditing(false);
  }

  function logCompletion() {
    dispatch({ type: "LOG_SLEEP_EVENT", logType: COMPLETION_LOG[type].type });
    navigate("/inicio");
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10 flex flex-col">
      <button onClick={() => navigate("/rutinas")} className="text-moon-300 text-sm font-semibold mb-4 text-left">
        ← Rutinas
      </button>

      {mode === "preview" && (
        <>
          <div className="text-5xl mb-4">{info.emoji}</div>
          <h1 className="font-display text-2xl font-extrabold mb-1">{info.label}</h1>
          <p className="text-moon-300 text-sm mb-6">{steps.length} pasos, en orden</p>

          <div className="flex flex-col gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 bg-night-800 border border-night-600 rounded-xl px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-moon-500/30 text-moon-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-white/90">{s.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-2.5">
            <Button size="lg" onClick={startRoutine}>
              Empezar rutina →
            </Button>
            <Button variant="secondary" onClick={() => setEditing(true)}>
              ✏️ Editar pasos
            </Button>
          </div>
        </>
      )}

      {mode === "running" && (
        <div className="flex-1 flex flex-col">
          <div className="flex gap-1.5 mb-8">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= current ? "bg-moon-500" : "bg-night-600"}`} />
            ))}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <p className="text-moon-300 text-sm font-bold uppercase tracking-wide mb-4">
              Paso {current + 1} de {steps.length}
            </p>
            <p className="font-display text-2xl font-extrabold leading-snug">{steps[current].text}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button size="lg" onClick={nextStep}>
              {current === steps.length - 1 ? "Terminar rutina ✓" : "Siguiente paso →"}
            </Button>
            {current > 0 && (
              <Button variant="ghost" size="sm" onClick={prevStep}>
                ← Paso anterior
              </Button>
            )}
          </div>
        </div>
      )}

      {mode === "done" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="text-6xl mb-5 animate-breathe">🌙</div>
          <h2 className="font-display text-xl font-extrabold mb-3">Rutina completa</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-[280px]">
            Buen trabajo siguiendo cada paso. ¿Quieres registrarlo?
          </p>
          <div className="flex flex-col gap-2.5 w-full">
            <Button size="lg" onClick={logCompletion}>
              {COMPLETION_LOG[type].label}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/inicio")}>
              Volver a inicio
            </Button>
          </div>
        </div>
      )}

      <Sheet open={editing} onClose={() => setEditing(false)}>
        <h3 className="font-display text-lg font-extrabold mb-4">Editar {info.label.toLowerCase()}</h3>
        <div className="flex flex-col gap-2.5 mb-4">
          {draftSteps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <TextInput
                value={s.text}
                onChange={(e) => {
                  const copy = [...draftSteps];
                  copy[i] = { ...copy[i], text: e.target.value };
                  setDraftSteps(copy);
                }}
              />
              <button
                onClick={() => setDraftSteps(draftSteps.filter((_, idx) => idx !== i))}
                className="text-alert-400 text-xl px-2"
                aria-label="Eliminar paso"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setDraftSteps([...draftSteps, { id: generateId("step"), text: "" }])}
          className="text-moon-300 text-sm font-semibold mb-6"
        >
          + Añadir paso
        </button>
        <Button onClick={saveEdits}>Guardar cambios</Button>
      </Sheet>
    </div>
  );
}
