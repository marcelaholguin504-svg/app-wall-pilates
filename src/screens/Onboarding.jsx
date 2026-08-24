import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../state/AppContext.jsx";
import { Button, Field, TextInput, SelectGrid, ProgressDots, BackButton } from "../components/ui.jsx";
import { SLEEP_ISSUES, CARE_OPTIONS } from "../content/onboardingContent.js";
import { trackEvent } from "../lib/analytics.js";
import { EVENTS } from "../content/analyticsEvents.js";

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    mainSleepIssue: "",
    usualWakeTime: "07:00",
    usualBedTime: "19:30",
    napsCount: 2,
    careOption: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    trackEvent(EVENTS.ONBOARDING_STARTED);
  }, []);

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
    setError("");
  }

  function validateStep() {
    if (step === 0 && !form.name.trim()) return "Escribe el nombre de tu bebé";
    if (step === 1 && !form.birthDate) return "Selecciona la fecha de nacimiento";
    if (step === 2 && !form.mainSleepIssue) return "Elige la opción que más se parece a tu situación";
    if (step === 4 && !form.careOption) return "Cuéntanos quién lo cuida normalmente";
    return "";
  }

  function goNext() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  }

  function finishOnboarding() {
    dispatch({
      type: "CREATE_CHILD",
      child: {
        name: form.name.trim(),
        birthDate: form.birthDate,
        mainSleepIssue: form.mainSleepIssue,
        usualWakeTime: form.usualWakeTime,
        usualBedTime: form.usualBedTime,
        napsCount: Number(form.napsCount),
        careOption: form.careOption,
      },
    });
    trackEvent(EVENTS.ONBOARDING_COMPLETED);
    setClosing(true);
    setTimeout(() => navigate("/inicio", { replace: true }), 1600);
  }

  function goBack() {
    if (step === 0) return;
    setStep(step - 1);
  }

  if (closing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <div className="text-6xl mb-5 animate-breathe">🌙</div>
        <h2 className="font-display text-xl font-extrabold mb-2">
          Estamos preparando el plan de sueño de {form.name}…
        </h2>
        <p className="text-moon-300 text-sm">Ya casi está listo</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-6 pb-10">
      <div className="mb-6">
        <ProgressDots total={TOTAL_STEPS} current={step} />
        <p className="text-xs text-moon-300 mt-2 font-semibold tracking-wide uppercase">
          Paso {step + 1} de {TOTAL_STEPS}
        </p>
      </div>

      <div className="flex-1">
        {step === 0 && (
          <div>
            <h2 className="font-display text-2xl font-extrabold mb-2">¿Cómo se llama tu bebé?</h2>
            <p className="text-moon-300 text-sm mb-6">Usaremos su nombre para personalizar su plan de sueño.</p>
            <Field label="Nombre del bebé">
              <TextInput
                autoFocus
                placeholder="Ej. Emma"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl font-extrabold mb-2">¿Cuál es su fecha de nacimiento?</h2>
            <p className="text-moon-300 text-sm mb-6">Así calculamos su edad y adaptamos las recomendaciones.</p>
            <Field label="Fecha de nacimiento">
              <TextInput
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={form.birthDate}
                onChange={(e) => update({ birthDate: e.target.value })}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-2xl font-extrabold mb-2">¿Cuál es su mayor reto con el sueño?</h2>
            <p className="text-moon-300 text-sm mb-6">Elige la opción que más se parece a lo que viven hoy.</p>
            <div className="flex flex-col gap-2.5">
              {SLEEP_ISSUES.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ mainSleepIssue: opt.id })}
                  className={`text-left rounded-2xl px-4 py-3.5 border-2 font-semibold transition-all ${
                    form.mainSleepIssue === opt.id
                      ? "bg-moon-500/20 border-moon-500"
                      : "bg-night-800 border-night-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-2xl font-extrabold mb-2">¿Cuáles son sus horarios habituales?</h2>
            <p className="text-moon-300 text-sm mb-6">
              No te preocupes si varían: son solo un punto de partida orientativo.
            </p>
            <Field label="Hora en que suele despertar">
              <TextInput type="time" value={form.usualWakeTime} onChange={(e) => update({ usualWakeTime: e.target.value })} />
            </Field>
            <Field label="Hora en que suele dormir en la noche">
              <TextInput type="time" value={form.usualBedTime} onChange={(e) => update({ usualBedTime: e.target.value })} />
            </Field>
            <Field label="Número de siestas al día">
              <TextInput
                type="number"
                min="0"
                max="5"
                value={form.napsCount}
                onChange={(e) => update({ napsCount: e.target.value })}
              />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display text-2xl font-extrabold mb-2">¿Quién lo cuida normalmente?</h2>
            <p className="text-moon-300 text-sm mb-6">
              Después podrás invitar a más personas en Modo Cuidador.
            </p>
            <SelectGrid options={CARE_OPTIONS} value={form.careOption} onChange={(id) => update({ careOption: id })} />
          </div>
        )}

        {error && <p className="text-alert-400 text-sm mt-4">{error}</p>}
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <Button size="lg" onClick={goNext}>
          {step === TOTAL_STEPS - 1 ? "Crear su plan de sueño →" : "Continuar"}
        </Button>
        {step > 0 && <BackButton onClick={goBack} />}
      </div>
    </div>
  );
}
