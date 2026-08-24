import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch } from "../state/AppContext.jsx";
import { Button, Card, Badge } from "../components/ui.jsx";
import { PLANS, PAYWALL_DISCLAIMER } from "../content/plans.js";
import { trackEvent } from "../lib/analytics.js";
import { EVENTS } from "../content/analyticsEvents.js";

export default function Paywall() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState("yearly");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    trackEvent(EVENTS.PAYWALL_VIEWED);
  }, []);

  const isPlus = state.subscription.plan === "plus";
  const priceInfo = PLANS.plus[cycle];

  function startTrial() {
    trackEvent(EVENTS.TRIAL_STARTED, { cycle });
    dispatch({ type: "SET_SUBSCRIPTION", plan: "plus", billingCycle: cycle });
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
        <div className="text-6xl mb-5">🌙✨</div>
        <h2 className="font-display text-2xl font-extrabold mb-3">¡Bienvenida a Sueño+!</h2>
        <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-[300px]">
          Ya tienes acceso a SOS ilimitado, Modo Cuidador completo, sonidos, Voz de Mamá y mucho más.
        </p>
        <Button size="lg" onClick={() => navigate("/inicio")}>
          Ir a inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate(-1)} className="text-moon-300 text-sm font-semibold mb-4">
        ← Atrás
      </button>

      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🌙</div>
        <h1 className="font-display text-2xl font-extrabold mb-1">Sueño+</h1>
        <p className="text-moon-300 text-sm max-w-[300px] mx-auto">
          Todo lo que necesitas para acompañar el sueño de tu bebé, sin límites.
        </p>
      </div>

      {isPlus ? (
        <Card className="mb-6 text-center py-6">
          <Badge tone="leaf">Ya tienes Sueño+</Badge>
          <p className="text-white/70 text-sm mt-3">Gracias por confiar en Dulce Sueño 💜</p>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 mb-5 bg-night-800 rounded-2xl p-1.5">
            <button
              onClick={() => setCycle("monthly")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${cycle === "monthly" ? "bg-moon-600 text-white" : "text-white/50"}`}
            >
              Mensual
            </button>
            <button
              onClick={() => setCycle("yearly")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${cycle === "yearly" ? "bg-moon-600 text-white" : "text-white/50"}`}
            >
              Anual
            </button>
          </div>

          <Card className="mb-6 border-moon-500/50">
            <div className="flex items-end gap-1 mb-1">
              <span className="font-display text-3xl font-extrabold">{priceInfo.priceLabel}</span>
              <span className="text-moon-300 text-sm mb-1">{priceInfo.period}</span>
            </div>
            {priceInfo.savingsLabel && <Badge tone="leaf">{priceInfo.savingsLabel}</Badge>}

            <ul className="mt-5 flex flex-col gap-2.5">
              {PLANS.plus.features.map((f) => (
                <li key={f} className="text-sm text-white/85 flex items-start gap-2">
                  <span className="text-leaf-400 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
          </Card>

          <Button size="lg" onClick={startTrial} className="mb-3">
            Empezar con Sueño+ →
          </Button>
        </>
      )}

      <details className="mb-6">
        <summary className="text-sm text-white/50 font-semibold cursor-pointer select-none">
          Ver qué incluye el plan Gratis
        </summary>
        <ul className="mt-3 flex flex-col gap-2">
          {PLANS.free.features.map((f) => (
            <li key={f} className="text-sm text-white/60 flex items-start gap-2">
              <span className="text-white/30 mt-0.5">·</span> {f}
            </li>
          ))}
        </ul>
      </details>

      <p className="text-center text-xs text-white/40 leading-relaxed">{PAYWALL_DISCLAIMER}</p>
    </div>
  );
}
