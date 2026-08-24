// Capa de contenido: plantillas de rutinas por defecto.
// El cuidador puede personalizarlas desde la pantalla de Rutinas.

export const ROUTINE_TYPES = {
  siesta: { label: "Rutina de siesta", emoji: "☀️" },
  nocturna: { label: "Rutina nocturna", emoji: "🌙" },
  despertar: { label: "Rutina de despertar", emoji: "🌅" },
};

export const DEFAULT_ROUTINES = {
  nocturna: [
    { id: "n1", text: "Bajar las luces de la casa" },
    { id: "n2", text: "Cambiar el pañal y ponerle la ropa de dormir" },
    { id: "n3", text: "Un momento tranquilo: cuento corto o canción suave" },
    { id: "n4", text: "Activar el sonido para dormir" },
    { id: "n5", text: "Última toma o abrazo antes de acostarlo" },
  ],
  siesta: [
    { id: "s1", text: "Bajar las persianas del cuarto" },
    { id: "s2", text: "Revisar el pañal" },
    { id: "s3", text: "Bajar el ritmo del juego, actividad tranquila" },
    { id: "s4", text: "Activar el sonido para dormir" },
    { id: "s5", text: "Acostarlo en la cuna despierto pero relajado" },
  ],
  despertar: [
    { id: "d1", text: "Abrir un poco la luz natural del cuarto" },
    { id: "d2", text: "Saludarlo con voz suave y calmada" },
    { id: "d3", text: "Cambiar el pañal" },
    { id: "d4", text: "Primera toma o desayuno" },
  ],
};
