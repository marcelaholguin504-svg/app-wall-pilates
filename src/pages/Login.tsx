import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Moon, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/IconBadge";

// Confirma en Supabase → Authentication → Emails → "OTP length" que el
// proyecto siga usando 6 dígitos; si lo cambiaste, ajusta solo esta línea.
const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const SUPPORT_EMAIL = "hola@duerme-ya.com";

const SEND_ERROR_MESSAGES: Record<"no_account" | "rate_limited" | "network" | "unknown", string> = {
  no_account:
    "No encontramos una compra con este correo. Revisa que sea el mismo que usaste al pagar en Hotmart. Si el problema sigue, escríbenos a hola@duerme-ya.com.",
  rate_limited:
    "Ya te enviamos un correo hace un momento. Espera un minuto y vuelve a intentarlo. Si el correo no llega, escríbenos a hola@duerme-ya.com.",
  network: "Parece que no tienes conexión. Revisa tu internet e intenta de nuevo.",
  unknown: "Algo no salió bien. Intenta de nuevo en un momento o escríbenos a hola@duerme-ya.com.",
};

const VERIFY_ERROR_MESSAGES: Record<"invalid_or_expired" | "network" | "unknown", string> = {
  invalid_or_expired: 'Ese código no es válido o ya venció. Toca "Reenviar correo" para recibir uno nuevo.',
  network: "Parece que no tienes conexión. Revisa tu internet e intenta de nuevo.",
  unknown: "Algo no salió bien. Intenta de nuevo en un momento o escríbenos a hola@duerme-ya.com.",
};

type Phase = "email" | "code";

export default function Login() {
  const { requestMagicLink, verifyOtpCode } = useAuth();

  const [phase, setPhase] = useState<Phase>("email");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // Se usa tanto para el primer envío como para "Reenviar correo" — en
  // ambos casos, SOLO si el envío fue exitoso pasa a la pantalla de
  // confirmación. Si falló, se queda donde estaba mostrando el error.
  async function sendAccessEmail(targetEmail: string) {
    setSending(true);
    setSendError(null);
    try {
      const result = await requestMagicLink(targetEmail);
      if (result.ok) {
        setPhase("code");
        setCode("");
        setVerifyError(null);
        setCooldown(RESEND_COOLDOWN_SECONDS);
      } else {
        setSendError(SEND_ERROR_MESSAGES[result.reason]);
      }
    } catch {
      setSendError(SEND_ERROR_MESSAGES.unknown);
    } finally {
      setSending(false);
    }
  }

  async function handleSubmitEmail(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || sending) return;
    await sendAccessEmail(email.trim());
  }

  async function handleResend() {
    if (cooldown > 0 || sending || !email.trim()) return;
    await sendAccessEmail(email.trim());
  }

  async function submitCode(value: string) {
    if (verifying) return;
    setVerifying(true);
    setVerifyError(null);
    try {
      const result = await verifyOtpCode(email, value);
      if (!result.ok) {
        setVerifyError(VERIFY_ERROR_MESSAGES[result.reason]);
        setCode("");
      }
      // En éxito no hace falta navegar manualmente: onAuthStateChange ya
      // toma el control y las guardas de ruta (RequireAccess) mandan sola
      // a la persona dentro de la app.
    } catch {
      setVerifyError(VERIFY_ERROR_MESSAGES.unknown);
      setCode("");
    } finally {
      setVerifying(false);
    }
  }

  function handleCodeChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setCode(digits);
    setVerifyError(null);
    if (digits.length === OTP_LENGTH) {
      void submitCode(digits);
    }
  }

  function useAnotherEmail() {
    setPhase("email");
    setCode("");
    setVerifyError(null);
    setSendError(null);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="text-center mb-8">
        <IconBadge icon={Moon} size="lg" className="mx-auto mb-3" />
        <h1 className="font-display text-2xl font-extrabold mb-2">Duerme Ya</h1>
      </div>

      {phase === "email" && (
        <form onSubmit={handleSubmitEmail}>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Ingresa el correo con el que compraste (o con el que te invitaron)
          </p>
          <Label htmlFor="login-email">Correo electrónico</Label>
          <Input
            id="login-email"
            type="email"
            autoFocus
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSendError(null);
            }}
            autoComplete="email"
            className="mb-5"
          />

          {sendError && (
            <p role="alert" className="text-destructive text-sm mb-4 -mt-2 leading-relaxed">
              {sendError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={sending}>
            {sending ? "Enviando…" : "Enviarme el enlace de acceso"}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Al continuar, aceptas nuestra{" "}
            <Link to="/privacidad" className="text-primary underline font-semibold">
              Privacidad y seguridad
            </Link>
          </p>
        </form>
      )}

      {phase === "code" && (
        <Card className="text-center py-8">
          <IconBadge icon={Heart} className="mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-2">Revisa tu correo 💛</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 px-2">
            Te enviamos un correo a <span className="font-semibold text-foreground">{email}</span>. Ábrelo y toca
            "Entrar a Duerme Ya", o escribe aquí el código que viene en el mismo correo.
          </p>

          <Label htmlFor="login-code" className="sr-only">
            Código de acceso
          </Label>
          <Input
            id="login-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={OTP_LENGTH}
            placeholder={"•".repeat(OTP_LENGTH)}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            disabled={verifying}
            autoFocus
            className="text-center text-3xl font-bold tracking-[0.4em] mb-4"
          />

          {verifying && <p className="text-sm text-muted-foreground mb-2">Verificando…</p>}
          {verifyError && (
            <p role="alert" className="text-destructive text-sm leading-relaxed mb-4 px-2">
              {verifyError}
            </p>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed mb-6 px-2">
            Si no lo ves, revisa tu carpeta de spam o promociones. Puede tardar unos minutos.
          </p>

          <div className="flex flex-col gap-2.5">
            <Button variant="secondary" onClick={handleResend} disabled={cooldown > 0 || sending}>
              {cooldown > 0 ? `Puedes reenviarlo en ${cooldown} s` : sending ? "Enviando…" : "Reenviar correo"}
            </Button>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm font-semibold text-primary underline touch-target py-2">
              ¿Necesitas ayuda? Escríbenos a {SUPPORT_EMAIL}
            </a>
            <Button variant="ghost" size="sm" onClick={useAnotherEmail}>
              Usar otro correo
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
