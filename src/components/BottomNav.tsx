import { NavLink } from "react-router-dom";
import { Moon, CalendarDays, ClipboardPlus, Music2, User } from "lucide-react";

const TABS = [
  { to: "/hoy", icon: Moon, label: "Hoy" },
  { to: "/plan", icon: CalendarDays, label: "Plan" },
  { to: "/registrar", icon: ClipboardPlus, label: "Registrar" },
  { to: "/sonidos", icon: Music2, label: "Sonidos" },
  { to: "/perfil", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-card/95 backdrop-blur-xl border-t border-border flex items-center py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] z-[100]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-1.5 touch-target ${isActive ? "text-primary" : "text-muted-foreground"}`
          }
        >
          {({ isActive }) => (
            <>
              <tab.icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} strokeWidth={isActive ? 2.4 : 2} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
