import type { AgeStage } from "@/types";

export const AGE_STAGES: { id: AgeStage; label: string }[] = [
  { id: "0-3m", label: "0–3 meses" },
  { id: "4-6m", label: "4–6 meses" },
  { id: "7-12m", label: "7–12 meses" },
  { id: "13-18m", label: "13–18 meses" },
  { id: "19-24m", label: "19–24 meses" },
  { id: "2-3a", label: "2–3 años" },
];

export function ageStageLabel(stage: AgeStage): string {
  return AGE_STAGES.find((s) => s.id === stage)?.label || stage;
}

export function isToddlerStage(stage: AgeStage): boolean {
  return stage === "19-24m" || stage === "2-3a";
}
