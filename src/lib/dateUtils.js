export function ageInMonths(birthDateStr) {
  const birth = new Date(birthDateStr);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

export function formatAge(birthDateStr) {
  const months = ageInMonths(birthDateStr);
  if (months < 1) {
    const birth = new Date(birthDateStr);
    const days = Math.max(0, Math.floor((Date.now() - birth.getTime()) / 86400000));
    return `${days} ${days === 1 ? "día" : "días"}`;
  }
  if (months < 24) {
    return `${months} ${months === 1 ? "mes" : "meses"}`;
  }
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return `${years} ${years === 1 ? "año" : "años"}`;
  return `${years} ${years === 1 ? "año" : "años"} ${remMonths} ${remMonths === 1 ? "mes" : "meses"}`;
}

export function formatTime(dateInput) {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toLocaleTimeString("es", { hour: "numeric", minute: "2-digit" });
}

export function formatTimeFromHHMM(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return formatTime(d);
}

export function minutesUntil(targetDate) {
  const diffMs = targetDate.getTime() - Date.now();
  return Math.round(diffMs / 60000);
}

export function formatMinutesUntil(targetDate) {
  const mins = minutesUntil(targetDate);
  if (mins <= 0) return "Ya casi";
  if (mins < 60) return `${mins} ${mins === 1 ? "minuto" : "minutos"}`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} ${h === 1 ? "hora" : "horas"}` : `${h} h ${m} min`;
}

export function nextOccurrenceOf(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

export function isWithinNightRange(startHHMM, endHHMM, now = new Date()) {
  const [sh, sm] = startHHMM.split(":").map(Number);
  const [eh, em] = endHHMM.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  if (startMinutes <= endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }
  // Rango que cruza la medianoche (ej. 21:00 - 7:00)
  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

export function formatDateTimeShort(dateInput) {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toLocaleTimeString("es", { hour: "numeric", minute: "2-digit" });
}
