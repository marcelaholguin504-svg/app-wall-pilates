import { useEffect, useState } from "react";
import { Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChoiceCard } from "@/components/ChoiceCard";
import { IconBadge } from "@/components/IconBadge";
import ProgressDots from "@/components/ProgressDots";
import {
  AwakeWindowsIllustration,
  SingleStepPathIllustration,
  WarmCommunityIllustration,
} from "@/components/QuizLearningGraphics";
import { initMetaPixel, trackQuizEvent } from "@/services/metaPixel";
import { GUIDANCE_BANK } from "@/data/guidanceContent";
import { SAFETY_ALERT_MESSAGE, FEVER_ALERT_UNDER_3_MONTHS, feverAlertOver3Months } from "@/data/safetyContent";
import {
  P1_EDAD,
  P2_PATRON,
  P3_DURACION,
  P4_QUE_INTENTO,
  P5_ESTADO_EMOCIONAL,
  P6_SITUACION_AHORA,
  P7_ALERTA_SEGURIDAD,
  P8_CUIDADORES,
  P9_META,
  INITIAL_QUIZ_ANSWERS,
  labelFor,
  LEARNING_BLOCKS,
  BENEFITS,
  URGENCY_BENEFITS_REMINDER,
  PERTENENCIA_QUOTE_URGENCIA,
  GUARANTEE_TEXT,
  CHECKOUT_URL,
  segmentForEdad,
  ageGroupForEdad,
  helpSituationForSituacionAhora,
  mirrorEstadoEmocional,
  validationQueIntento,
  closeForMeta,
  cuidadorClause,
  type QuizAnswers,
  type QuizOption,
  type LearningBlock,
} from "@/data/quizContent";

// Quiz de validación (/quiz): funnel de anuncios independiente del
// onboarding de la app. Fase A: Primera Pantalla, nombre y las 9
// preguntas (ya en producción, sin tocar). Fase B: 3 bloques de
// aprendizaje intercalados, página de resultado (o derivación a pediatra
// si aplica la rama de seguridad), beneficios, y cierre con oferta. Las
// respuestas viven solo en el estado de este componente; todavía no se
// guardan en Supabase.

interface QuestionStep {
  title: (displayName: string) => string;
  options: QuizOption[];
  field: keyof QuizAnswers;
  eventName: string;
}

const QUESTIONS: QuestionStep[] = [
  {
    title: (name) => `¿Qué edad tiene ${name}?`,
    options: P1_EDAD,
    field: "edad",
    eventName: "quiz_paso_1_edad",
  },
  {
    title: () => "¿Cuál es el problema que más se repite?",
    options: P2_PATRON,
    field: "patron",
    eventName: "quiz_paso_2_patron",
  },
  {
    title: () => "¿Hace cuánto tiempo viene pasando esto?",
    options: P3_DURACION,
    field: "duracion",
    eventName: "quiz_paso_3_duracion",
  },
  {
    title: () => "¿Qué has probado hasta ahora?",
    options: P4_QUE_INTENTO,
    field: "queIntento",
    eventName: "quiz_paso_4_que_intento",
  },
  {
    title: () => "¿Cómo te sientes la mayoría de las noches?",
    options: P5_ESTADO_EMOCIONAL,
    field: "estadoEmocional",
    eventName: "quiz_paso_5_estado_emocional",
  },
  {
    title: () => "¿Qué está pasando en este momento?",
    options: P6_SITUACION_AHORA,
    field: "situacionAhora",
    eventName: "quiz_paso_6_situacion_ahora",
  },
  {
    title: () => "¿Algo de esto te preocupa además del sueño?",
    options: P7_ALERTA_SEGURIDAD,
    field: "alertaSeguridad",
    eventName: "quiz_paso_7_alerta_seguridad",
  },
  {
    title: (name) => `¿Quién más ayuda a cuidar a ${name} además de ti?`,
    options: P8_CUIDADORES,
    field: "cuidadores",
    eventName: "quiz_paso_8_cuidadores",
  },
  {
    title: () => "Si esto mejorara, ¿qué es lo primero que te gustaría recuperar?",
    options: P9_META,
    field: "meta",
    eventName: "quiz_paso_9_meta",
  },
];

