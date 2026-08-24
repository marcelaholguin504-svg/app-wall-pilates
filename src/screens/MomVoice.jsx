import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, useAppDispatch } from "../state/AppContext.jsx";
import { Button, Card, Field, TextInput, Sheet } from "../components/ui.jsx";
import { generateId } from "../lib/ids.js";

const MAX_SECONDS = 20;

export default function MomVoice() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [pendingBlob, setPendingBlob] = useState(null);
  const [label, setLabel] = useState("");
  const [naming, setNaming] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  async function startRecording() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Tu navegador no permite grabar audio aquí. Intenta desde la app instalada en tu teléfono.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setPendingBlob(blob);
        setNaming(true);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stopRecording();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError("No pudimos acceder al micrófono. Revisa los permisos de la app.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
  }

  function saveRecording() {
    if (!pendingBlob) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({
        type: "ADD_MOM_VOICE",
        message: {
          id: generateId("voice"),
          label: label.trim() || "Mensaje sin nombre",
          dataUrl: reader.result,
          createdAt: new Date().toISOString(),
        },
      });
      setNaming(false);
      setPendingBlob(null);
      setLabel("");
    };
    reader.readAsDataURL(pendingBlob);
  }

  function discardRecording() {
    setNaming(false);
    setPendingBlob(null);
    setLabel("");
  }

  function play(message) {
    const audio = new Audio(message.dataUrl);
    audio.play().catch(() => setError("No se pudo reproducir el mensaje."));
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate(-1)} className="text-moon-300 text-sm font-semibold mb-4">
        ← Atrás
      </button>

      <div className="text-center mb-6">
        <div className="text-4xl mb-2">❤️</div>
        <h1 className="font-display text-2xl font-extrabold mb-1">Voz de Mamá</h1>
        <p className="text-moon-300 text-sm max-w-[300px] mx-auto">
          Graba mensajes cortos y calmantes para que {state.child?.name || "tu bebé"} los escuche con otro cuidador.
        </p>
      </div>

      <Card className="mb-6 text-center py-8">
        {recording ? (
          <>
            <div className="text-4xl mb-3 animate-breathe">🎙️</div>
            <p className="font-display text-3xl font-extrabold mb-4">{seconds}s</p>
            <Button variant="sos" onClick={stopRecording}>
              ⏹ Detener grabación
            </Button>
          </>
        ) : (
          <>
            <div className="text-4xl mb-3">🎙️</div>
            <p className="text-white/60 text-sm mb-4">Graba hasta {MAX_SECONDS} segundos</p>
            <Button onClick={startRecording}>Grabar mensaje</Button>
          </>
        )}
        {error && <p className="text-alert-400 text-sm mt-3">{error}</p>}
      </Card>

      <p className="text-xs font-bold uppercase tracking-wide text-moon-300 mb-3 px-1">Mis mensajes</p>
      <div className="flex flex-col gap-2.5">
        {state.momVoiceMessages.length === 0 && (
          <Card>
            <p className="text-sm text-white/50">Aún no has grabado ningún mensaje.</p>
          </Card>
        )}
        {state.momVoiceMessages.map((m) => (
          <Card key={m.id} className="flex items-center gap-3">
            <button
              onClick={() => play(m)}
              className="w-10 h-10 rounded-full bg-moon-500/20 flex items-center justify-center text-lg shrink-0"
            >
              ▶️
            </button>
            <span className="flex-1 text-sm font-semibold">{m.label}</span>
            <button
              onClick={() => dispatch({ type: "REMOVE_MOM_VOICE", id: m.id })}
              className="text-white/30 text-lg px-1"
              aria-label="Eliminar mensaje"
            >
              ×
            </button>
          </Card>
        ))}
      </div>

      <Sheet open={naming} onClose={discardRecording}>
        <h3 className="font-display text-lg font-extrabold mb-4">Ponle un nombre a tu mensaje</h3>
        <Field label="Nombre">
          <TextInput
            autoFocus
            placeholder="Ej. Buenas noches, mi amor"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </Field>
        <Button onClick={saveRecording}>Guardar mensaje</Button>
      </Sheet>
    </div>
  );
}
