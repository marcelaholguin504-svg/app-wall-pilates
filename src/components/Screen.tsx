import type { ReactNode } from "react";

export default function Screen({
  children,
  withNav = true,
  className = "",
}: {
  children: ReactNode;
  withNav?: boolean;
  className?: string;
}) {
  return <div className={`min-h-screen ${withNav ? "pb-28" : "pb-8"} ${className}`}>{children}</div>;
}
