import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/inicio", icon: "🏠", label: "Inicio" },
  { to: "/rutinas", icon: "🌙", label: "Rutinas" },
  { to: "/cuidadores", icon: "👨‍👩‍👧", label: "Cuidadores" },
  { to: "/sonidos", icon: "🎵", label: "Sonidos" },
  { to: "/perfil", icon: "👤", label: "Perfil" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-night-800/95 backdrop-blur-xl border-t border-night-600 flex items-center py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] z-[100]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-1 ${isActive ? "text-moon-300" : "text-white/40"}`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`text-xl transition-transform ${isActive ? "scale-110" : ""}`}>{tab.icon}</span>
              <span className={`text-[10px] font-semibold ${isActive ? "text-moon-300" : "text-white/40"}`}>
                {tab.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
