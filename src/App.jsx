import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppState } from "./state/AppContext.jsx";

import Splash from "./screens/Splash.jsx";
import Register from "./screens/Register.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import Home from "./screens/Home.jsx";
import Sos from "./screens/Sos.jsx";
import Routines from "./screens/Routines.jsx";
import RoutineRunner from "./screens/RoutineRunner.jsx";
import Caregivers from "./screens/Caregivers.jsx";
import Paywall from "./screens/Paywall.jsx";
import Profile from "./screens/Profile.jsx";
import Sounds from "./screens/Sounds.jsx";
import GrandmaWisdom from "./screens/GrandmaWisdom.jsx";
import GrandmaMode from "./screens/GrandmaMode.jsx";
import MomVoice from "./screens/MomVoice.jsx";

function RequireAccount({ children }) {
  const state = useAppState();
  const location = useLocation();
  if (!state.user) return <Navigate to="/registro" replace state={{ from: location }} />;
  if (!state.child) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          path="/inicio"
          element={
            <RequireAccount>
              <Home />
            </RequireAccount>
          }
        />
        <Route
          path="/sos"
          element={
            <RequireAccount>
              <Sos />
            </RequireAccount>
          }
        />
        <Route
          path="/rutinas"
          element={
            <RequireAccount>
              <Routines />
            </RequireAccount>
          }
        />
        <Route
          path="/rutinas/:type"
          element={
            <RequireAccount>
              <RoutineRunner />
            </RequireAccount>
          }
        />
        <Route
          path="/cuidadores"
          element={
            <RequireAccount>
              <Caregivers />
            </RequireAccount>
          }
        />
        <Route
          path="/suscripcion"
          element={
            <RequireAccount>
              <Paywall />
            </RequireAccount>
          }
        />
        <Route
          path="/perfil"
          element={
            <RequireAccount>
              <Profile />
            </RequireAccount>
          }
        />
        <Route
          path="/sonidos"
          element={
            <RequireAccount>
              <Sounds />
            </RequireAccount>
          }
        />
        <Route
          path="/sabiduria-abuelas"
          element={
            <RequireAccount>
              <GrandmaWisdom />
            </RequireAccount>
          }
        />
        <Route
          path="/modo-abuela"
          element={
            <RequireAccount>
              <GrandmaMode />
            </RequireAccount>
          }
        />
        <Route
          path="/voz-mama"
          element={
            <RequireAccount>
              <MomVoice />
            </RequireAccount>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
