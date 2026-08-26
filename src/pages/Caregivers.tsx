import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/hooks/useApp";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MAX_INVITED_CAREGIVERS, type AccountMember } from "@/types";
import { fetchAccountMembers, inviteCaregiver, revokeCaregiver } from "@/services/accountService";

function statusLabel(status: AccountMember["status"]) {
  if (status === "activo") return "Activo";
  if (status === "invitación pendiente") return "Invitación pendiente";
  return "Revocado";
}

export default function Caregivers() {
  const state = useAppState();
  const { membership } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState<AccountMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSentTo, setInviteSentTo] = useState<string | null>(null);

  const [revoking, setRevoking] = useState<AccountMember | null>(null);
  const [revokeError, setRevokeError] = useState("");

  const child = state.child;
  const isAdmin = membership?.role === "admin";

  async function loadMembers() {
    setLoading(true);
    const list = await fetchAccountMembers();
    setMembers(list);
    setLoading(false);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const invitedCaregiversCount = members.filter(
    (m) => m.role === "cuidador" && (m.status === "activo" || m.status === "invitación pendiente")
  ).length;
  const atLimit = invitedCaregiversCount >= MAX_INVITED_CAREGIVERS;

  async function handleInvite() {
    setInviteError("");
    if (!email.trim()) {
      setInviteError("Escribe un correo.");
      return;
    }
    setInviting(true);
    try {
      await inviteCaregiver(email);
      setInviteSentTo(email.trim());
      setEmail("");
      await loadMembers();
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "No se pudo enviar la invitación.");
    } finally {
      setInviting(false);
    }
  }

  function closeInviteSheet() {
    setAdding(false);
    setInviteSentTo(null);
    setInviteError("");
    setEmail("");
  }

  async function handleRevoke() {
    if (!revoking) return;
    setRevokeError("");
    try {
      await revokeCaregiver(revoking.id);
      setRevoking(null);
      await loadMembers();
    } catch (err) {
      setRevokeError(err instanceof Error ? err.message : "No se pudo quitar el acceso.");
    }
  }

  if (!child) return null;

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm font-semibold mb-4 touch-target">
        ← Atrás
      </button>

      <h1 className="font-display text-2xl font-extrabold mb-1">Cuidadores con acceso a {child.name}</h1>
      <p className="text-muted-foreground text-sm mb-6">
        {isAdmin
          ? "Como administradora, puedes invitar hasta 4 cuidadores adicionales y quitarles el acceso cuando quieras."
          : "Estas son las personas que hoy tienen acceso a la app de " + child.name + "."}
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : (
        <div className="flex flex-col gap-2.5 mb-6">
          {members.map((m) => (
            <Card key={m.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg shrink-0">
                {m.role === "admin" ? "👑" : "❤️"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{m.email}</p>
                <p className="text-xs text-muted-foreground">{m.role === "admin" ? "Administradora" : "Cuidador"}</p>
              </div>
              <Badge variant={m.status === "activo" ? "success" : "outline"}>{statusLabel(m.status)}</Badge>
              {isAdmin && m.role !== "admin" && (
                <button
                  onClick={() => setRevoking(m)}
                  className="text-destructive text-xs font-bold px-1 touch-target shrink-0"
                >
                  Quitar acceso
                </button>
              )}
            </Card>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          {atLimit ? (
            <Card className="text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ya invitaste al máximo de cuidadores (4). Si necesitas más, contáctanos.
              </p>
            </Card>
          ) : (
            <Button onClick={() => setAdding(true)}>+ Invitar cuidador</Button>
          )}
        </>
      )}

      <Sheet open={adding} onOpenChange={closeInviteSheet}>
        <SheetContent>
          {inviteSentTo ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">💜</div>
              <h3 className="font-display text-lg font-extrabold mb-2">Invitación enviada</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Le mandamos un enlace de acceso a <span className="font-semibold text-foreground">{inviteSentTo}</span>.
              </p>
              <Button onClick={closeInviteSheet}>Listo</Button>
            </div>
          ) : (
            <>
              <SheetTitle>¿Cuál es el correo de la persona que quieres invitar?</SheetTitle>
              <Label htmlFor="invite-email">Correo electrónico</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="cuidador@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              {inviteError && <p className="text-destructive text-sm mb-4">{inviteError}</p>}
              <Button onClick={handleInvite} disabled={inviting}>
                {inviting ? "Enviando…" : "Enviar invitación"}
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(revoking)} onOpenChange={(open) => !open && setRevoking(null)}>
        <DialogContent>
          <DialogTitle>¿Quitar el acceso de {revoking?.email}?</DialogTitle>
          <DialogDescription>
            Ya no podrá entrar a Duerme Ya. Sus registros anteriores se conservan, no se borran.
          </DialogDescription>
          {revokeError && <p className="text-destructive text-sm mb-3">{revokeError}</p>}
          <div className="flex flex-col gap-2">
            <Button variant="destructive" onClick={handleRevoke}>
              Quitar acceso
            </Button>
            <Button variant="ghost" onClick={() => setRevoking(null)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
