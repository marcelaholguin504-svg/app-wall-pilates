import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppContext.jsx";
import Screen from "../components/Screen.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { Card } from "../components/ui.jsx";
import { ROUTINE_TYPES, DEFAULT_ROUTINES } from "../content/routines.js";

export default function Routines() {
  const state = useAppState();
  const navigate = useNavigate();

  return (
    <Screen>
      <div className="px-5 pt-8">
        <h1 className="font-display text-2xl font-extrabold mb-1">Rutinas</h1>
        <p className="text-moon-300 text-sm mb-6">Pasos simples y en orden para preparar el sueño de {state.child?.name || "tu bebé"}.</p>

        <div className="flex flex-col gap-3">
          {Object.entries(ROUTINE_TYPES).map(([type, info]) => {
            const steps = state.routines[type] || DEFAULT_ROUTINES[type];
            return (
              <button key={type} onClick={() => navigate(`/rutinas/${type}`)} className="text-left">
                <Card className="flex items-center gap-4 active:scale-[0.98] transition-transform">
                  <div className="w-12 h-12 rounded-2xl bg-moon-500/20 flex items-center justify-center text-2xl shrink-0">
                    {info.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{info.label}</p>
                    <p className="text-xs text-moon-300">{steps.length} pasos</p>
                  </div>
                  <span className="text-moon-300 text-lg">›</span>
                </Card>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </Screen>
  );
}
