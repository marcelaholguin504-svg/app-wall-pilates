import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../state/AppContext.jsx";
import { Button, Field, TextInput } from "../components/ui.jsx";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Cuéntanos tu nombre para continuar");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Escribe un correo electrónico válido");
      return;
    }
    setError("");
    dispatch({ type: "REGISTER_USER", name: name.trim(), email: email.trim() });
    navigate("/onboarding", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌙</div>
        <h1 className="font-display text-2xl font-extrabold mb-2">Bienvenida a Dulce Sueño</h1>
        <p className="text-moon-300 text-sm leading-relaxed max-w-[320px] mx-auto">
          Crea tu cuenta para guardar el perfil de sueño de tu bebé y compartirlo con quien lo cuide.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <Field label="Tu nombre">
          <TextInput
            type="text"
            placeholder="Ej. Camila"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field label="Correo electrónico" hint="Lo usaremos para guardar tu información de forma segura">
          <TextInput
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Field>

        {error && <p className="text-alert-400 text-sm mb-4 -mt-2">{error}</p>}

        <Button type="submit" size="lg">
          Crear mi cuenta →
        </Button>
      </form>

      <p className="text-center text-xs text-white/30 mt-6 leading-relaxed">
        Al continuar aceptas nuestros Términos y Aviso de Privacidad. No compartimos tu información con nadie fuera de tus cuidadores invitados.
      </p>
    </div>
  );
}
