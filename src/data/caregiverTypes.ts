import { User, UserRound, Baby, Heart, type LucideIcon } from "lucide-react";
import type { CaregiverType } from "@/types";

export const CAREGIVER_TYPES: { id: CaregiverType; label: string; icon: LucideIcon }[] = [
  { id: "mama", label: "Mamá", icon: User },
  { id: "papa", label: "Papá", icon: User },
  { id: "abuela", label: "Abuela", icon: UserRound },
  { id: "abuelo", label: "Abuelo", icon: UserRound },
  { id: "ninera", label: "Niñera/cuidadora", icon: Baby },
  { id: "otro", label: "Otro cuidador", icon: Heart },
];

export function caregiverTypeLabel(type: CaregiverType): string {
  return CAREGIVER_TYPES.find((c) => c.id === type)?.label || type;
}

export function caregiverTypeIcon(type: CaregiverType): LucideIcon {
  return CAREGIVER_TYPES.find((c) => c.id === type)?.icon || Heart;
}
