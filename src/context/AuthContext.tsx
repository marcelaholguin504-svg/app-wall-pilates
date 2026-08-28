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

  async function resolveMembership(email: string) {
    if (resolvingEmailRef.current === email) return;
    resolvingEmailRef.current = email;
    // Idempotente: si había una invitación pendiente para este correo, la
    // activa. No hace nada si no la había.
    await acceptPendingInvitation();
    const m = await fetchMyMembership(email);
    setMembership(m);
    if (m) trackEvent("sesion_iniciada", { role: m.role });
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
          resolveMembership(email).finally(() => mounted && setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        // Sin sesión legible (sin red, cliente mal configurado, etc.): no
        // dejamos la pantalla cargando para siempre — se trata como "sin
        // sesión" y se manda amablemente al inicio de sesión.
        if (!mounted) return;
        setSession(null);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      const email = newSession?.user?.email;
      if (email) {
        setLoading(true);
        resolveMembership(email).finally(() => setLoading(false));
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
