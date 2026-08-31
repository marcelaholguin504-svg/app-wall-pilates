import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Moon } from "lucide-react";
import { useAppState } from "@/hooks/useApp";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/IconBadge";

import Login from "@/pages/Login";
import Privacy from "@/pages/Privacy";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import AyudameAhora from "@/pages/AyudameAhora";
import Plan from "@/pages/Plan";
import RegisterPage from "@/pages/Register";
import Sounds from "@/pages/Sounds";
import Patterns from "@/pages/Patterns";
import Profile from "@/pages/Profile";
import Caregivers from "@/pages/Caregivers";
import Library from "@/pages/Library";
import SleepTips from "@/pages/SleepTips";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Cargando…</p>
    </div>
  );
}

// Exige una sesión válida Y un correo con acceso activo (compró o fue
// invitado). Si la sesión no existe o expiró, o el correo ya no tiene
// acceso, redirige amablemente al inicio de sesión — nunca un error técnico.
function RequireAccess({ children }: { children: React.ReactNode }) {
  const { loading, session, membership, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/entrar" replace />;

  if (!membership) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
        <IconBadge icon={Moon} size="lg" className="mb-4" />
        <h1 className="font-display text-xl font-extrabold mb-3">No encontramos acceso activo</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-[300px]">
          Este correo ya no tiene acceso a Duerme Ya, o tu sesión ya no es válida. Vuelve a intentar desde el inicio.
        </p>
        <Button
          onClick={async () => {
            await signOut();
            navigate("/entrar", { replace: true });
          }}
        >
          Volver a intentar
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

function RequireProfile({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  if (!state.ready) return <LoadingScreen />;
  if (!state.child) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { loading, session, membership } = useAuth();
  if (loading) return <LoadingScreen />;
  if (session && membership) return <Navigate to="/hoy" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Navigate to="/hoy" replace />} />

        <Route
          path="/entrar"
          element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          }
        />

        {/* Pública a propósito: se enlaza desde /entrar, antes de iniciar sesión. */}
        <Route path="/privacidad" element={<Privacy />} />

        <Route
          path="/onboarding"
          element={
            <RequireAccess>
              <Onboarding />
            </RequireAccess>
          }
        />

        <Route
          path="/hoy"
          element={
            <RequireAccess>
              <RequireProfile>
                <Home />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/ayudame-ahora"
          element={
            <RequireAccess>
              <RequireProfile>
                <AyudameAhora />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/plan"
          element={
            <RequireAccess>
              <RequireProfile>
                <Plan />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/registrar"
          element={
            <RequireAccess>
              <RequireProfile>
                <RegisterPage />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/sonidos"
          element={
            <RequireAccess>
              <RequireProfile>
                <Sounds />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/patrones"
          element={
            <RequireAccess>
              <RequireProfile>
                <Patterns />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/perfil"
          element={
            <RequireAccess>
              <RequireProfile>
                <Profile />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/cuidadores"
          element={
            <RequireAccess>
              <RequireProfile>
                <Caregivers />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/biblioteca"
          element={
            <RequireAccess>
              <RequireProfile>
                <Library />
              </RequireProfile>
            </RequireAccess>
          }
        />
        <Route
          path="/consejos"
          element={
            <RequireAccess>
              <RequireProfile>
                <SleepTips />
              </RequireProfile>
            </RequireAccess>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
