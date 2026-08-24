// Horario inteligente de sueño: hoy calcula estimaciones simples a partir del
// perfil y, cuando hay suficientes registros, las ajusta con el promedio real
// de esta semana. Este es el punto de integración preparado para una futura
// capa de IA/adaptativa: esa capa solo debería seleccionar/ajustar entre
// estimaciones ya validadas como esta, nunca inventar horarios libremente.

function minutesOfDay(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function minutesToHHMM(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = Math.round(mins % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function hhmmToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

const MIN_SAMPLES_FOR_ADAPTIVE = 4;

function averageHHMMFromLogs(logs, type, sinceDays = 10) {
  const cutoff = Date.now() - sinceDays * 86400000;
  const samples = logs
    .filter((l) => l.type === type && new Date(l.timestamp).getTime() >= cutoff)
    .map((l) => minutesOfDay(new Date(l.timestamp)));
  if (samples.length < MIN_SAMPLES_FOR_ADAPTIVE) return null;
  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  return minutesToHHMM(avg);
}

// Devuelve la hora habitual de dormir, priorizando el promedio real de
// registros recientes (adaptativo) sobre el valor fijo del perfil.
export function estimatedBedTime(child, logs) {
  const adaptive = averageHHMMFromLogs(logs, "sleep");
  return adaptive || child.usualBedTime;
}

export function estimatedWakeTime(child, logs) {
  const adaptive = averageHHMMFromLogs(logs, "wake");
  return adaptive || child.usualWakeTime;
}

// Genera una distribución simple de siestas entre la hora de despertar y la
// hora de dormir, según el número habitual de siestas del perfil.
function buildNapSchedule(child, logs) {
  const wake = hhmmToMinutes(estimatedWakeTime(child, logs));
  let bed = hhmmToMinutes(estimatedBedTime(child, logs));
  if (bed <= wake) bed += 24 * 60;

  const napsCount = Math.max(0, child.napsCount || 0);
  if (napsCount === 0) return [];

  const awakeSpan = bed - wake;
  const slots = napsCount + 1;
  const naps = [];
  for (let i = 1; i <= napsCount; i += 1) {
    const napMinuteOfDay = (wake + (awakeSpan * i) / slots) % (24 * 60);
    naps.push(minutesToHHMM(napMinuteOfDay));
  }
  return naps;
}

// Devuelve el próximo evento de sueño (siesta o dormir) a partir de ahora.
export function getNextSleepEvent(child, logs, now = new Date()) {
  if (!child) return null;
  const naps = buildNapSchedule(child, logs);
  const bedTimeHHMM = estimatedBedTime(child, logs);

  const candidates = [
    ...naps.map((hhmm) => ({ type: "nap", label: "Próxima siesta", hhmm })),
    { type: "night", label: "Hora de dormir", hhmm: bedTimeHHMM },
  ];

  const nowMinutes = minutesOfDay(now);
  const withDelta = candidates.map((c) => {
    const target = hhmmToMinutes(c.hhmm);
    const delta = target >= nowMinutes ? target - nowMinutes : target + 24 * 60 - nowMinutes;
    return { ...c, delta };
  });

  withDelta.sort((a, b) => a.delta - b.delta);
  const next = withDelta[0];

  const eventDate = new Date(now);
  eventDate.setMinutes(eventDate.getMinutes() + next.delta);
  eventDate.setSeconds(0, 0);

  return { ...next, date: eventDate };
}

export function getLastSleepRange(logs) {
  const sorted = [...logs]
    .filter((l) => ["sleep", "nap_start"].includes(l.type))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const lastStart = sorted[0];
  if (!lastStart) return null;

  const endTypes = lastStart.type === "sleep" ? ["wake"] : ["nap_end"];
  const possibleEnds = logs
    .filter((l) => endTypes.includes(l.type) && new Date(l.timestamp) > new Date(lastStart.timestamp))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    start: lastStart.timestamp,
    end: possibleEnds[0]?.timestamp || null,
  };
}

export function isAdaptiveScheduleActive(logs) {
  const sleepCount = logs.filter((l) => l.type === "sleep").length;
  const wakeCount = logs.filter((l) => l.type === "wake").length;
  return sleepCount >= MIN_SAMPLES_FOR_ADAPTIVE || wakeCount >= MIN_SAMPLES_FOR_ADAPTIVE;
}
