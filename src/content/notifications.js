// Capa de contenido: plantillas de notificaciones (arquitectura preparada,
// aún no se envían notificaciones push reales).

export const NOTIFICATION_TEMPLATES = {
  proximoSueno: (childName, minutes) =>
    `🌙 La hora de sueño de ${childName} se acerca. Empieza su rutina en ${minutes} minutos.`,
  cuidadorRegistroSiesta: (caregiverLabel, childName) =>
    `${caregiverLabel} registró la siesta de ${childName}.`,
  despertoNocturno: (childName) => `${childName} acaba de despertarse. ¿Necesitas ayuda?`,
  durmioMenos: (childName) => `Parece que hoy ${childName} durmió menos de lo habitual.`,
};
