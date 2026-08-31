import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/IconBadge";

type Status = "idle" | "loading" | "sent" | "denied" | "error";

export default function Login() {
  const { requestMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const result = await requestMagicLink(email);
      setStatus(result);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="text-center mb-8">
        <IconBadge icon={Moon} size="lg" className="mx-auto mb-3" />
        <h1 className="font-display text-2xl font-extrabold mb-2">Duerme Ya</h1>
      </div>

      {status === "sent" && (
        <Card className="text-center py-8">
          <IconBadge icon={Heart} className="mx-auto mb-3" />
          <p className="text-lg font-bold leading-relaxed">
            Listo. Revisa tu correo — te mandamos un enlace para entrar a Duerme Ya.
          </p>
        </Card>
      )}

      {status === "denied" && (
        <Card className="mb-5 border-destructive/40 bg-destructive/10">
          <p className="text-sm leading-relaxed">
            Este correo no tiene acceso todavía. Si compraste Duerme Ya, usa el mismo correo del pago. Si alguien te
            invitó, pídele que revise que tu correo esté bien escrito.
          </p>
        </Card>
      )}

      {status !== "sent" && (
        <form onSubmit={handleSubmit}>
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
              if (status === "denied" || status === "error") setStatus("idle");
            }}
            autoComplete="email"
            className="mb-5"
          />

          {status === "error" && (
            <p className="text-destructive text-sm mb-4 -mt-2">Algo no salió bien. Inténtalo de nuevo en un momento.</p>
          )}

          <Button type="submit" size="lg" disabled={status === "loading"}>
            {status === "loading" ? "Enviando…" : "Enviarme el enlace de acceso"}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Al continuar, aceptas nuestra{" "}
            <Link to="/privacidad" className="text-primary underline font-semibold">
              Privacidad y seguridad
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
