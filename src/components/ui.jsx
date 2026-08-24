export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "w-full rounded-2xl font-display font-bold transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2";
  const sizes = {
    lg: "py-5 text-lg",
    md: "py-4 text-base",
    sm: "py-2.5 text-sm",
  };
  const variants = {
    primary: "bg-gradient-to-br from-moon-500 to-moon-700 text-white shadow-glow",
    sos: "bg-gradient-to-br from-alert-400 to-alert-500 text-white shadow-glow",
    secondary: "bg-night-700 text-white border border-night-600",
    ghost: "bg-transparent text-moon-300",
    success: "bg-gradient-to-br from-leaf-400 to-leaf-500 text-night-950",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-night-800/80 border border-night-600 rounded-2xl p-4 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function Pill({ children, active = false, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
        active
          ? "bg-gradient-to-br from-moon-500 to-moon-700 text-white border-transparent shadow-glow"
          : "bg-night-800 text-moon-300 border-night-600"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function ProgressDots({ total, current }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all ${
            i <= current ? "bg-moon-500" : "bg-night-600"
          }`}
        />
      ))}
    </div>
  );
}

export function BackButton({ onClick, label = "Atrás" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-moon-300 text-sm font-semibold py-2"
    >
      <span aria-hidden>←</span> {label}
    </button>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block mb-5">
      <span className="block text-sm font-semibold text-moon-300 mb-2">{label}</span>
      {children}
      {hint && <span className="block text-xs text-night-600 mt-1.5">{hint}</span>}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full bg-night-800 border border-night-600 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:border-moon-500 outline-none text-base ${
        props.className || ""
      }`}
    />
  );
}

export function SelectGrid({ options, value, onChange, columns = 2 }) {
  return (
    <div className={`grid gap-2.5`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((opt) => (
        <button
          type="button"
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all ${
            value === opt.id
              ? "bg-moon-500/20 border-moon-500 scale-[1.02]"
              : "bg-night-800 border-night-600"
          }`}
        >
          {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
          <span className="text-sm font-semibold text-center leading-tight">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] bg-night-800 border-t border-night-600 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-fadeUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-night-600 mx-auto mb-5" />
        {children}
      </div>
    </div>
  );
}

export function Badge({ children, tone = "moon" }) {
  const tones = {
    moon: "bg-moon-500/20 text-moon-300 border-moon-500/40",
    leaf: "bg-leaf-500/20 text-leaf-400 border-leaf-500/40",
    dawn: "bg-dawn-500/20 text-dawn-400 border-dawn-500/40",
    alert: "bg-alert-500/20 text-alert-400 border-alert-500/40",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${tones[tone]}`}>
      {children}
    </span>
  );
}
