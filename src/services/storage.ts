// Persistencia local para el MVP. Reemplazable por un backend/Supabase real
// más adelante sin tocar la UI: basta con reimplementar estas funciones
// manteniendo la misma firma (ver sección 20).

const STORAGE_KEY = "duerme-ya:v1";

export function loadState<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveState<T>(state: T): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota excedida, etc.).
    // La app sigue funcionando en memoria durante la sesión.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
