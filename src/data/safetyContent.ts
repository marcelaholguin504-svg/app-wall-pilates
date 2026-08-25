import type { SafetyFlag } from "@/types";

export const SAFETY_FILTER_QUESTION = "¿Algo de esto te preocupa además del sueño?";

export const SAFETY_FILTER_OPTIONS: { id: SafetyFlag; label: string }[] = [
  { id: "solo_sueno", label: "No, solo el sueño." },
  { id: "fiebre", label: "Tiene fiebre o se ve enfermo/a." },
  { id: "respiracion", label: "Le cuesta respirar o algo se ve distinto a lo normal." },
  { id: "prefiero_no_responder", label: "Prefiero no responder ahora." },
];

export const SAFETY_ALERT_MESSAGE = {
  title: "Esto va más allá del sueño",
  body: "Lo que describes podría necesitar la mirada de un profesional de salud. No podemos evaluarlo por ti: lo más seguro es que contactes a tu pediatra o a los servicios de salud de tu localidad.",
  cta: "Entendido",
};

export const MEDICAL_DISCLAIMER =
  "Duerme Ya ofrece orientación educativa y no sustituye la evaluación de un profesional de salud.";

export const UNSAFE_SLEEP_PRACTICES = [
  "almohadas",
  "mantas sueltas",
  "posicionadores",
  "protectores de cuna",
  "dormir boca abajo como estrategia",
  "objetos sueltos en el espacio de sueño",
];
