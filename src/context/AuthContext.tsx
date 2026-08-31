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
  requestMagicLink: (email: string) => Promise<"sent" | "denied">;
  signOut: () => Promise<void>;
  refreshMembership: () => Promise<void>;
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

  async function requestMagicLink(email: string): Promise<"sent" | "denied"> {
    trackEvent("login_solicitado");
    const cleanEmail = email.toLowerCase().trim();
    const eligible = await isEmailActiveMember(cleanEmail);
    if (!eligible) {
      trackEvent("login_denegado");
      return "denied";
    }
    await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: false },
    });
    return "sent";
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
    <AuthContext.Provider value={{ loading, session, membership, requestMagicLink, signOut, refreshMembership }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
