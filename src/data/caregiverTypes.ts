import type { CaregiverType } from "@/types";

export const CAREGIVER_TYPES: { id: CaregiverType; label: string; emoji: string }[] = [
  { id: "mama", label: "Mamá", emoji: "👩" },
  { id: "papa", label: "Papá", emoji: "👨" },
  { id: "abuela", label: "Abuela", emoji: "👵" },
  { id: "abuelo", label: "Abuelo", emoji: "👴" },
  { id: "ninera", label: "Niñera/cuidadora", emoji: "👩‍🍼" },
  { id: "otro", label: "Otro cuidador", emoji: "❤️" },
];

export function caregiverTypeLabel(type: CaregiverType): string {
  return CAREGIVER_TYPES.find((c) => c.id === type)?.label || type;
}

export function caregiverTypeEmoji(type: CaregiverType): string {
  return CAREGIVER_TYPES.find((c) => c.id === type)?.emoji || "❤️";
}
