import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppContext.jsx";
import Screen from "../components/Screen.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { Button, Card, Badge } from "../components/ui.jsx";
import { SOUND_LIBRARY, TIMER_OPTIONS } from "../content/sounds.js";
import { soundEngine } from "../lib/soundEngine.js";

export default function Sounds() {
  const state = useAppState();
  const navigate = useNavigate();
  const [playingId, setPlayingId] = useState(null);
  const [timer, setTimer] = useState(30);
  const isPlus = state.subscription.plan === "plus";

  useEffect(() => () => soundEngine.stop(), []);

  function toggleSound(sound) {
    if (!sound.free && !isPlus) {
      navigate("/suscripcion");
      return;
    }
    if (playingId === sound.id) {
      soundEngine.stop();
      setPlayingId(null);
      return;
    }
    soundEngine.play(sound.type);
    soundEngine.setSleepTimer(timer);
    setPlayingId(sound.id);
  }

  function changeTimer(minutes) {
    setTimer(minutes);
    if (playingId) soundEngine.setSleepTimer(minutes);
  }

  return (
    <Screen>
      <div className="px-5 pt-8">
        <h1 className="font-display text-2xl font-extrabold mb-1">Sonidos para dormir</h1>
        <p className="text-moon-300 text-sm mb-6">Toca un sonido para reproducirlo. Vuelve a tocarlo para detenerlo.</p>

        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {SOUND_LIBRARY.map((sound) => {
            const locked = !sound.free && !isPlus;
            const active = playingId === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound)}
                className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all relative ${
                  active ? "bg-moon-500/25 border-moon-500" : "bg-night-800 border-night-600"
                }`}
              >
                {locked && <span className="absolute top-2 right-2 text-xs">🔒</span>}
                <span className={`text-3xl ${active ? "animate-breathe" : ""}`}>{sound.emoji}</span>
                <span className="text-sm font-semibold">{sound.label}</span>
                {active && <span className="text-[10px] text-moon-300 font-bold uppercase">Sonando</span>}
              </button>
            );
          })}
        </div>

        <Card className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-3">Temporizador</p>
          <div className="flex gap-2">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => changeTimer(opt.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${
                  timer === opt.id ? "bg-moon-600 border-moon-500 text-white" : "bg-night-800 border-night-600 text-white/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {!isPlus && (
          <Card className="text-center">
            <Badge tone="dawn">Sueño+</Badge>
            <p className="text-sm text-white/70 mt-2 mb-3">Desbloquea toda la biblioteca de sonidos con Sueño+.</p>
            <Button onClick={() => navigate("/suscripcion")}>Ver Sueño+</Button>
          </Card>
        )}
      </div>
      <BottomNav />
    </Screen>
  );
}
