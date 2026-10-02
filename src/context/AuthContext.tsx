import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabaseClient";
import { acceptPendingInvitation, fetchMyMembership, isEmailActiveMember } from "@/services/accountService";
import { trackEvent } from "@/services/events";
import type { AccountMember } from "@/types";

interface AuthContextValue {
  loading: boolean;
  session: Session | null;
  membership: AccountMember | null;
  requestMagicLink: (email: string) => Promise<RequestAccessResult>;
  verifyOtpCode: (email: string, token: string) => Promise<VerifyCodeResult>;
  signOut: () => Promise<void>;
  refreshMembership: () => Promise<void>;
}

// Resultados específicos (no solo true/false) para poder mostrar el
// mensaje exacto correspondiente en la pantalla de inicio de sesión —
// nunca "Revisa tu correo" si el envío en realidad falló.
export type RequestAccessResult = { ok: true } | { ok: false; reason: "no_account" | "rate_limited" | "network" | "unknown" };
export type VerifyCodeResult = { ok: true } | { ok: false; reason: "invalid_or_expired" | "network" | "unknown" };

function classifySendError(error: unknown): "rate_limited" | "network" | "unknown" {
  if (typeof navigator !== "undefined" && !navigator.onLine) return "network";
  const status = (error as { status?: number } | null)?.status;
  const message = String((error as { message?: string } | null)?.message || "").toLowerCase();
  if (status === 429 || message.includes("rate limit") || message.includes("too many requests")) return "rate_limited";
  if (error instanceof TypeError || message.includes("fetch") || message.includes("network")) return "network";
  return "unknown";
}

function classifyVerifyError(error: unknown): "invalid_or_expired" | "network" | "unknown" {
  if (typeof navigator !== "undefined" && !navigator.onLine) return "network";
  const message = String((error as { message?: string } | null)?.message || "").toLowerCase();
  if (message.includes("expired") || message.includes("invalid") || message.includes("token")) return "invalid_or_expired";
  if (error instanceof TypeError || message.includes("fetch") || message.includes("network")) return "network";
  return "unknown";
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [membership, setMembership] = useState<AccountMember | null>(null);
  const resolvingEmailRef = useRef<string | null>(null);
  const hasResolvedOnceRef = useRef(false);
  const membershipRef = useRef<AccountMember | null>(null);
  useEffect(() => {
    membershipRef.current = membership;
  }, [membership]);

  // `background = true` es una revalidación silenciosa (refresco de token,
  // la pestaña recupera el foco) — Supabase la dispara sola, sin que la
  // usuaria haga nada. Si esa revalidación falla o no encuentra membresía
  // pero YA teníamos una válida, no la borramos: es mucho más probable que
  // sea un hipo de red pasajero que una revocación real, y borrarla hacía
  // que toda la pantalla (incluyendo "Próximo descanso" y su anillo)
  // desapareciera de la nada durante el uso normal de la app.
  async function resolveMembership(email: string, { background = false }: { background?: boolean } = {}) {
    if (resolvingEmailRef.current === email) return;
    resolvingEmailRef.current = email;
    try {
      // Idempotente: si había una invitación pendiente para este correo, la
      // activa. No hace nada si no la había.
      await acceptPendingInvitation();
      const m = await fetchMyMembership(email);
      if (background && !m && membershipRef.current) return;
      setMembership(m);
      if (m) trackEvent("sesion_iniciada", { role: m.role });
    } finally {
      resolvingEmailRef.current = null;
    }
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        const email = data.session?.user?.email;
        if (email) {
          resolveMembership(email).finally(() => {
            if (!mounted) return;
            setLoading(false);
            hasResolvedOnceRef.current = true;
          });
        } else {
          setLoading(false);
          hasResolvedOnceRef.current = true;
        }
      })
      .catch(() => {
        // Sin sesión legible (sin red, cliente mal configurado, etc.): no
        // dejamos la pantalla cargando para siempre — se trata como "sin
        // sesión" y se manda amablemente al inicio de sesión.
        if (!mounted) return;
        setSession(null);
        setLoading(false);
        hasResolvedOnceRef.current = true;
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      const email = newSession?.user?.email;
      if (email) {
        // Solo la resolución inicial bloquea la pantalla con "Cargando…".
        // Supabase revalida la sesión sola de vez en cuando (refresco de
        // token, foco de la pestaña) — eso no debe hacer que toda la app
        // desaparezca detrás de un loader cada vez que pasa.
        if (!hasResolvedOnceRef.current) {
          setLoading(true);
          resolveMembership(email).finally(() => {
            setLoading(false);
            hasResolvedOnceRef.current = true;
          });
        } else {
          void resolveMembership(email, { background: true });
        }
      } else {
        setMembership(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function requestMagicLink(email: string): Promise<RequestAccessResult> {
    trackEvent("login_solicitado");
    const cleanEmail = email.toLowerCase().trim();
    try {
      const eligible = await isEmailActiveMember(cleanEmail);
      if (!eligible) {
        trackEvent("login_denegado");
        return { ok: false, reason: "no_account" };
      }
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: false },
      });
      if (error) return { ok: false, reason: classifySendError(error) };
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: classifySendError(err) };
    }
  }

  // Valida el código de 6 dígitos que llega en el mismo correo del enlace
  // mágico. Una cuenta que todavía no confirmó su correo (su primer inicio
  // de sesión) recibe el correo de "confirmar registro", cuyo código se
  // valida con type "signup" — no "email" (enlace mágico normal). Como el
  // cliente no puede saber de antemano cuál de los dos aplica, se intenta
  // con "email" primero y, solo si falla, se reintenta con "signup" antes
  // de mostrar cualquier error.
  async function verifyOtpCode(email: string, token: string): Promise<VerifyCodeResult> {
    const cleanEmail = email.toLowerCase().trim();
    try {
      let { error } = await supabase.auth.verifyOtp({ email: cleanEmail, token, type: "email" });
      if (error) {
        const retry = await supabase.auth.verifyOtp({ email: cleanEmail, token, type: "signup" });
        error = retry.error;
      }
      if (error) return { ok: false, reason: classifyVerifyError(error) };
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: classifyVerifyError(err) };
    }
  }

  async function signOut() {
    trackEvent("sesion_cerrada");
    await supabase.auth.signOut();
    setMembership(null);
  }

  async function refreshMembership() {
    const email = session?.user?.email;
    if (email) await resolveMembership(email);
  }

  return (
    <AuthContext.Provider
      value={{ loading, session, membership, requestMagicLink, verifyOtpCode, signOut, refreshMembership }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
