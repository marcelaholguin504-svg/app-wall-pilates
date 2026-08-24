import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch } from "../state/AppContext.jsx";
import Screen from "../components/Screen.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { Button, Card, Sheet, Field, TextInput, SelectGrid, Badge } from "../components/ui.jsx";
import { CAREGIVER_ROLES } from "../content/caregiverRoles.js";
import { generateId } from "../lib/ids.js";

export default function Caregivers() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [inviting, setInviting] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [lastCode, setLastCode] = useState(null);

  function handleInvite() {
    if (!name.trim() || !role) {
      setError("Elige un nombre y un rol para invitar");
      return;
    }
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    dispatch({ type: "ADD_CAREGIVER", caregiver: { name: name.trim(), role, inviteCode: code } });
    setLastCode(code);
    setName("");
    setRole("");
    setError("");
  }

  function closeSheet() {
    setInviting(false);
    setLastCode(null);
    setError("");
  }

  const activeRole = state.settings.activeCaregiverRole;

  return (
    <Screen>
      <div className="px-5 pt-8">
        <h1 className="font-display text-2xl font-extrabold mb-1">Cuidadores</h1>
        <p className="text-moon-300 text-sm mb-6">
          Todos ven la misma próxima siesta, hora de dormir y último sueño de {state.child?.name || "tu bebé"}, y tienen acceso directo al botón SOS.
        </p>

        <Card className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-3">¿Quién usa la app ahora?</p>
          <div className="flex flex-wrap gap-2">
            {CAREGIVER_ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => dispatch({ type: "SET_ACTIVE_CAREGIVER_ROLE", role: r.id })}
                className={`px-3.5 py-2 rounded-full text-sm font-semibold border flex items-center gap-1.5 ${
                  activeRole === r.id
                    ? "bg-moon-500/20 border-moon-500 text-moon-300"
                    : "bg-night-800 border-night-600 text-white/60"
                }`}
              >
                <span>{r.emoji}</span> {r.label}
              </button>
            ))}
          </div>
          {(activeRole === "abuela" || activeRole === "abuelo") && (
            <button
              onClick={() => navigate("/modo-abuela")}
              className="mt-4 text-sm font-bold text-dawn-400"
            >
              👵 Abrir Modo Abuela (pantalla simplificada) →
            </button>
          )}
        </Card>

        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold uppercase tracking-wide text-moon-300">Personas invitadas</p>
          <button onClick={() => setInviting(true)} className="text-sm font-bold text-moon-300">
            + Invitar
          </button>
        </div>

        <div className="flex flex-col gap-2.5 mb-4">
          {state.caregivers.length === 0 && (
            <Card>
              <p className="text-sm text-white/50">Aún no has invitado a nadie. Toca "+ Invitar" para compartir el cuidado.</p>
            </Card>
          )}
          {state.caregivers.map((c) => {
            const roleInfo = CAREGIVER_ROLES.find((r) => r.id === c.role);
            return (
              <Card key={c.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-moon-500/20 flex items-center justify-center text-lg shrink-0">
                  {roleInfo?.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{c.name}</p>
                  <p className="text-xs text-moon-300">{roleInfo?.label}</p>
                </div>
                <Badge tone={c.status === "activo" ? "leaf" : "dawn"}>
                  {c.status === "activo" ? "Activo" : "Invitado"}
                </Badge>
                <button
                  onClick={() => dispatch({ type: "REMOVE_CAREGIVER", id: c.id })}
                  className="text-white/30 text-lg px-1"
                  aria-label="Quitar cuidador"
                >
                  ×
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      <Sheet open={inviting} onClose={closeSheet}>
        {lastCode ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-display text-lg font-extrabold mb-2">¡Invitación lista!</h3>
            <p className="text-white/70 text-sm mb-4">Comparte este código con la persona que invitaste:</p>
            <p className="font-display text-3xl font-extrabold tracking-widest text-moon-300 mb-6">{lastCode}</p>
            <Button onClick={closeSheet}>Listo</Button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-lg font-extrabold mb-4">Invitar cuidador</h3>
            <Field label="Nombre">
              <TextInput placeholder="Ej. Abuela Rosa" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Rol">
              <SelectGrid options={CAREGIVER_ROLES} value={role} onChange={setRole} columns={3} />
            </Field>
            {error && <p className="text-alert-400 text-sm mb-3">{error}</p>}
            <Button onClick={handleInvite}>Generar invitación</Button>
          </>
        )}
      </Sheet>

      <BottomNav />
    </Screen>
  );
}
