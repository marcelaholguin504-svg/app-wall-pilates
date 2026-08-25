export default function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= current ? "bg-primary" : "bg-muted"}`} />
      ))}
    </div>
  );
}
