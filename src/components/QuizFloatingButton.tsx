// Botón flotante fijo del quiz ("Ver mi plan →") — mismo patrón de
// posicionamiento que BottomNav (fixed, centrado, ancho máximo de la app).
export function QuizFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-background via-background/95 to-transparent z-[100]">
      <button
        onClick={onClick}
        className="w-full h-12 rounded-xl font-display font-bold bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-glow active:scale-[0.97] transition-transform touch-target"
      >
        Ver mi plan →
      </button>
    </div>
  );
}
