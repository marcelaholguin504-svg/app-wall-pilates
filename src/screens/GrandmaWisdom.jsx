import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Pill } from "../components/ui.jsx";
import { GRANDMA_WISDOM, WISDOM_CATEGORIES } from "../content/grandmaWisdom.js";

const badgeTone = { respaldada: "leaf", tradicional: "dawn", no_recomendada: "alert" };

export default function GrandmaWisdom() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("todas");

  const items = filter === "todas" ? GRANDMA_WISDOM : GRANDMA_WISDOM.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate(-1)} className="text-moon-300 text-sm font-semibold mb-4">
        ← Atrás
      </button>

      <div className="text-center mb-2">
        <div className="text-4xl mb-2">👵</div>
        <h1 className="font-display text-2xl font-extrabold mb-1">Sabiduría de las Abuelas</h1>
        <p className="text-moon-300 text-sm max-w-[320px] mx-auto">
          Costumbres de generaciones, explicadas con honestidad: qué tiene respaldo, qué es solo tradición y qué ya no se recomienda.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto py-4 -mx-5 px-5">
        <Pill active={filter === "todas"} onClick={() => setFilter("todas")}>
          Todas
        </Pill>
        {Object.entries(WISDOM_CATEGORIES).map(([key, cat]) => (
          <Pill key={key} active={filter === key} onClick={() => setFilter(key)}>
            {cat.emoji} {cat.label}
          </Pill>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-bold text-white leading-snug">{item.title}</p>
              <Badge tone={badgeTone[item.category]}>
                {WISDOM_CATEGORIES[item.category].emoji} {WISDOM_CATEGORIES[item.category].label}
              </Badge>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-white/30 leading-relaxed mt-6 px-4">
        Esta sección es informativa y no reemplaza la recomendación de tu pediatra.
      </p>
    </div>
  );
}
