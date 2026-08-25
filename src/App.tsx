import { Navigate, Route, Routes } from "react-router-dom";
import { useAppState } from "@/hooks/useApp";

import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import AyudameAhora from "@/pages/AyudameAhora";
import Plan from "@/pages/Plan";
import RegisterPage from "@/pages/Register";
import Sounds from "@/pages/Sounds";
import Patterns from "@/pages/Patterns";
import Profile from "@/pages/Profile";
import Caregivers from "@/pages/Caregivers";

function RequireProfile({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  if (!state.child) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function Root() {
  const state = useAppState();
  return <Navigate to={state.child ? "/hoy" : "/onboarding"} replace />;
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          path="/hoy"
          element={
            <RequireProfile>
              <Home />
            </RequireProfile>
          }
        />
        <Route
          path="/ayudame-ahora"
          element={
            <RequireProfile>
              <AyudameAhora />
            </RequireProfile>
          }
        />
        <Route
          path="/plan"
          element={
            <RequireProfile>
              <Plan />
            </RequireProfile>
          }
        />
        <Route
          path="/registrar"
          element={
            <RequireProfile>
              <RegisterPage />
            </RequireProfile>
          }
        />
        <Route
          path="/sonidos"
          element={
            <RequireProfile>
              <Sounds />
            </RequireProfile>
          }
        />
        <Route
          path="/patrones"
          element={
            <RequireProfile>
              <Patterns />
            </RequireProfile>
          }
        />
        <Route
          path="/perfil"
          element={
            <RequireProfile>
              <Profile />
            </RequireProfile>
          }
        />
        <Route
          path="/cuidadores"
          element={
            <RequireProfile>
              <Caregivers />
            </RequireProfile>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
