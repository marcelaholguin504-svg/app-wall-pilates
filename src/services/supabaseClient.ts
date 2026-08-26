// Cliente de Supabase para el navegador. Usa la clave publicable (segura de
// exponer): la autorización real de cada solicitud la hacen las políticas de
// RLS en la base de datos, nunca esta clave por sí sola.

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY. Revisa tu .env.local."
  );
}

export const supabase = createClient(url || "", publishableKey || "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
