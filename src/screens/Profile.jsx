import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch } from "../state/AppContext.jsx";
import Screen from "../components/Screen.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { Card, Sheet, Field, TextInput, Button, Badge } from "../components/ui.jsx";

function MenuItem({ icon, label, onClick, trailing }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3.5 bg-night-800 border border-night-600 rounded-2xl px-4 py-3.5 mb-2">
      <div className="w-9 h-9 rounded-xl bg-moon-500/20 flex items-center justify-center text-lg shrink-0">{icon}</div>
      <span className="flex-1 text-left text-sm font-semibold">{label}</span>
      {trailing || <span className="text-white/30">›</span>}
    </button>
  );
}

export default function Profile() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editingChild, setEditingChild] = useState(false);
  const [editingNight, setEditingNight] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [childDraft, setChildDraft] = useState(state.child || {});

  function saveChild() {
    dispatch({ type: "UPDATE_CHILD", patch: childDraft });
    setEditingChild(false);
  }

  function logout() {
    dispatch({ type: "LOGOUT" });
    navigate("/registro", { replace: true });
  }

  return (
    <Screen>
      <div className="px-5 pt-10 pb-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-moon-500 to-dawn-500 flex items-center justify-center text-4xl mx-auto mb-3 shadow-glow">
          🌙
        </div>
        <h1 className="font-display text-xl font-extrabold">{state.user?.name}</h1>
        <p className="text-moon-300 text-sm">{state.user?.email}</p>
        <div className="mt-2">
          <Badge tone={state.subscription.plan === "plus" ? "leaf" : "moon"}>
            {state.subscription.plan === "plus" ? "Sueño+ activo 🌙" : "Plan Gratis"}
          </Badge>
        </div>
      </div>

      <div className="px-5">
        <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-2.5 mt-4">Perfil del bebé</p>
        <MenuItem icon="👶" label={`Editar a ${state.child?.name || "tu bebé"}`} onClick={() => setEditingChild(true)} />

        <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-2.5 mt-5">Sueño+</p>
        <MenuItem icon="🌙" label="Suscripción y planes" onClick={() => navigate("/suscripcion")} />

        <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-2.5 mt-5">Descubre más</p>
        <MenuItem icon="👵" label="Sabiduría de las Abuelas" onClick={() => navigate("/sabiduria-abuelas")} />
        <MenuItem icon="❤️" label="Voz de Mamá" onClick={() => navigate("/voz-mama")} />
        <MenuItem icon="🎵" label="Sonidos para dormir" onClick={() => navigate("/sonidos")} />

        <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-2.5 mt-5">Preferencias</p>
        <MenuItem icon="🌌" label="Modo SOS nocturno" onClick={() => setEditingNight(true)} />
        <MenuItem icon="🌐" label="Idioma" trailing={<span className="text-white/40 text-sm">Español</span>} onClick={() => {}} />

        <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-2.5 mt-5">Cuenta</p>
        <MenuItem icon="🚪" label="Cerrar sesión" onClick={() => setConfirmLogout(true)} />

        <p className="text-center text-[11px] text-white/30 leading-relaxed mt-8 px-4">
          Dulce Sueño no diagnostica enfermedades ni sustituye la consulta con tu pediatra. v1.0.0
        </p>
      </div>

      <Sheet open={editingChild} onClose={() => setEditingChild(false)}>
        <h3 className="font-display text-lg font-extrabold mb-4">Editar perfil del bebé</h3>
        <Field label="Nombre">
          <TextInput value={childDraft.name || ""} onChange={(e) => setChildDraft({ ...childDraft, name: e.target.value })} />
        </Field>
        <Field label="Fecha de nacimiento">
          <TextInput
            type="date"
            value={childDraft.birthDate || ""}
            onChange={(e) => setChildDraft({ ...childDraft, birthDate: e.target.value })}
          />
        </Field>
        <Field label="Hora habitual de despertar">
          <TextInput
            type="time"
            value={childDraft.usualWakeTime || ""}
            onChange={(e) => setChildDraft({ ...childDraft, usualWakeTime: e.target.value })}
          />
        </Field>
        <Field label="Hora habitual de dormir">
          <TextInput
            type="time"
            value={childDraft.usualBedTime || ""}
            onChange={(e) => setChildDraft({ ...childDraft, usualBedTime: e.target.value })}
          />
        </Field>
        <Field label="Número de siestas al día">
          <TextInput
            type="number"
            min="0"
            max="5"
            value={childDraft.napsCount ?? 0}
            onChange={(e) => setChildDraft({ ...childDraft, napsCount: Number(e.target.value) })}
          />
        </Field>
        <Button onClick={saveChild}>Guardar cambios</Button>
      </Sheet>

      <Sheet open={editingNight} onClose={() => setEditingNight(false)}>
        <h3 className="font-display text-lg font-extrabold mb-2">Modo SOS nocturno</h3>
        <p className="text-white/60 text-sm mb-5">
          Durante este rango, la app usa fondo oscuro, botones grandes y menos opciones por pantalla.
        </p>
        <Field label="Empieza">
          <TextInput
            type="time"
            value={state.settings.nightModeStart}
            onChange={(e) => dispatch({ type: "UPDATE_SETTINGS", patch: { nightModeStart: e.target.value } })}
          />
        </Field>
        <Field label="Termina">
          <TextInput
            type="time"
            value={state.settings.nightModeEnd}
            onChange={(e) => dispatch({ type: "UPDATE_SETTINGS", patch: { nightModeEnd: e.target.value } })}
          />
        </Field>
        <Button onClick={() => setEditingNight(false)}>Listo</Button>
      </Sheet>

      <Sheet open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <h3 className="font-display text-lg font-extrabold mb-2">¿Cerrar sesión?</h3>
        <p className="text-white/60 text-sm mb-6">Podrás volver a entrar cuando quieras con tu correo.</p>
        <div className="flex flex-col gap-2.5">
          <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
            Cancelar
          </Button>
          <Button variant="sos" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </Sheet>

      <BottomNav />
    </Screen>
  );
}
