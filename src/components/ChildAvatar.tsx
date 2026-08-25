import { Moon } from "lucide-react";

export default function ChildAvatar({
  photoDataUrl,
  size = 48,
  className = "",
}: {
  photoDataUrl?: string;
  size?: number;
  className?: string;
}) {
  if (photoDataUrl) {
    return (
      <img
        src={photoDataUrl}
        alt="Foto del pequeño"
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shadow-glow ${className}`}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow shrink-0 ${className}`}
    >
      <Moon className="text-primary-foreground" style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2} />
    </div>
  );
}
