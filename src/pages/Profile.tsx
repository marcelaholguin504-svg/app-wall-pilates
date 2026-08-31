import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppState } from "@/hooks/useApp";
import { useAuth } from "@/hooks/useAuth";
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
import { IconBadge } from "@/components/IconBadge";
import { AGE_STAGES } from "@/data/ageStages";
import { CAREGIVER_TYPES, caregiverTypeIcon, caregiverTypeLabel } from "@/data/caregiverTypes";
import { SLEEP_PROBLEM_OPTIONS, SCHEDULE_CONSISTENCY_OPTIONS, IMPROVEMENT_GOAL_OPTIONS } from "@/data/onboardingContent";
import { isAcceptedImage, resizeImageToDataUrl } from "@/services/photoService";
import { isToddlerStage } from "@/data/ageStages";
import { MEDICAL_DISCLAIMER } from "@/data/safetyContent";
import { deleteAccountData, fetchAccountMembers, leaveAccount } from "@/services/accountService";
import type { AgeStage, CaregiverType, ImprovementGoal, ScheduleConsistency, SleepProblem } from "@/types";

const DELETE_CONFIRM_WORD = "BORRAR";

export default function Profile() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { session, membership, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [saved, setSaved] = useState(false);

  const isAdmin = membership?.role === "admin";
  const [invitedCount, setInvitedCount] = useState(0);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const child = state.child;

  useEffect(() => {
    if (!isAdmin) return;
    fetchAccountMembers().then((members) => {
      const count = members.filter(
        (m) => m.role === "cuidador" && (m.status === "activo" || m.status === "invitación pendiente")
      ).length;
      setInvitedCount(count);
    });
  }, [isAdmin]);

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

  async function handleSignOut() {
    await signOut();
    navigate("/entrar", { replace: true });
  }

  async function handleLeaveAccount() {
    setLeaving(true);
    setLeaveError("");
    try {
      await leaveAccount();
      await signOut();
      navigate("/entrar", { replace: true });
    } catch (err) {
      setLeaveError(err instanceof Error ? err.message : "No se pudo salir de la cuenta.");
      setLeaving(false);
    }
  }

  async function handleDeleteAllData() {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccountData();
      await signOut();
      navigate("/entrar", { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "No se pudieron borrar los datos.");
      setDeleting(false);
    }
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
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
          <span>{AGE_STAGES.find((s) => s.id === child.ageStage)?.label} ·</span>
          <IconBadge icon={caregiverTypeIcon(child.caregiverType)} size="sm" />
          <span>{caregiverTypeLabel(child.caregiverType)}</span>
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
                icon={c.icon}
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
                icon={o.icon}
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

        <button
          onClick={() => navigate("/cuidadores")}
          className="flex items-center justify-center gap-1.5 text-sm font-bold text-primary text-center"
        >
          <Users className="w-4 h-4" /> Personas que cuidan a {child.name} →
        </button>

        <button
          onClick={() => navigate("/patrones")}
          className="flex items-center justify-center gap-1.5 text-sm font-bold text-primary text-center"
        >
          <TrendingUp className="w-4 h-4" /> Ver patrones →
        </button>

        <Card className="text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">{MEDICAL_DISCLAIMER}</p>
        </Card>

        <Card className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Sesión iniciada como</p>
          <p className="text-sm font-semibold mb-1">{session?.user?.email}</p>
          <p className="text-xs text-muted-foreground">
            {membership?.role === "admin" ? "Administradora" : "Cuidador"}
          </p>
        </Card>

        <button onClick={() => navigate("/privacidad")} className="text-sm font-bold text-primary text-center">
          Privacidad y seguridad
        </button>

        <button
          onClick={() => setConfirmSignOut(true)}
          className="text-sm font-semibold text-destructive text-center"
        >
          Cerrar sesión
        </button>

        {isAdmin ? (
          <button
            onClick={() => setConfirmDeleteAll(true)}
            className="text-sm font-semibold text-destructive text-center pb-4"
          >
            Borrar todos mis datos
          </button>
        ) : (
          <button
            onClick={() => setConfirmLeave(true)}
            className="text-sm font-semibold text-destructive text-center pb-4"
          >
            Salir de esta cuenta
          </button>
        )}
        <p className="text-center text-[10px] text-muted-foreground/50 pt-2">Versión: {__APP_COMMIT_HASH__}</p>
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

      <Dialog open={confirmSignOut} onOpenChange={setConfirmSignOut}>
        <DialogContent>
          <DialogTitle>¿Cerrar sesión?</DialogTitle>
          <DialogDescription>
            El perfil de {child.name} y sus registros quedan guardados. Puedes volver a entrar con tu correo cuando
            quieras.
          </DialogDescription>
          <div className="flex flex-col gap-2">
            <Button variant="destructive" onClick={handleSignOut}>
              Cerrar sesión
            </Button>
            <Button variant="ghost" onClick={() => setConfirmSignOut(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmLeave}
        onOpenChange={(open) => {
          setConfirmLeave(open);
          if (!open) setLeaveError("");
        }}
      >
        <DialogContent>
          <DialogTitle>¿Salir de esta cuenta?</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres dejar de tener acceso a {child.name}? Podrás volver a entrar solo si te invitan de
            nuevo.
          </DialogDescription>
          {leaveError && <p className="text-destructive text-sm mb-3">{leaveError}</p>}
          <div className="flex flex-col gap-2">
            <Button variant="destructive" onClick={handleLeaveAccount} disabled={leaving}>
              {leaving ? "Saliendo…" : "Salir de esta cuenta"}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmLeave(false)} disabled={leaving}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDeleteAll}
        onOpenChange={(open) => {
          setConfirmDeleteAll(open);
          if (!open) {
            setDeleteConfirmText("");
            setDeleteError("");
          }
        }}
      >
        <DialogContent>
          <DialogTitle>¿Borrar todos tus datos?</DialogTitle>
          <DialogDescription>
            Esto eliminará el perfil de {child.name}
            {invitedCount > 0
              ? ` y quitará el acceso a ${invitedCount === 1 ? "el cuidador" : `los ${invitedCount} cuidadores`} que invitaste`
              : ""}
            . Esta acción no se puede deshacer.
          </DialogDescription>
          <Label htmlFor="delete-confirm">
            Para confirmar, escribe <span className="font-bold text-foreground">{DELETE_CONFIRM_WORD}</span>
          </Label>
          <Input
            id="delete-confirm"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder={DELETE_CONFIRM_WORD}
            className="mb-4"
            autoComplete="off"
          />
          {deleteError && <p className="text-destructive text-sm mb-3">{deleteError}</p>}
          <div className="flex flex-col gap-2">
            <Button
              variant="destructive"
              onClick={handleDeleteAllData}
              disabled={deleteConfirmText !== DELETE_CONFIRM_WORD || deleting}
            >
              {deleting ? "Borrando…" : "Borrar todos mis datos"}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDeleteAll(false)} disabled={deleting}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </Screen>
  );
}
