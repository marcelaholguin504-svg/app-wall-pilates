import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/hooks/useApp";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { CloudRain, Waves, AudioLines, AudioWaveform, Radio, Fan, CarFront, Music2, Heart, Clock } from "lucide-react";
import { SOUNDS, TIMER_OPTIONS } from "@/data/soundsData";
import { articlesForProblem } from "@/data/educationalContent";
import { soundEngine } from "@/services/soundEngine";
import { trackEvent } from "@/services/events";
import type { TimerOption } from "@/types";

const ICONS: Record<string, typeof CloudRain> = {
  CloudRain,
  Waves,
  AudioLines,
  AudioWaveform,
  Radio,
  Fan,
  CarFront,
  Music2,
  Heart,
};

export default function Sounds() {
  const state = useAppState();
  const navigate = useNavigate();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [timer, setTimer] = useState<TimerOption>(30);
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  useEffect(() => () => soundEngine.stop(), []);

  function toggleSound(sound: (typeof SOUNDS)[number]) {
    if (playingId === sound.id) {
      soundEngine.stop();
      setPlayingId(null);
      return;
    }
    soundEngine.play(sound.type);
    soundEngine.setSleepTimer(timer);
    setPlayingId(sound.id);
    trackEvent("sonido_reproducido", { sound: sound.id, timer });
  }

  function changeTimer(minutes: TimerOption) {
    setTimer(minutes);
    if (playingId) soundEngine.setSleepTimer(minutes);
  }

  const child = state.child;
  const articles = child ? articlesForProblem(child.mainSleepProblem) : [];

  return (
    <Screen>
      <div className="px-5 pt-8">
        <h1 className="font-display text-2xl font-extrabold mb-1">Sonidos</h1>
        <p className="text-muted-foreground text-sm mb-6">Toca un sonido para reproducirlo. Vuelve a tocarlo para detenerlo.</p>

        <button
          onClick={() => navigate("/biblioteca")}
          className="w-full rounded-2xl p-4 mb-6 flex items-center justify-between border-2 border-border bg-card touch-target"
        >
          <span className="text-sm font-bold">📚 Biblioteca</span>
          <span className="text-muted-foreground">→</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {SOUNDS.map((sound) => {
            const Icon = ICONS[sound.icon] || Music2;
            const active = playingId === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound)}
                className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all touch-target ${
                  active ? "bg-primary/20 border-primary" : "bg-card border-border"
                }`}
              >
                <Icon className={`w-7 h-7 ${active ? "text-primary animate-breathe" : "text-foreground/80"}`} />
                <span className="text-sm font-semibold text-center">{sound.label}</span>
                {active && <span className="text-[10px] text-primary font-bold uppercase">Sonando</span>}
              </button>
            );
          })}
        </div>

        <Card className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Temporizador
          </p>
          <div className="flex gap-2 flex-wrap">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => changeTimer(opt.id)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-bold border touch-target ${
                  timer === opt.id ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {articles.length > 0 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2.5 px-1">
              Para lo que está pasando esta noche
            </p>
            <div className="flex flex-col gap-2.5">
              {articles.map((article) => (
                <Card key={article.id}>
                  <button
                    onClick={() => setOpenArticle(openArticle === article.id ? null : article.id)}
                    className="w-full text-left flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-bold leading-snug">{article.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{article.minutes} min</span>
                  </button>
                  {openArticle === article.id && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{article.body}</p>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </Screen>
  );
}
