export default function Screen({ children, withNav = true, className = "" }) {
  return (
    <div className={`min-h-screen ${withNav ? "pb-28" : "pb-8"} ${className}`}>{children}</div>
  );
}
