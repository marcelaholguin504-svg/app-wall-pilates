import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChoiceCard } from "@/components/ChoiceCard";
import { IconBadge } from "@/components/IconBadge";
import ProgressDots from "@/components/ProgressDots";
import { initMetaPixel, trackQuizEvent } from "@/services/metaPixel";
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
  answersSummary,
  type QuizAnswers,
  type QuizOption,
} from "@/data/quizContent";

// Quiz de validación (/quiz): funnel de anuncios independiente del
// onboarding de la app. Fase A: solo la Primera Pantalla, el nombre y las
// 9 preguntas — sin bloques de aprendizaje, resultado, oferta ni
// exit-intent (eso llega en fases siguientes). Las respuestas viven solo
// en el estado de este componente; todavía no se guardan en Supabase.

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

// Pasos: 0 = validación, 1 = nombre, 2..10 = P1..P9, 11 = resumen (fin de Fase A).
const STEP_NAME = 1;
const STEP_FIRST_QUESTION = 2;
const STEP_SUMMARY = STEP_FIRST_QUESTION + QUESTIONS.length;
const TOTAL_DOTS = 1 + QUESTIONS.length; // nombre + 9 preguntas

const SELECT_ADVANCE_DELAY_MS = 220;

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_QUIZ_ANSWERS);
  const [nameInput, setNameInput] = useState("");
  const [flashId, setFlashId] = useState<string | null>(null);

  useEffect(() => {
    initMetaPixel();
    trackQuizEvent("quiz_paso_0_validacion");
  }, []);

  useEffect(() => {
    setFlashId(null);
  }, [step]);

  const displayName = answers.name || "tu bebé";

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function confirmName(rawName: string) {
    const trimmed = rawName.trim();
    setAnswers((a) => ({ ...a, name: trimmed || null }));
    trackQuizEvent("quiz_paso_0.5_nombre");
    setStep(STEP_FIRST_QUESTION);
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
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
        <p className="font-display text-2xl sm:text-3xl font-extrabold leading-snug mb-5">
          Son las 2:47 AM y tu bebé sigue sin dormir.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed mb-1">No es que estés haciendo algo mal.</p>
        <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-[320px]">
          Es que nadie te dio una guía clara para <span className="text-foreground font-bold">ESTE momento</span>.
        </p>
        <Button size="lg" onClick={() => setStep(STEP_NAME)}>
          Dime qué hacer ahora →
        </Button>
        <p className="text-xs text-muted-foreground mt-4">(30 segundos. Sin registros. Sin apps que instalar todavía.)</p>
      </div>
    );
  }

  // Paso 0.5 — nombre.
  if (step === STEP_NAME) {
    return (
      <div className="min-h-screen flex flex-col px-6 pt-8 pb-10">
        <ProgressDots total={TOTAL_DOTS} current={0} />
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
  if (step >= STEP_FIRST_QUESTION && step < STEP_SUMMARY) {
    const questionIndex = step - STEP_FIRST_QUESTION;
    const question = QUESTIONS[questionIndex];
    return (
      <div className="min-h-screen flex flex-col px-6 pt-8 pb-10">
        <ProgressDots total={TOTAL_DOTS} current={questionIndex + 1} />
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

  // Paso final de la Fase A: resumen temporal, no es la página de resultado
  // (eso llega en la Fase B). Sirve para confirmar visualmente en QA que
  // las 9 respuestas quedaron bien capturadas.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
      <IconBadge icon={Moon} size="lg" className="mb-4" />
      <h1 className="font-display text-2xl font-extrabold mb-2">Fase A completa</h1>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-[300px] mb-6">
        Aquí seguirán los bloques de aprendizaje y tu resultado personalizado para {displayName} — todavía no
        construidos. Esto es solo un resumen temporal para confirmar que las respuestas se guardaron bien.
      </p>
      <div className="w-full text-left flex flex-col gap-2">
        {answersSummary(answers).map((row) => (
          <div key={row.question} className="bg-card border border-border rounded-xl px-4 py-2.5">
            <p className="text-xs font-semibold text-muted-foreground">{row.question}</p>
            <p className="text-sm font-semibold">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