type FlowStep =
  | { kind: "hero" }
  | { kind: "name"; dotIndex: number }
  | { kind: "question"; question: QuestionStep; dotIndex: number }
  | { kind: "learning"; block: LearningBlock }
  | { kind: "result" }
  | { kind: "benefits" }
  | { kind: "urgency" };

// Orden exacto pedido: Bloque 1 después de P2 (antes de P3), Bloque 2
// después de P4 (antes de P5), Bloque 3 después de P5 (antes de P6).
const FLOW: FlowStep[] = [
  { kind: "hero" },
  { kind: "name", dotIndex: 0 },
  { kind: "question", question: QUESTIONS[0], dotIndex: 1 }, // P1
  { kind: "question", question: QUESTIONS[1], dotIndex: 2 }, // P2
  { kind: "learning", block: LEARNING_BLOCKS[0] },
  { kind: "question", question: QUESTIONS[2], dotIndex: 3 }, // P3
  { kind: "question", question: QUESTIONS[3], dotIndex: 4 }, // P4
  { kind: "learning", block: LEARNING_BLOCKS[1] },
  { kind: "question", question: QUESTIONS[4], dotIndex: 5 }, // P5
  { kind: "learning", block: LEARNING_BLOCKS[2] },
  { kind: "question", question: QUESTIONS[5], dotIndex: 6 }, // P6
  { kind: "question", question: QUESTIONS[6], dotIndex: 7 }, // P7
  { kind: "question", question: QUESTIONS[7], dotIndex: 8 }, // P8
  { kind: "question", question: QUESTIONS[8], dotIndex: 9 }, // P9
  { kind: "result" },
  { kind: "benefits" },
  { kind: "urgency" },
];
const TOTAL_DOTS = 10; // nombre + 9 preguntas

