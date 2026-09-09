import { useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

// Dos variantes, nunca con descuento ni código promocional (pedido
// explícito del documento): antes de llegar al resultado, ofrece guardar
// el resultado por correo; después de llegar (ya vio el precio), solo
// recuerda la garantía de 7 días.
export function QuizExitIntentDialog({
  open,
  onOpenChange,
  variant,
  displayName,
  onSaveEmail,
  onSeeOffer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "guardar_resultado" | "garantia";
  displayName: string;
  onSaveEmail: (email: string) => void;
  onSeeOffer: () => void;
}) {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    onSaveEmail(email.trim());
    setSaved(true);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose className="absolute right-4 top-4 text-muted-foreground touch-target">
          <X className="w-5 h-5" />
        </DialogClose>

        {variant === "guardar_resultado" ? (
          saved ? (
            <>
              <DialogTitle>Listo, quedó guardado</DialogTitle>
              <DialogDescription>
                Te lo enviaremos a tu correo. Puedes seguir respondiendo cuando quieras.
              </DialogDescription>
              <Button onClick={() => onOpenChange(false)}>Seguir</Button>
            </>
          ) : (
            <>
              <DialogTitle>Espera — no pierdas tus respuestas</DialogTitle>
              <DialogDescription>
                Guarda tu resultado personalizado para {displayName} y te lo enviamos a tu correo, sin compromiso.
              </DialogDescription>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  type="email"
                  required
                  autoFocus
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit">Guardar mi resultado</Button>
              </form>
            </>
          )
        ) : (
          <>
            <DialogTitle>¿Alguna duda antes de irte?</DialogTitle>
            <DialogDescription>
              Recuerda que tienes garantía de 7 días — si no te sirve, te devolvemos tu dinero, sin preguntas.
            </DialogDescription>
            <Button
              onClick={() => {
                onSeeOffer();
                onOpenChange(false);
              }}
            >
              Volver a ver la oferta
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
