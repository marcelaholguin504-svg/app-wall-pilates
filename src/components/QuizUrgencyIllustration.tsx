// Ilustración SVG del Bloque de Urgencia — exactamente el SVG provisto en
// el documento de diseño (luna + estrellas con resplandor), sin
// modificaciones de contenido. Solo se ajustó a responsive: ancho máximo
// 400px en móvil, 500px en escritorio, centrada.
export function QuizUrgencyIllustration() {
  return (
    <svg
      viewBox="0 0 700 320"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[400px] sm:max-w-[500px] mx-auto block"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="quizUrgencyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8C38A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#E8C38A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="quizUrgencyGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B8A9E0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#B8A9E0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="350.0" cy="110" r="150" fill="url(#quizUrgencyGlow)" />
      <circle cx="332.0" cy="110" r="46" fill="#F5F0E8" />
      <circle cx="352.0" cy="102" r="40" fill="#0B0A1F" />
      <circle cx="173.1" cy="180.0" r="3.2" fill="#E8C38A" opacity="0.85" />
      <circle cx="500.3" cy="107.4" r="4.1" fill="#B8A9E0" opacity="0.85" />
      <circle cx="160.4" cy="144.9" r="3.4" fill="#E8C38A" opacity="0.85" />
      <circle cx="420.7" cy="239.3" r="3.7" fill="#B8A9E0" opacity="0.85" />
      <circle cx="196.0" cy="59.9" r="3.3" fill="#E8C38A" opacity="0.85" />
      <circle cx="467.5" cy="193.4" r="3.7" fill="#B8A9E0" opacity="0.85" />
      <circle cx="541.7" cy="217.5" r="3.3" fill="#E8C38A" opacity="0.85" />
      <circle cx="316.2" cy="99.9" r="2.8" fill="#B8A9E0" opacity="0.85" />
      <circle cx="602.4" cy="134.4" r="4.5" fill="#E8C38A" opacity="0.85" />
      <circle cx="239.5" cy="61.9" r="4.5" fill="#B8A9E0" opacity="0.85" />
      <circle cx="400.8" cy="192.5" r="4.1" fill="#E8C38A" opacity="0.85" />
      <circle cx="251.5" cy="140.2" r="3.8" fill="#B8A9E0" opacity="0.85" />
      <circle cx="398.1" cy="217.1" r="2.9" fill="#E8C38A" opacity="0.85" />
      <circle cx="515.9" cy="167.5" r="2.7" fill="#B8A9E0" opacity="0.85" />
      <ellipse cx="350.0" cy="310" rx="420.0" ry="40" fill="url(#quizUrgencyGlow2)" />
    </svg>
  );
}
