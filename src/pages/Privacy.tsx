import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

// Contenido legal/de privacidad tal como fue redactado y aprobado — no se
// reescribe aquí, solo se le da formato de pantalla.

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-5 pt-6 pb-12">
      <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm font-semibold mb-4 touch-target">
        ← Atrás
      </button>

      <h1 className="font-display text-2xl font-extrabold mb-1">Privacidad y Seguridad</h1>
      <p className="text-xs text-muted-foreground mb-6">Última actualización: 26 de agosto de 2026</p>

      <p className="text-sm leading-relaxed text-foreground/90 mb-8">
        En Duerme Ya nos tomamos en serio algo simple: estás confiando en nosotros información sobre tu hijo o hija,
        en uno de los momentos más vulnerables del día a día — el sueño. Esta página explica, en lenguaje claro, qué
        información recopilamos, para qué la usamos, y qué control tienes sobre ella.
      </p>

      <div className="flex flex-col gap-4">
        <Card>
          <h2 className="font-display text-lg font-bold mb-3">1. ¿Qué información recopilamos?</h2>

          <p className="text-sm font-semibold mb-2">Sobre el niño o niña:</p>
          <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5 text-sm text-foreground/90">
            <li>Nombre o apodo</li>
            <li>Fecha de nacimiento o edad aproximada</li>
            <li>Fotografía (completamente opcional — nunca es obligatoria)</li>
            <li>Problema principal de sueño, rutina, y objetivos que indiques</li>
            <li>Registros de sueño que tú o los cuidadores agreguen (siestas, despertares, horarios)</li>
            <li>
              Respuestas que das dentro de "Ayúdame Ahora", incluyendo si indicas señales como fiebre, dificultad
              para respirar, u otras preocupaciones de salud
            </li>
          </ul>

          <p className="text-sm font-semibold mb-2">Sobre ti y otros cuidadores:</p>
          <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5 text-sm text-foreground/90">
            <li>Correo electrónico (para iniciar sesión por enlace mágico, sin contraseña)</li>
            <li>Rol dentro de la cuenta (Administradora o Cuidador/a invitado)</li>
            <li>Relación con el niño (mamá, papá, abuela, niñera, etc.)</li>
          </ul>

          <p className="text-sm font-semibold mb-2">Sobre tu compra:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90">
            <li>
              Datos de la transacción que Hotmart nos comparte para confirmar tu acceso (no almacenamos los datos
              completos de tu tarjeta — eso lo procesa Hotmart directamente, nunca pasa por nuestros servidores)
            </li>
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3">2. ¿Para qué usamos esta información?</h2>
          <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5 text-sm text-foreground/90">
            <li>Para darte recomendaciones de sueño relevantes a la edad y situación de tu hijo/a.</li>
            <li>Para que los cuidadores que invites vean el mismo perfil y la misma información.</li>
            <li>Para mejorar, con el tiempo, la calidad de las sugerencias que recibes.</li>
            <li>Para verificar que quien accede a la app efectivamente compró o fue invitado por quien compró.</li>
          </ul>

          <p className="text-sm font-semibold mb-2">Lo que NUNCA hacemos con tu información:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90">
            <li>No la vendemos ni la compartimos con anunciantes.</li>
            <li>No la usamos para publicidad dirigida.</li>
            <li>
              No usamos la fotografía de tu hijo/a para reconocimiento facial, entrenamiento de modelos de IA, ni
              ningún propósito distinto a mostrarla dentro de tu propia cuenta.
            </li>
            <li>
              No usamos las respuestas sobre salud (fiebre, respiración, etc.) para nada más que mostrarte el mensaje
              de derivación a un profesional — no se analizan, no se comparten, no se usan para ningún otro fin.
            </li>
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3">3. ¿Dónde se almacena la información?</h2>
          <p className="text-sm leading-relaxed text-foreground/90 mb-3">
            Tus datos se guardan en una base de datos administrada por Supabase, protegida con reglas de seguridad a
            nivel de fila (esto significa, en términos simples, que el sistema está construido para que solo tú y las
            personas que invites puedan ver la información de tu propia cuenta — nadie más, ni siquiera otras cuentas
            dentro de la misma app, puede acceder a ella).
          </p>
          <p className="text-sm leading-relaxed text-foreground/90">
            El acceso a la aplicación se hace mediante enlaces mágicos por correo electrónico, sin contraseñas que
            puedan filtrarse o reutilizarse de otros sitios.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3">4. ¿Quién puede ver la información de mi hijo/a?</h2>
          <p className="text-sm font-semibold mb-2">Únicamente:</p>
          <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5 text-sm text-foreground/90">
            <li>Tú, como Administradora (la persona que compró el acceso).</li>
            <li>Los cuidadores que tú decidas invitar explícitamente (hasta 4 personas adicionales).</li>
          </ul>
          <p className="text-sm leading-relaxed text-foreground/90">
            Nadie puede unirse a tu cuenta sin que tú lo autorices. Puedes revocar el acceso de cualquier cuidador en
            cualquier momento.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3">5. Tus derechos sobre esta información</h2>
          <p className="text-sm font-semibold mb-2">Puedes en cualquier momento:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90">
            <li>
              <strong className="text-foreground">Ver y editar</strong> el perfil de tu hijo/a completo.
            </li>
            <li>
              <strong className="text-foreground">Eliminar</strong> la fotografía sin afectar el resto de la
              información.
            </li>
            <li>
              <strong className="text-foreground">Borrar todos tus datos</strong> de forma permanente,
              escribiéndonos a{" "}
              <a href="mailto:ndhub186@gmail.com" className="text-primary underline">
                ndhub186@gmail.com
              </a>
              . Por ahora es un proceso manual: te confirmamos por correo cuando quede hecho. Esta acción no se puede
              deshacer.
            </li>
            <li>
              <strong className="text-foreground">Pedirnos información</strong> sobre qué datos tuyos tenemos
              guardados, escribiendo a{" "}
              <a href="mailto:ndhub186@gmail.com" className="text-primary underline">
                ndhub186@gmail.com
              </a>
              .
            </li>
            <li>
              <strong className="text-foreground">Revocar el acceso</strong> a cualquier cuidador invitado, en
              cualquier momento.
            </li>
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3">6. Sobre los menores de edad</h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            Duerme Ya no está diseñada para que la usen niños ni adolescentes — está hecha para que la usen sus
            cuidadores adultos. El niño o niña cuyo perfil se crea en la app{" "}
            <strong className="text-foreground">no es usuario de la aplicación</strong>, es la persona sobre quien se
            guarda información con el propósito exclusivo de ayudar a su cuidador a orientarse sobre su sueño.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3">7. Sobre las recomendaciones de sueño</h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            Duerme Ya ofrece orientación educativa y{" "}
            <strong className="text-foreground">no sustituye la evaluación de un profesional de salud</strong>. Si en
            cualquier momento indicas una señal de alerta (fiebre, dificultad para respirar, u otra preocupación
            médica), la aplicación detiene las recomendaciones de rutina y te sugiere buscar atención médica — nunca
            continúa como si nada.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3">8. Cambios a esta política</h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            Si esta política cambia de forma importante, te lo haremos saber dentro de la aplicación antes de que el
            cambio entre en vigor.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3">9. Contacto</h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            Si tienes preguntas sobre tu privacidad o la de tu hijo/a dentro de Duerme Ya, escríbenos a:{" "}
            <a href="mailto:ndhub186@gmail.com" className="text-primary underline font-semibold">
              ndhub186@gmail.com
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}
