// Capa de persistencia local. Punto único de integración futura con Supabase:
// basta con reemplazar las funciones de este archivo por llamadas al backend.

const STORAGE_KEY = "dulce-sueno:v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota excedida, etc.).
    // La app sigue funcionando en memoria durante la sesión.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
