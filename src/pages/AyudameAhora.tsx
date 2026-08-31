import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChoiceCard } from "@/components/ChoiceCard";
import { SITUATION_OPTIONS, FOLLOW_UP_QUESTIONS } from "@/data/guidanceContent";
import { SAFETY_FILTER_QUESTION, SAFETY_FILTER_OPTIONS } from "@/data/safetyContent";
import { getGuidanceOutcome, getSafetyAlertContent } from "@/services/guidanceEngine";
import { trackEvent } from "@/services/events";
import type { HelpSituation, SafetyFlag } from "@/types";

type Phase = "entrada" | "seguridad" | "alerta" | "seguimiento" | "recomendacion" | "alternativa" | "exito" | "agotado";

export default function AyudameAhora() {
  const state = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const preselect = (location.state as { preselect?: HelpSituation } | null)?.preselect;

  const [phase, setPhase] = useState<Phase>(preselect ? "seguridad" : "entrada");
  const [situation, setSituation] = useState<HelpSituation | null>(preselect || null);
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [safetyFlag, setSafetyFlag] = useState<SafetyFlag | null>(null);

  useEffect(() => {
    trackEvent("ayudame_ahora_iniciado", { situation, viaPreselect: Boolean(preselect) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const child = state.child;
  if (!child) return null;

  function chooseSituation(id: HelpSituation) {
    setSituation(id);
    setPhase("seguridad");
  }

  function chooseSafety(flag: SafetyFlag) {
    setSafetyFlag(flag);
    if (flag !== "solo_sueno") {
      trackEvent("alerta_seguridad_mostrada", { situation, flag });
      setPhase("alerta");
      return;
    }
    setPhase("seguimiento");
  }

  function chooseFollowUp(answer: string) {
    setFollowUpAnswer(answer);
    setPhase("recomendacion");
  }

  function markHelped() {
    trackEvent("ayudame_ahora_completado", { situation, outcome: "ayudo" });
    setPhase("exito");
  }

  function markNotYet(from: "recomendacion" | "alternativa") {
    if (from === "recomendacion") {
      setPhase("alternativa");
    } else {
      trackEvent("ayudame_ahora_completado", { situation, outcome: "sin_resolver" });
      setPhase("agotado");
    }
  }

  function restart() {
    setPhase("entrada");
    setSituation(null);
    setFollowUpAnswer(null);
  }

  const outcome = situation ? getGuidanceOutcome(situation, child.ageStage, "solo_sueno") : null;
  const alertContent = safetyFlag ? getSafetyAlertContent(safetyFlag, child.ageStage, child.name) : null;

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate("/hoy")} className="text-muted-foreground text-sm font-semibold mb-4 touch-target">
        ✕ Cerrar
      </button>

      {phase === "entrada" && (
        <>
          <h1 className="font-display text-2xl font-extrabold mb-1">Estoy contigo.</h1>
          <p className="text-muted-foreground text-sm mb-6">¿Qué está pasando?</p>
          <div className="flex flex-col gap-2.5">
            {SITUATION_OPTIONS.map((opt) => (
              <ChoiceCard key={opt.id} label={opt.label} selected={false} onClick={() => chooseSituation(opt.id)} />
            ))}
          </div>
        </>
      )}

      {phase === "seguridad" && (
        <>
          <h1 className="font-display text-2xl font-extrabold mb-6 leading-snug">{SAFETY_FILTER_QUESTION}</h1>
          <div className="flex flex-col gap-2.5">
            {SAFETY_FILTER_OPTIONS.map((opt) => (
              <ChoiceCard key={opt.id} label={opt.label} selected={false} onClick={() => chooseSafety(opt.id)} />
            ))}
          </div>
        </>
      )}

      {phase === "alerta" && alertContent && (
        <div className="flex flex-col items-center text-center pt-10">
          <div className="text-6xl mb-5">🩺</div>
          <h2 className="font-display text-xl font-extrabold mb-3 text-destructive">{alertContent.title}</h2>
          <p className="text-foreground/80 text-sm leading-relaxed mb-8 max-w-[320px]">{alertContent.body}</p>
          <Button size="lg" onClick={() => navigate("/hoy")}>
            {alertContent.cta}
          </Button>
        </div>
      )}

      {phase === "seguimiento" && situation && (
        <>
          <h1 className="font-display text-2xl font-extrabold mb-6 leading-snug">
            {FOLLOW_UP_QUESTIONS[situation].question}
          </h1>
          <div className="flex flex-col gap-2.5">
            {FOLLOW_UP_QUESTIONS[situation].options.map((opt) => (
              <ChoiceCard key={opt} label={opt} selected={followUpAnswer === opt} onClick={() => chooseFollowUp(opt)} />
            ))}
          </div>
        </>
      )}

      {phase === "recomendacion" && outcome && !outcome.blocked && (
        <div className="pt-2">
          <Badge>Probemos esto primero</Badge>
          <ol className="mt-4 mb-8 flex flex-col gap-3">
            {outcome.steps!.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/25 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-center text-sm font-bold text-muted-foreground mb-3">¿Te ayudó?</p>
          <div className="flex gap-3">
            <Button variant="success" onClick={markHelped}>
              Sí
            </Button>
            <Button variant="secondary" onClick={() => markNotYet("recomendacion")}>
              Todavía no
            </Button>
          </div>
        </div>
      )}

      {phase === "alternativa" && outcome && !outcome.blocked && (
        <div className="pt-2">
          <Badge variant="accent">Probemos otra opción</Badge>
          <ol className="mt-4 mb-8 flex flex-col gap-3">
            {outcome.alternative!.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/25 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-center text-sm font-bold text-muted-foreground mb-3">¿Te ayudó?</p>
          <div className="flex gap-3">
            <Button variant="success" onClick={markHelped}>
              Sí
            </Button>
            <Button variant="secondary" onClick={() => markNotYet("alternativa")}>
              Todavía no
            </Button>
          </div>
        </div>
      )}

      {phase === "exito" && (
        <div className="flex flex-col items-center text-center pt-14">
          <div className="text-6xl mb-5 animate-breathe">🌙</div>
          <h2 className="font-display text-xl font-extrabold mb-3">Qué bueno que ayudó</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-[300px]">
            Respira un momento tú también. Puedes registrar esto en Registrar si quieres llevar la cuenta.
          </p>
          <div className="flex flex-col gap-2.5 w-full">
            <Button onClick={() => navigate("/registrar")}>Registrar ahora</Button>
            <Button variant="ghost" onClick={() => navigate("/hoy")}>
              Volver a Hoy
            </Button>
          </div>
        </div>
      )}

      {phase === "agotado" && (
        <div className="flex flex-col items-center text-center pt-14">
          <Card className="w-full mb-6 text-left">
            <p className="text-sm leading-relaxed">
              Una noche difícil no significa que estés haciendo algo mal. Vamos paso a paso: puedes volver a intentarlo,
              o descansar un momento y probar de nuevo en un rato.
            </p>
          </Card>
          <div className="flex flex-col gap-2.5 w-full">
            <Button onClick={restart}>Probar con otra situación</Button>
            <Button variant="secondary" onClick={() => navigate("/hoy")}>
              Volver a Hoy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
