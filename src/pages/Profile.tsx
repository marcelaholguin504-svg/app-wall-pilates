import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppState } from "@/hooks/useApp";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";
import ChildAvatar from "@/components/ChildAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChoiceCard } from "@/components/ChoiceCard";
import { AGE_STAGES } from "@/data/ageStages";
import { CAREGIVER_TYPES, caregiverTypeEmoji, caregiverTypeLabel } from "@/data/caregiverTypes";
import { SLEEP_PROBLEM_OPTIONS, SCHEDULE_CONSISTENCY_OPTIONS, IMPROVEMENT_GOAL_OPTIONS } from "@/data/onboardingContent";
import { isAcceptedImage, resizeImageToDataUrl } from "@/services/photoService";
import { isToddlerStage } from "@/data/ageStages";
import { MEDICAL_DISCLAIMER } from "@/data/safetyContent";
import type { AgeStage, CaregiverType, ImprovementGoal, ScheduleConsistency, SleepProblem } from "@/types";

export default function Profile() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  const child = state.child;

  const [form, setForm] = useState(() => ({
    name: child?.name || "",
    birthDate: child?.birthDate || "",
    ageStage: (child?.ageStage || "0-3m") as AgeStage,
    caregiverType: (child?.caregiverType || "mama") as CaregiverType,
    mainSleepProblem: (child?.mainSleepProblem || "cuesta_dormirse") as SleepProblem,
    scheduleConsistency: (child?.scheduleConsistency || "sin_rutina_definida") as ScheduleConsistency,
    improvementGoal: (child?.improvementGoal || "sentir_que_tengo_un_plan") as ImprovementGoal,
  }));

  if (!child) return null;

  const toddler = isToddlerStage(form.ageStage);
  const problemOptions = SLEEP_PROBLEM_OPTIONS.filter((o) => !o.toddlerOnly || toddler);

  function saveProfile() {
    dispatch({ type: "UPDATE_PROFILE", patch: { ...form } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function openGallery() {
    setPhotoSheetOpen(false);
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!isAcceptedImage(file)) {
      setPhotoError("Usa una imagen JPG, PNG o WEBP.");
      return;
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setPreviewUrl(dataUrl);
      setPhotoError("");
    } catch {
      setPhotoError("No pudimos procesar esta foto. Intenta con otra.");
    }
  }

  function confirmPhoto() {
    if (previewUrl) dispatch({ type: "SET_PHOTO", photoDataUrl: previewUrl });
    setPreviewUrl(null);
  }

  function removePhoto() {
    dispatch({ type: "SET_PHOTO", photoDataUrl: undefined });
    setPhotoSheetOpen(false);
  }

  function resetAll() {
    dispatch({ type: "RESET_ALL" });
    navigate("/", { replace: true });
  }

  return (
    <Screen>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="px-5 pt-10 pb-4 text-center">
        <button
          onClick={() => setPhotoSheetOpen(true)}
          className="inline-block touch-target"
          aria-label="Cambiar foto del pequeño"
        >
          <ChildAvatar photoDataUrl={child.photoDataUrl} size={92} />
        </button>
        <h1 className="font-display text-xl font-extrabold mt-3">{child.name}</h1>
        <p className="text-muted-foreground text-sm">
          {AGE_STAGES.find((s) => s.id === child.ageStage)?.label} · {caregiverTypeEmoji(child.caregiverType)}{" "}
          {caregiverTypeLabel(child.caregiverType)}
        </p>
        <p className="text-[11px] text-muted-foreground/70 mt-2 max-w-[280px] mx-auto leading-relaxed">
          La foto es opcional y privada. Nunca se usa para publicidad ni reconocimiento facial.
        </p>
      </div>

      <div className="px-5 flex flex-col gap-5">
        <Card>
          <Label htmlFor="p-name">Nombre o apodo</Label>
          <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Card>

        <Card>
          <Label htmlFor="p-birth">Fecha de nacimiento (opcional)</Label>
          <Input
            id="p-birth"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          />
        </Card>

        <Card>
          <Label>Etapa</Label>
          <div className="grid grid-cols-2 gap-2">
            {AGE_STAGES.map((s) => (
              <ChoiceCard
                key={s.id}
                label={s.label}
                selected={form.ageStage === s.id}
                onClick={() => setForm({ ...form, ageStage: s.id })}
                className="justify-center text-center py-3"
              />
            ))}
          </div>
        </Card>

        <Card>
          <Label>Cuidador principal</Label>
          <div className="grid grid-cols-2 gap-2">
            {CAREGIVER_TYPES.map((c) => (
              <ChoiceCard
                key={c.id}
                emoji={c.emoji}
                label={c.label}
                selected={form.caregiverType === c.id}
                onClick={() => setForm({ ...form, caregiverType: c.id })}
                className="justify-center text-center py-3"
              />
            ))}
          </div>
        </Card>

        <Card>
          <Label>Problema principal</Label>
          <div className="flex flex-col gap-2">
            {problemOptions.map((o) => (
              <ChoiceCard
                key={o.id}
                emoji={o.emoji}
                label={o.label}
                selected={form.mainSleepProblem === o.id}
                onClick={() => setForm({ ...form, mainSleepProblem: o.id })}
              />
            ))}
          </div>
        </Card>

        <Card>
          <Label>Rutina</Label>
          <div className="flex flex-col gap-2">
            {SCHEDULE_CONSISTENCY_OPTIONS.map((o) => (
              <ChoiceCard
                key={o.id}
                label={o.label}
                selected={form.scheduleConsistency === o.id}
                onClick={() => setForm({ ...form, scheduleConsistency: o.id })}
              />
            ))}
          </div>
        </Card>

        <Card>
          <Label>Objetivo</Label>
          <div className="flex flex-col gap-2">
            {IMPROVEMENT_GOAL_OPTIONS.map((o) => (
              <ChoiceCard
                key={o.id}
                label={o.label}
                selected={form.improvementGoal === o.id}
                onClick={() => setForm({ ...form, improvementGoal: o.id })}
              />
            ))}
          </div>
        </Card>

        <Button size="lg" onClick={saveProfile}>
          {saved ? "Guardado ✓" : "Guardar cambios"}
        </Button>

        <button onClick={() => navigate("/cuidadores")} className="text-sm font-bold text-primary text-center">
          👨‍👩‍👧 Personas que cuidan a {child.name} →
        </button>

        <button onClick={() => navigate("/patrones")} className="text-sm font-bold text-primary text-center">
          📈 Ver patrones →
        </button>

        <Card className="text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">{MEDICAL_DISCLAIMER}</p>
        </Card>

        <button onClick={() => setConfirmReset(true)} className="text-sm font-semibold text-destructive text-center pb-4">
          Borrar todos mis datos
        </button>
      </div>

      <Sheet open={photoSheetOpen} onOpenChange={setPhotoSheetOpen}>
        <SheetContent>
          <SheetTitle>Cambiar foto</SheetTitle>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={openGallery}>
              Elegir de mi galería
            </Button>
            {child.photoDataUrl && (
              <Button variant="destructive" onClick={removePhoto}>
                Eliminar foto
              </Button>
            )}
            <Button variant="ghost" onClick={() => setPhotoSheetOpen(false)}>
              Cancelar
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(previewUrl)} onOpenChange={(open) => !open && setPreviewUrl(null)}>
        <DialogContent>
          <DialogTitle>¿Usar esta foto?</DialogTitle>
          {previewUrl && (
            <img src={previewUrl} alt="Vista previa" className="w-32 h-32 rounded-full object-cover mx-auto mb-5" />
          )}
          <div className="flex flex-col gap-2">
            <Button onClick={confirmPhoto}>Guardar foto</Button>
            <Button variant="ghost" onClick={() => setPreviewUrl(null)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(photoError)} onOpenChange={() => setPhotoError("")}>
        <DialogContent>
          <DialogTitle>No pudimos usar esa imagen</DialogTitle>
          <DialogDescription>{photoError}</DialogDescription>
          <Button onClick={() => setPhotoError("")}>Entendido</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogTitle>¿Borrar todos tus datos?</DialogTitle>
          <DialogDescription>
            Esto elimina el perfil, los registros y el plan guardados en este dispositivo. No se puede deshacer.
          </DialogDescription>
          <div className="flex flex-col gap-2">
            <Button variant="destructive" onClick={resetAll}>
              Sí, borrar todo
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </Screen>
  );
}
