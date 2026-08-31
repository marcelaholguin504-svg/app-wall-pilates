import { useNavigate } from "react-router-dom";
import { BookOpen, Music2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/IconBadge";

// Contenido tal como fue redactado — no se reescribe aquí, solo se le da
// formato de pantalla. Solo se mencionan títulos y nombres, nunca letras de
// canciones ni contenido de los libros (derechos de autor).

const BOOKS_BY_AGE: { age: string; titles: string[] }[] = [
  {
    age: "0-12 meses",
    titles: ["Luna — Antonio Rubio", "Un beso antes de dormir — Teresa Tellechea", "El cucú-trás — Francesca Ferri"],
  },
  {
    age: "1-2 años",
    titles: ["Buenas noches, Luna — Margaret Wise Brown", "Mis sueños — Xavier Deneux", "Durmiendo con mamá — Susanna Isern"],
  },
  {
    age: "2-3 años",
    titles: [
      "El conejito que quiere dormirse — Carl-Johan Forssén Ehrlin",
      "¿A qué sabe la luna? — Michael Grejniec",
      "Mi camita — J. S. Pinillos",
    ],
  },
];

const LULLABIES = [
  "Arrorró mi niño",
  "A la nanita nana",
  "Duérmete niño, duérmete ya",
  "Señora Santana",
  "A la rorro niño",
  "Cinco lobitos",
  "Este niño tiene sueño",
  "Los pollitos dicen",
];

export default function Library() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-5 pt-6 pb-12">
      <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm font-semibold mb-4 touch-target">
        ← Atrás
      </button>

      <h1 className="font-display text-2xl font-extrabold mb-1">Biblioteca</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        Ideas para acompañar el momento de dormir — no son parte de la app, son sugerencias para buscar, pedir
        prestado o comprar.
      </p>

      <div className="flex flex-col gap-4">
        <Card>
          <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <IconBadge icon={BookOpen} /> Libros recomendados para leer antes de dormir
          </h2>
          <div className="flex flex-col gap-4">
            {BOOKS_BY_AGE.map((group) => (
              <div key={group.age}>
                <p className="text-sm font-semibold mb-2">{group.age}</p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90">
                  {group.titles.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <IconBadge icon={Music2} /> Canciones de cuna tradicionales
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed mb-4">
            Estas son canciones de generación en generación — la app solo menciona el nombre, para que las tararees
            tú mismo/a de memoria, como se ha hecho siempre en las familias:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-foreground/90">
            {LULLABIES.map((song) => (
              <li key={song}>{song}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
