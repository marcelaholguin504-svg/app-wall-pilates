import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch } from "@/hooks/useApp";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { PlanAction } from "@/types";

type Section = "morning" | "afternoon" | "night";

const SECTIONS: { id: Section; label: string; emoji: string }[] = [
  { id: "morning", label: "Mañana", emoji: "☀️" },
  { id: "afternoon", label: "Tarde", emoji: "🌤️" },
  { id: "night", label: "Noche", emoji: "🌙" },
];

export default function Plan() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [draft, setDraft] = useState<PlanAction[]>([]);

  const child = state.child;
  if (!child) return null;

  function openEdit(section: Section) {
    setDraft(state.plan[section].map((a) => ({ ...a })));
    setEditingSection(section);
  }

  function saveEdit() {
    if (!editingSection) return;
    const cleaned = draft.filter((a) => a.text.trim());
    dispatch({ type: "UPDATE_PLAN_SECTION", section: editingSection, actions: cleaned });
    setEditingSection(null);
  }

  return (
    <Screen>
      <div className="px-5 pt-8">
        <h1 className="font-display text-2xl font-extrabold mb-1">Plan de {child.name}</h1>
        <p className="text-muted-foreground text-sm mb-2 font-bold uppercase tracking-wide">Hoy</p>

        <div className="flex flex-col gap-4 mb-5">
          {SECTIONS.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-display font-bold flex items-center gap-2">
                  <span>{s.emoji}</span> {s.label.toUpperCase()}
                </p>
                <button onClick={() => openEdit(s.id)} className="text-xs font-bold text-primary touch-target">
                  Editar
                </button>
              </div>
              {state.plan[s.id].length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin acciones para este bloque todavía.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {state.plan[s.id].map((action) => (
                    <li key={action.id} className="text-sm leading-relaxed">
                      {action.text}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>

        <Card className="text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Este plan es una guía. Puedes ajustarlo según las señales de {child.name}.
          </p>
        </Card>

        <button
          onClick={() => navigate("/consejos")}
          className="text-sm font-bold text-primary text-center mt-4"
        >
          💡 Consejos para dormir mejor
        </button>
      </div>

      <Sheet open={Boolean(editingSection)} onOpenChange={(open) => !open && setEditingSection(null)}>
        <SheetContent>
          <SheetTitle>
            Editar {editingSection ? SECTIONS.find((s) => s.id === editingSection)?.label.toLowerCase() : ""}
          </SheetTitle>
          <p className="text-xs text-muted-foreground mb-4">Hasta 3 acciones. Deja en blanco la que no quieras usar.</p>
          <div className="flex flex-col gap-2.5 mb-5">
            {[0, 1, 2].map((i) => (
              <Input
                key={i}
                placeholder={`Acción ${i + 1}`}
                value={draft[i]?.text || ""}
                onChange={(e) => {
                  const next = [...draft];
                  if (next[i]) next[i] = { ...next[i], text: e.target.value };
                  else next[i] = { id: `new_${i}_${Date.now()}`, text: e.target.value };
                  setDraft(next);
                }}
              />
            ))}
          </div>
          <Button onClick={saveEdit}>Guardar cambios</Button>
        </SheetContent>
      </Sheet>

      <BottomNav />
    </Screen>
  );
}
