// Capa de contenido: definición de planes de suscripción.
// Ninguna función de seguridad infantil esencial (alerta pediátrica, SOS básico,
// horario básico) está bloqueada aquí. Solo comodidades y personalización avanzada.

export const PLANS = {
  free: {
    id: "free",
    name: "Gratis",
    priceLabel: "$0",
    period: "",
    features: [
      "1 perfil de bebé",
      "Registro básico de sueño",
      "Horario básico estimado",
      "SOS: 3 usos por día",
      "2 sonidos para dormir",
    ],
  },
  plus: {
    id: "plus",
    name: "Sueño+",
    emoji: "🌙",
    monthly: { priceLabel: "$7.99", period: "/mes" },
    yearly: { priceLabel: "$49.99", period: "/año", savingsLabel: "Ahorras 48% vs. mensual" },
    features: [
      "🆘 SOS ilimitado",
      "📅 Horario adaptativo con tus registros",
      "👨‍👩‍👧‍👦 Modo Cuidador completo",
      "👵 Modo Abuela",
      "👩‍🍼 Modo Niñera",
      "🎵 Biblioteca completa de sonidos",
      "❤️ Voz de Mamá",
      "🌙 Rutinas personalizadas ilimitadas",
      "📊 Patrones de sueño",
    ],
  },
};

export const PAYWALL_DISCLAIMER =
  "La seguridad de tu bebé siempre es gratis: la alerta pediátrica, el SOS básico y el horario esencial nunca están bloqueados.";
