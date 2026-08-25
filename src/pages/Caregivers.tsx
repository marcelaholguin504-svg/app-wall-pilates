import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CAREGIVER_TYPES, caregiverTypeEmoji, caregiverTypeLabel } from "@/data/caregiverTypes";
import type { CaregiverType } from "@/types";

export default function Caregivers() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CaregiverType | "">("");
  const [error, setError] = useState("");

  const child = state.child;
  if (!child) return null;

  function handleAdd() {
    if (!name.trim() || !type) {
      setError("Escribe un nombre y elige quién es.");
      return;
    }
    dispatch({ type: "ADD_CAREGIVER", caregiver: { name: name.trim(), type } });
    setName("");
    setType("");
    setError("");
    setAdding(false);
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm font-semibold mb-4 touch-target">
        ← Atrás
      </button>

      <h1 className="font-display text-2xl font-extrabold mb-1">Cuidadores de {child.name}</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Esto es para todos los que cuidan a {child.name}: mamá, papá, abuelas, abuelos, niñeras o cualquier persona que lo
        acompañe a dormir.
      </p>

      <Card className="mb-6 bg-primary/10 border-primary/30">
        <p className="text-sm font-bold mb-1.5">Compartir con cuidadores — próximamente</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Pronto todos los que cuidan a {child.name} podrán ver la misma última siesta, el mismo último despertar, la
          misma rutina y el mismo plan desde su propio teléfono. Por ahora, esta lista se guarda solo en este dispositivo.
        </p>
      </Card>

      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Personas agregadas</p>
        <button onClick={() => setAdding(true)} className="text-sm font-bold text-primary touch-target">
          + Agregar cuidador
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {state.caregivers.length === 0 && (
          <Card>
            <p className="text-sm text-muted-foreground">Aún no has agregado a nadie más.</p>
          </Card>
        )}
        {state.caregivers.map((c) => (
          <Card key={c.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg shrink-0">
              {caregiverTypeEmoji(c.type)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{c.name}</p>
              <Badge variant="outline">{caregiverTypeLabel(c.type)}</Badge>
            </div>
            <button
              onClick={() => dispatch({ type: "REMOVE_CAREGIVER", id: c.id })}
              className="text-muted-foreground/50 text-lg px-2 touch-target"
              aria-label="Quitar cuidador"
            >
              ×
            </button>
          </Card>
        ))}
      </div>

      <Sheet open={adding} onOpenChange={setAdding}>
        <SheetContent>
          <SheetTitle>Agregar cuidador</SheetTitle>
          <Label htmlFor="cg-name">Nombre</Label>
          <Input id="cg-name" placeholder="Ej. Abuela Rosa" value={name} onChange={(e) => setName(e.target.value)} className="mb-4" />
          <Label>¿Quién es?</Label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {CAREGIVER_TYPES.map((c) => (
              <button
                key={c.id}
                onClick={() => setType(c.id)}
                className={`rounded-xl p-3 flex flex-col items-center gap-1 border-2 touch-target ${
                  type === c.id ? "bg-primary/20 border-primary" : "bg-muted border-border"
                }`}
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="text-[11px] font-semibold text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
          {error && <p className="text-destructive text-sm mb-3">{error}</p>}
          <Button onClick={handleAdd}>Agregar</Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
