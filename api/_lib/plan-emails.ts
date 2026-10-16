// Duerme Ya — Plan de 14 noches: el texto exacto de los 14 correos
// automáticos (uno por noche, del 1 al 14). NO cambiar este texto: fue
// aprobado tal cual por la fundadora. El cuerpo usa un markdown muy
// simple (**negrita**, *cursiva*, listas con "- ") que
// api/_lib/plan-template.ts convierte a HTML y a texto plano.
//
// El cierre de seguridad ("Si ves fiebre...") se repite igual en los 14
// correos a propósito.

export interface PlanEmail {
  night: number;
  subject: string;
  body: string;
}

const SAFETY_CLOSING = "*Si ves fiebre, dificultad para respirar o algo que te preocupe, llama a tu pediatra.*";

export const PLAN_EMAILS: PlanEmail[] = [
  {
    night: 1,
    subject: "Noche 1: la hora en que tu bebé está listo para dormir",
    body: `Hola, mamá 💛

Esta noche solo vas a hacer una cosa: abre Duerme Ya y mira tu **Próximo descanso**. Esa hora sale de la edad de tu bebé y de cuánto tiempo puede estar despierto sin cansarse de más.

Cuando se acerque la hora, empieza a bajar el ritmo: menos luz, menos ruido, más calma.

No tienes que hacerlo perfecto. Hoy solo estás observando.

${SAFETY_CLOSING}`,
  },
  {
    night: 2,
    subject: "Noche 2: lo que tu bebé te dice antes de llorar",
    body: `Hola, mamá 💛

Antes del llanto, casi siempre hay señales. Hoy vas a buscarlas: bostezos, frotarse los ojos o las orejas, mirada perdida, quedarse quieto de repente o ponerse más inquieto de lo normal.

Cuando veas la primera, ese es el momento de empezar a acostarlo. Si esperas al llanto, muchas veces ya está demasiado cansado y le cuesta más dormirse.

Cada bebé tiene sus propias señales. Esta noche, anota mentalmente cuál aparece primero en el tuyo.

${SAFETY_CLOSING}`,
  },
  {
    night: 3,
    subject: "Noche 3: una rutina corta, siempre igual",
    body: `Hola, mamá 💛

A los bebés les da seguridad saber qué viene después. Hoy vas a elegir una rutina sencilla para antes de dormir y repetirla en el mismo orden todas las noches.

Por ejemplo: baño, pijama, canción, cama. Entre 20 y 30 minutos, sin pantallas.

No importa tanto qué incluyas, sino que sea siempre igual. Con los días, esa rutina se convierte en la señal de "ya es hora de dormir".

${SAFETY_CLOSING}`,
  },
  {
    night: 4,
    subject: "Noche 4: un cuarto que invita a dormir",
    body: `Hola, mamá 💛

Hoy vas a mirar el lugar donde duerme tu bebé con otros ojos. Tres cosas ayudan mucho:

- **Oscuro:** la oscuridad ayuda a su cuerpo a entender que es de noche.
- **Fresco:** ni muy caliente ni muy frío. Vístelo con ropa ligera, sin abrigarlo de más.
- **Tranquilo:** sin televisión ni luces fuertes cerca.

No necesitas comprar nada. A veces basta con cerrar una cortina o apagar una luz del pasillo.

${SAFETY_CLOSING}`,
  },
  {
    night: 5,
    subject: "Noche 5: la cuna más segura es la más sencilla",
    body: `Hola, mamá 💛

Hoy es la noche más importante del plan, porque se trata de su seguridad. Las recomendaciones pediátricas para que tu bebé duerma seguro son:

- Acuéstalo **siempre boca arriba**, en siestas y en la noche.
- Sobre un **colchón firme y plano**, con una sábana ajustada.
- **Nada más en la cuna:** sin almohadas, cobijas sueltas, protectores ni peluches.
- Puede dormir **en tu cuarto, pero en su propia cuna**, no en tu cama.

Una cuna vacía puede verse triste, pero es la forma más segura de dormir para tu bebé.

${SAFETY_CLOSING}`,
  },
  {
    night: 6,
    subject: "Noche 6: un sonido que tapa los ruidos de la casa",
    body: `Hola, mamá 💛

Una puerta, un perro o la televisión pueden despertar a tu bebé. Un sonido suave y constante ayuda a tapar esos ruidos.

Esta noche prueba los **Sonidos** de Duerme Ya. Dos cuidados importantes:

- Pon el celular o el aparato **lejos de la cuna**, nunca adentro.
- Usa un **volumen bajo**, más o menos como el de una ducha suave a lo lejos.

Si a tu bebé no le gusta, no pasa nada. No todos los bebés lo necesitan.

${SAFETY_CLOSING}`,
  },
  {
    night: 7,
    subject: "Noche 7: luz de día, oscuridad de noche",
    body: `Hola, mamá 💛

¡Llevas una semana! 💛 Hoy vas a ayudarle a su reloj interno.

- **En la mañana:** abre cortinas, deja entrar la luz, sal un rato si puedes.
- **En la tarde y la noche:** baja las luces poco a poco.
- **De madrugada:** si tienes que atenderlo, usa una luz muy tenue.

Así su cuerpo aprende, poco a poco, que el día es para estar despierto y la noche para dormir.

${SAFETY_CLOSING}`,
  },
  {
    night: 8,
    subject: "Noche 8: un bebé muy cansado duerme peor, no mejor",
    body: `Hola, mamá 💛

Parece lógico que si tu bebé no duerme siesta, va a dormir mejor en la noche. Pero muchas veces pasa lo contrario: cuando se cansa de más, le cuesta más dormirse y se despierta más.

Hoy vas a fijarte en las **siestas**. Mira en Duerme Ya la hora del Próximo descanso durante el día también, y trata de que no se pase mucho de esa hora.

No tiene que salir perfecto. Una siesta corta también cuenta.

${SAFETY_CLOSING}`,
  },
  {
    night: 9,
    subject: "Noche 9: somnoliento, pero todavía despierto",
    body: `Hola, mamá 💛

Hoy vas a probar algo pequeño: acostar a tu bebé cuando esté **tranquilo y con sueño, pero todavía con los ojitos abiertos**.

Si se queja, puedes quedarte a su lado, hablarle suave o poner tu mano sobre él. Si llora, cárgalo y cálmalo. Esto no se trata de dejarlo llorar.

Si hoy no funciona, está bien. Es una habilidad que se aprende con práctica, y algunos bebés tardan más que otros.

${SAFETY_CLOSING}`,
  },
  {
    night: 10,
    subject: "Noche 10: cuando se despierta de madrugada",
    body: `Hola, mamá 💛

Despertarse de noche es normal en los bebés, sobre todo en los más pequeños. Hoy no vamos a evitar los despertares, sino a hacer que sean más tranquilos:

- **Poca luz:** solo la necesaria.
- **Pocas palabras:** voz baja y calmada.
- **Sin juegos ni pantallas:** atiéndelo con cariño y vuelve a acostarlo.

Así, poco a poco, entiende que la noche no es hora de jugar.

${SAFETY_CLOSING}`,
  },
  {
    night: 11,
    subject: "Noche 11: la comida y el sueño",
    body: `Hola, mamá 💛

Muchos bebés se acostumbran a dormirse solo comiendo, y es completamente normal. Hoy vas a probar un cambio pequeño: si tu rutina lo permite, dale de comer **al principio** de la rutina, antes de la pijama o la canción, en lugar de justo al final.

Esto no significa quitarle comidas. **Los bebés pequeños necesitan comer de noche**, y eso no se debe cambiar sin hablarlo con tu pediatra.

Solo estamos separando un poquito la comida del momento de dormirse.

${SAFETY_CLOSING}`,
  },
  {
    night: 12,
    subject: "Noche 12: que todos hagan lo mismo",
    body: `Hola, mamá 💛

Si papá, la abuela, la niñera o quien te ayude acuesta al bebé de otra forma, el bebé se confunde.

Hoy vas a compartir la rutina con quien te ayuda: el orden de la rutina, la hora del Próximo descanso y las reglas de la cuna segura de la noche 5.

No tiene que ser idéntico, pero mientras más parecido, más fácil para tu bebé. Y para ti: no tienes que cargar con todo sola.

${SAFETY_CLOSING}`,
  },
  {
    night: 13,
    subject: "Noche 13: si hoy fue difícil, no perdiste nada",
    body: `Hola, mamá 💛

Va a haber noches malas. Los dientes, un resfriado, un viaje o un salto de desarrollo pueden desordenar el sueño por unos días. Eso no significa que todo lo que hiciste se perdió.

En esos días, primero atiende a tu bebé y cuídate tú. Cuando pase, vuelve a la rutina de siempre.

Y si tu bebé está enfermo o algo no te parece normal, no esperes: consulta a tu pediatra.

${SAFETY_CLOSING}`,
  },
  {
    night: 14,
    subject: "Noche 14: tu rutina, la que funciona para ustedes",
    body: `Hola, mamá 💛

Llegaste a la noche 14. Esta noche no vas a aprender nada nuevo. Vas a mirar hacia atrás:

- ¿Qué paso le ayudó más a tu bebé?
- ¿Qué fue más fácil para ti?
- ¿Qué quieres seguir haciendo?

Quédate con eso. Esa es tu rutina, la que funciona para tu familia. Duerme Ya va a seguir avisándote el Próximo descanso todos los días.

Gracias por darte estas dos semanas. Lo hiciste muy bien. 💛

${SAFETY_CLOSING}`,
  },
];

export function planEmailForNight(night: number): PlanEmail | null {
  return PLAN_EMAILS.find((e) => e.night === night) ?? null;
}
