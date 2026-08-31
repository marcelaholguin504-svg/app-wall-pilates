import { useNavigate } from "react-router-dom";
import { Bath, Shirt, Droplet, BedDouble, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/IconBadge";

// Contenido tal como fue redactado — no se reescribe aquí, solo se le da
// formato de pantalla.

const BATH_ROUTINE = [
  "Agua tibia (aprox. 37°C) — revisa la temperatura con el codo o la muñeca, nunca solo con la mano.",
  "10-15 minutos es suficiente.",
  "Después del baño, seca con suavidad, prestando atención a los pliegues de la piel.",
  "Masaje suave con crema hidratante sin fragancia.",
  "Puedes empezar esta rutina desde los 3 meses.",
];

const FABRICS = [
  "Algodón 100% en todo lo que toque la piel directamente (pijama, sábanas, cobijas).",
  "Evita lana tradicional, poliéster y mezclas sintéticas.",
  "Busca costuras planas y sin etiquetas rígidas en el cuello o la espalda.",
  "Si la piel es muy sensible, el bambú es una buena alternativa.",
  "Lava la ropa nueva antes de usarla por primera vez.",
];

const SKIN_CARE = [
  "Seca sin frotar después del baño.",
  "Aplica crema hidratante sin fragancia de inmediato.",
  "Usa detergente neutro, sin perfume, sin suavizante.",
  "Si puedes, haz doble enjuague en el lavado.",
];

const SHEETS = [
  "Algodón 100%, sin colorantes fuertes.",
  "Para bebés pequeños: nada suelto en la cuna (sin peluches, cobijas sueltas ni almohadas).",
];

const HABITS = [
  "Ir a dormir siempre a la misma hora.",
  "Sin pantallas al menos 1 hora antes de dormir (de 0 a 18 meses: nada de pantallas, salvo videollamadas).",
  "El lugar donde duerme debe estar oscuro, sin lámparas encendidas.",
  "Nada de azúcar en las noches.",
];

export default function SleepTips() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-5 pt-6 pb-12">
      <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm font-semibold mb-4 touch-target">
        ← Atrás
      </button>

      <h1 className="font-display text-2xl font-extrabold mb-6">Consejos para dormir mejor</h1>

      <div className="flex flex-col gap-4">
        <Card>
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <IconBadge icon={Bath} /> Rutina de baño antes de dormir
          </h2>
          <ol className="list-decimal pl-5 flex flex-col gap-1.5 text-sm text-foreground/90 leading-relaxed">
            {BATH_ROUTINE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <IconBadge icon={Shirt} /> Telas recomendadas
          </h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90 leading-relaxed">
            {FABRICS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <IconBadge icon={Droplet} /> Cuidado de la piel antes de dormir
          </h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90 leading-relaxed">
            {SKIN_CARE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <IconBadge icon={BedDouble} /> Sábanas recomendadas
          </h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90 leading-relaxed">
            {SHEETS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <IconBadge icon={Clock} /> Hábitos que ayudan
          </h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90 leading-relaxed">
            {HABITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
