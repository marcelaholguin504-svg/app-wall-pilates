import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppContext.jsx";

export default function Splash() {
  const navigate = useNavigate();
  const state = useAppState();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state.user) navigate("/registro", { replace: true });
      else if (!state.child) navigate("/onboarding", { replace: true });
      else navigate("/inicio", { replace: true });
    }, 900);
    return () => clearTimeout(timer);
  }, [state.user, state.child, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
      <div
        className="absolute w-72 h-72 rounded-full pointer-events-none animate-breathe"
        style={{ background: "radial-gradient(circle, rgba(139,124,246,0.35) 0%, transparent 70%)" }}
      />
      <div className="text-7xl mb-5 animate-breathe drop-shadow-[0_0_25px_rgba(139,124,246,0.5)]">🌙</div>
      <h1 className="font-display text-4xl font-extrabold mb-2 bg-gradient-to-br from-white to-moon-300 bg-clip-text text-transparent">
        Dulce Sueño
      </h1>
      <p className="text-moon-300 text-base max-w-[280px]">
        Dime qué hacer ahora, para que tu bebé duerma.
      </p>
    </div>
  );
}
