export function formatTime(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toLocaleTimeString("es", { hour: "numeric", minute: "2-digit" });
}

export function formatDayTime(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = formatTime(d);
  if (isToday) return time;
  return `${d.toLocaleDateString("es", { day: "numeric", month: "short" })}, ${time}`;
}

export function greeting(hour: number): string {
  if (hour < 6) return "Buenas noches";
  if (hour < 12) return "Buenos días";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

export function daysAgo(dateISO: string): number {
  return Math.floor((Date.now() - new Date(dateISO).getTime()) / 86400000);
}

export function weekdayShort(dateISO: string): string {
  const label = new Date(`${dateISO}T00:00:00`).toLocaleDateString("es", { weekday: "short" });
  return label.replace(".", "").replace(/^\w/, (c) => c.toUpperCase());
}
