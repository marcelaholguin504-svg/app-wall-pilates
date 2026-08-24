// Capa de contenido: biblioteca de sonidos para dormir.
// El audio se genera en el navegador (Web Audio API), sin archivos externos.

export const SOUND_LIBRARY = [
  { id: "ruido_blanco", emoji: "🤍", label: "Ruido blanco", type: "white", free: true },
  { id: "lluvia", emoji: "🌧️", label: "Lluvia", type: "brown", free: true },
  { id: "oceano", emoji: "🌊", label: "Océano", type: "ocean", free: false },
  { id: "cancion_cuna", emoji: "🎵", label: "Canción de cuna", type: "lullaby", free: false },
  { id: "ambiental", emoji: "🌙", label: "Sonidos ambientales", type: "pink", free: false },
  { id: "shhh", emoji: "🤫", label: "'Shhh' relajante", type: "shhh", free: false },
];

export const TIMER_OPTIONS = [
  { id: 15, label: "15 min" },
  { id: 30, label: "30 min" },
  { id: 60, label: "60 min" },
  { id: 0, label: "Continuo" },
];
