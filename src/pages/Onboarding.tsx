import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChoiceCard, ChoiceGrid } from "@/components/ChoiceCard";
import ProgressDots from "@/components/ProgressDots";
import { AGE_STAGES, isToddlerStage } from "@/data/ageStages";
import { CAREGIVER_TYPES } from "@/data/caregiverTypes";
import { SLEEP_PROBLEM_OPTIONS, SCHEDULE_CONSISTENCY_OPTIONS, IMPROVEMENT_GOAL_OPTIONS } from "@/data/onboardingContent";
import { trackEvent } from "@/services/events";
import type { AgeStage, CaregiverType, ImprovementGoal, ScheduleConsistency, SleepProblem } from "@/types";

const TOTAL_STEPS = 6;

export default function Onboarding() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [ageStage, setAgeStage] = useState<AgeStage | "">("");
  const [caregiverType, setCaregiverType] = useState<CaregiverType | "">("");
  const [mainSleepProblem, setMainSleepProblem] = useState<SleepProblem | "">("");
  const [scheduleConsistency, setScheduleConsistency] = useState<ScheduleConsistency | "">("");
  const [improvementGoal, setImprovementGoal] = useState<ImprovementGoal | "">("");

  useEffect(() => {
    trackEvent("onboarding_iniciado");
  }, []);

  const toddler = ageStage ? isToddlerStage(ageStage as AgeStage) : false;
  const problemOptions = SLEEP_PROBLEM_OPTIONS.filter((o) => !o.toddlerOnly || toddler);
  const showSharedCareLine = caregiverType !== "mama" && caregiverType !== "papa";

  function validate(): string {
    if (step === 0 && !name.trim()) return "Cuéntanos cómo lo llamamos para continuar.";
    if (step === 1 && !ageStage) return "Elige la etapa que más se acerca.";
    if (step === 2 && !caregiverType) return "Elige quién suele acompañarlo a dormir.";
    if (step === 3 && !mainSleepProblem) return "Elige lo que más está costando ahora.";
    if (step === 4 && !scheduleConsistency) return "Elige la opción que más se parece a ustedes.";
    if (step === 5 && !improvementGoal) return "Elige qué te gustaría mejorar primero.";
    return "";
  }

  function goNext() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  function goBack() {
    setError("");
    if (step > 0) setStep(step - 1);
  }

  function finish() {
    dispatch({
      type: "CREATE_PROFILE",
      child: {
        name: name.trim(),
        ageStage: ageStage as AgeStage,
        caregiverType: caregiverType as CaregiverType,
        mainSleepProblem: mainSleepProblem as SleepProblem,
        scheduleConsistency: scheduleConsistency as ScheduleConsistency,
        improvementGoal: improvementGoal as ImprovementGoal,
      },
    });
    trackEvent("onboarding_completado");
    setClosing(true);
  }

  if (closing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <div className="text-6xl mb-5 animate-breathe">💜</div>
        <h1 className="font-display text-2xl font-extrabold mb-3">Ya tenemos un punto de partida 💜</h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-[300px] mb-2">
          Duerme Ya irá adaptándose a lo que registres y a lo que observes en {name.trim()}.
        </p>
        {showSharedCareLine && (
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[300px] mb-8">
            Esto también lo puede seguir quien más cuide a {name.trim()}.
          </p>
        )}
        <Button size="lg" onClick={() => navigate("/hoy", { replace: true })} className={showSharedCareLine ? "" : "mt-6"}>
          VER EL PLAN DE HOY
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-6 pb-10">
      <div className="mb-6">
        <ProgressDots total={TOTAL_STEPS} current={step} />
        <p className="text-xs text-muted-foreground mt-2 font-semibold tracking-wide uppercase">
          Paso {step + 1} de {TOTAL_STEPS}
        </p>
      </div>

      <div className="flex-1">
        {step === 0 && (
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-2">Vamos a conocer a tu pequeño 🌙</h1>
            <p className="text-muted-foreground text-sm mb-6">¿Cómo quieres que lo llamemos?</p>
            <Label htmlFor="child-name">Nombre o apodo</Label>
            <Input
              id="child-name"
              autoFocus
              placeholder="Ej. Mateo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-2">
              ¿Cuántos meses o años tiene {name.trim() || "tu pequeño"}?
            </h1>
            <ChoiceGrid
              options={AGE_STAGES}
              value={ageStage || null}
              onChange={(id) => setAgeStage(id as AgeStage)}
              columns={2}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-6">
              ¿Quién suele acompañar a {name.trim() || "tu pequeño"} a dormir?
            </h1>
            <ChoiceGrid
              options={CAREGIVER_TYPES}
              value={caregiverType || null}
              onChange={(id) => setCaregiverType(id as CaregiverType)}
              columns={2}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-6">¿Qué es lo que más está costando ahora?</h1>
            <div className="flex flex-col gap-2.5">
              {problemOptions.map((opt) => (
                <ChoiceCard
                  key={opt.id}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={mainSleepProblem === opt.id}
                  onClick={() => setMainSleepProblem(opt.id)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-6">¿Cómo suelen ser sus horarios?</h1>
            <div className="flex flex-col gap-2.5">
              {SCHEDULE_CONSISTENCY_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt.id}
                  label={opt.label}
                  selected={scheduleConsistency === opt.id}
                  onClick={() => setScheduleConsistency(opt.id)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-6">¿Qué te gustaría mejorar primero?</h1>
            <div className="flex flex-col gap-2.5">
              {IMPROVEMENT_GOAL_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt.id}
                  label={opt.label}
                  selected={improvementGoal === opt.id}
                  onClick={() => setImprovementGoal(opt.id)}
                />
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-destructive text-sm mt-4">{error}</p>}
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <Button size="lg" onClick={goNext}>
          {step === TOTAL_STEPS - 1 ? "Ver mi punto de partida" : "Continuar"}
        </Button>
        {step > 0 && (
          <Button variant="ghost" size="sm" onClick={goBack}>
            ← Atrás
          </Button>
        )}
      </div>
    </div>
  );
}
