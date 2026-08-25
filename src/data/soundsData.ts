import type { Sound, TimerOption } from "@/types";

export const SOUNDS: Sound[] = [
  { id: "lluvia_suave", label: "Lluvia suave", icon: "CloudRain", type: "rain" },
  { id: "olas", label: "Olas", icon: "Waves", type: "waves" },
  { id: "ruido_blanco", label: "Ruido blanco", icon: "AudioLines", type: "white" },
  { id: "ruido_rosa", label: "Ruido rosa", icon: "AudioWaveform", type: "pink" },
  { id: "ruido_marron", label: "Ruido marrón", icon: "Radio", type: "brown" },
  { id: "ventilador", label: "Ventilador", icon: "Fan", type: "fan" },
  { id: "viaje_lluvia", label: "Viaje bajo la lluvia", icon: "CarFront", type: "rain_journey" },
  { id: "nana_instrumental", label: "Nana instrumental", icon: "Music2", type: "lullaby" },
  { id: "latido_suave", label: "Latido suave", icon: "Heart", type: "heartbeat" },
];

export const TIMER_OPTIONS: { id: TimerOption; label: string }[] = [
  { id: 15, label: "15 min" },
  { id: 30, label: "30 min" },
  { id: 45, label: "45 min" },
  { id: 60, label: "60 min" },
  { id: 0, label: "Continuo" },
];