const SELECT_ADVANCE_DELAY_MS = 220;

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_QUIZ_ANSWERS);
  const [nameInput, setNameInput] = useState("");
  const [flashId, setFlashId] = useState<string | null>(null);

  const displayName = answers.name || "tu bebé";
  const blocked = answers.alertaSeguridad !== "solo_sueno";
  const current = FLOW[step];

  useEffect(() => {
    initMetaPixel();
    trackQuizEvent("quiz_paso_0_validacion");
  }, []);

  useEffect(() => {
    setFlashId(null);
    const item = FLOW[step];
    if (item.kind === "learning") trackQuizEvent(`quiz_bloque_aprendizaje_${item.block.n}`);
    else if (item.kind === "result") trackQuizEvent(blocked ? "quiz_derivado_pediatra" : "quiz_resultado_visto");
    else if (item.kind === "benefits") trackQuizEvent("quiz_beneficios_visto");
    else if (item.kind === "urgency") trackQuizEvent("quiz_urgencia_visto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function confirmName(rawName: string) {
    const trimmed = rawName.trim();
    setAnswers((a) => ({ ...a, name: trimmed || null }));
    trackQuizEvent("quiz_paso_0.5_nombre");
    setStep((s) => s + 1);
  }

  function selectAnswer(question: QuestionStep, option: QuizOption) {
    if (flashId) return;
    setFlashId(option.id);
    setTimeout(() => {
      setAnswers((a) => ({ ...a, [question.field]: option.id }));
      trackQuizEvent(question.eventName);
      setStep((s) => s + 1);
    }, SELECT_ADVANCE_DELAY_MS);
  }

  // Paso 0 — Primera Pantalla (validación).
  if (current.kind === "hero") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
        <p className="font-display text-2xl sm:text-3xl font-extrabold leading-snug mb-5">
          Son las 2:47 AM y tu bebé sigue sin dormir.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed mb-1">No es que estés haciendo algo mal.</p>
        <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-[320px]">
          Es que nadie te dio una guía clara para <span className="text-foreground font-bold">ESTE momento</span>.
        </p>
        <Button size="lg" onClick={() => setStep(1)}>
          Dime qué hacer ahora →
        </Button>
        <p className="text-xs text-muted-foreground mt-4">(30 segundos. Sin registros. Sin apps que instalar todavía.)</p>
      </div>
    );
  }

  // Paso 0.5 — nombre.
  if (current.kind === "name") {
    return (
      <div className="min-h-screen flex flex-col px-6 pt-8 pb-10">
        <ProgressDots total={TOTAL_DOTS} current={current.dotIndex} />
        <div className="flex-1 mt-8">
          <h1 className="font-display text-2xl font-extrabold mb-6 flex items-center gap-2">
            ¿Cómo se llama tu bebé? <IconBadge icon={Moon} size="sm" />
          </h1>
          <Label htmlFor="quiz-name">Nombre (opcional)</Label>
          <Input
            id="quiz-name"
            autoFocus
            placeholder="Ej. Mateo"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="mb-6"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={() => confirmName(nameInput)}>
            Continuar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => confirmName("")}>
            Prefiero no decirlo
          </Button>
        </div>
      </div>
    );
  }

  // P1..P9.
  if (current.kind === "question") {
    const { question } = current;
    return (
      <div className="min-h-screen flex flex-col px-6 pt-8 pb-10">
        <ProgressDots total={TOTAL_DOTS} current={current.dotIndex} />
        <div className="flex-1 mt-8">
          <h1 className="font-display text-2xl font-extrabold mb-6 leading-snug">{question.title(displayName)}</h1>
          <div className="flex flex-col gap-2.5">
            {question.options.map((opt) => (
              <ChoiceCard
                key={opt.id}
                emoji={opt.emoji}
                label={opt.label}
                selected={flashId === opt.id}
                onClick={() => selectAnswer(question, opt)}
              />
            ))}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={goBack} className="mt-6">
          ← Atrás
        </Button>
      </div>
    );
  }

  // Bloques de aprendizaje 1, 2 y 3 — pantallas sin pregunta.
  if (current.kind === "learning") {
    const { block } = current;
    return (
      <div className="min-h-screen flex flex-col px-6 pt-10 pb-10">
        <div className="flex-1 flex flex-col items-center text-center">
          <IconBadge icon={Moon} tone="accent" size="lg" className="mb-5" />
          <p className="text-xs font-bold uppercase tracking-wide text-primary mb-2">{block.eyebrow}</p>
          <h1 className="font-display text-2xl font-extrabold mb-4 leading-snug">{block.title}</h1>
          <Card className="w-full mb-5">
            {block.n === 1 && <AwakeWindowsIllustration />}
            {block.n === 2 && <SingleStepPathIllustration />}
            {block.n === 3 && <WarmCommunityIllustration />}
          </Card>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[320px]">{block.text}</p>
        </div>
        <Button size="lg" onClick={() => setStep((s) => s + 1)} className="mt-6">
          Continuar
        </Button>
      </div>
    );
  }

  // Página de resultado — rama de seguridad o resultado personalizado.
  if (current.kind === "result") {
    if (blocked) {
      const isFever = answers.alertaSeguridad === "fiebre";
      const content = isFever
        ? answers.edad === "0-3m"
          ? FEVER_ALERT_UNDER_3_MONTHS
          : feverAlertOver3Months(displayName)
        : SAFETY_ALERT_MESSAGE;
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
          <IconBadge icon={Moon} tone="destructive" size="lg" className="mb-5" />
          <h1 className="font-display text-xl font-extrabold mb-3 text-destructive">{content.title}</h1>
          <p className="text-foreground/80 text-sm leading-relaxed max-w-[320px] mb-2">{content.body}</p>
          <p className="text-muted-foreground text-xs mt-6">Puedes cerrar esta pestaña cuando quieras.</p>
        </div>
      );
    }

    const segment = segmentForEdad(answers.edad);
    const ageGroup = ageGroupForEdad(answers.edad);
    const situationLike = helpSituationForSituacionAhora(answers.situacionAhora);
    const concreteAction = GUIDANCE_BANK[situationLike][ageGroup].steps[0];
    const patronLabel = labelFor(P2_PATRON, answers.patron).toLowerCase();
    const clause = cuidadorClause(answers.cuidadores);

    return (
      <div className="min-h-screen flex flex-col px-6 pt-10 pb-10">
        <h1 className="font-display text-2xl font-extrabold mb-2 leading-snug">
          Esto que vive {displayName} es normal para su edad.
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{segment.diagnosticoBase}</p>

        <Card className="mb-4">
          <p className="text-sm leading-relaxed">{mirrorEstadoEmocional(answers.estadoEmocional)}</p>
        </Card>

        <Card className="mb-4">
          <p className="text-sm leading-relaxed">{validationQueIntento(answers.queIntento, displayName)}</p>
        </Card>

        <Badge className="mb-3 self-start">Una acción concreta para probar hoy</Badge>
        <Card className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">
            Para lo que más se repite — "{patronLabel}" — a la edad de {displayName}:
          </p>
          <p className="text-sm font-semibold leading-relaxed">{concreteAction}</p>
        </Card>

        {clause && (
          <Card className="mb-4 border-primary/30 bg-primary/10">
            <p className="text-sm leading-relaxed">
              Como {clause} también cuida a {displayName}, esto se puede compartir para que ambas sigan la misma
              guía.
            </p>
          </Card>
        )}

        <p className="text-sm leading-relaxed font-semibold mb-8">{closeForMeta(answers.meta)}</p>

        <Button size="lg" onClick={() => setStep((s) => s + 1)}>
          Continuar
        </Button>
      </div>
    );
  }

  // Bloque de beneficios (solo rama normal — nunca se llega aquí si blocked).
  if (current.kind === "benefits") {
    return (
      <div className="min-h-screen flex flex-col px-6 pt-10 pb-10">
        <div className="flex-1">
          <h1 className="font-display text-2xl font-extrabold mb-6 leading-snug">
            Esto es lo que vas a tener a partir de hoy
          </h1>
          <ul className="flex flex-col gap-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <IconBadge icon={Check} tone="success" size="sm" className="mt-0.5" />
                <span className="text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button size="lg" onClick={() => setStep((s) => s + 1)} className="mt-8">
          Continuar
        </Button>
      </div>
    );
  }

  // Bloque de urgencia + cierre + botón de compra.
  return (
    <div className="min-h-screen flex flex-col px-6 pt-10 pb-10">
      <ul className="flex flex-col gap-2.5 mb-6">
        {URGENCY_BENEFITS_REMINDER.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <span className="text-sm leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>

      <Card className="mb-6 bg-muted/60">
        <p className="text-sm leading-relaxed text-foreground/90">{PERTENENCIA_QUOTE_URGENCIA}</p>
      </Card>

      <h2 className="font-display text-xl font-extrabold mb-2 leading-snug">
        Esta etapa no dura para siempre — y eso es justo el punto
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {displayName} va a cambiar de etapa pronto, con o sin guía. La diferencia no es si esta etapa va a pasar —
        va a pasar de todas formas. La diferencia es si la atraviesan con claridad, o adivinando cada noche.
      </p>

      <p className="text-xs text-muted-foreground text-center mb-6">{GUARANTEE_TEXT}</p>

      <Button asChild size="lg" className="animate-breathe">
        <a href={CHECKOUT_URL} onClick={() => trackQuizEvent("quiz_oferta_click")}>
          Quiero saber qué hacer ahora →
        </a>
      </Button>
    </div>
  );
}
