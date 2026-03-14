import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Cpu, Heart, User } from "lucide-react";
import imageFail from "../image/isla2Fallo.png";
import imageSuccess from "../image/isla2Acierto.png";

const MAX_LIVES = 5;

async function parseResponse(response) {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || "No se pudo conectar con el servidor del minijuego.";
    throw new Error(message);
  }

  return payload;
}

export default function Isla2Water7({ onBackToMenu, onIslandCompleted, playClick, playError, playSuccess }) {
  const [currentDialog, setCurrentDialog] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [outcome, setOutcome] = useState(null);
  const [victory, setVictory] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [feedback, setFeedback] = useState({
    type: "info",
    message: "Selecciona la mejor traducción.",
  });

  const applyServerState = (data) => {
    setCurrentDialog(data.question || null);
    setCurrentQuestionNumber(data.currentQuestionNumber || 1);
    setTotalQuestions(data.totalQuestions || 0);
    setLives(typeof data.lives === "number" ? data.lives : MAX_LIVES);

    if (data.status === "victory") {
      setVictory(true);
      setOutcome(null);
      return;
    }

    if (data.status === "failure") {
      setOutcome("failure");
      setVictory(false);
      return;
    }

    setVictory(false);
    setOutcome(null);
  };

  const startGame = async () => {
    setIsLoading(true);
    setRequestError("");
    setIsLocked(true);
    setFeedback({ type: "info", message: "Conectando con el servidor..." });

    try {
      const response = await fetch("/api/water7/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await parseResponse(response);
      applyServerState(data);
      setFeedback({
        type: "info",
        message: data.feedback || "Selecciona la mejor traducción.",
      });
    } catch (error) {
      setRequestError(error.message);
      setFeedback({
        type: "error",
        message: "No fue posible cargar la partida de Water 7.",
      });
    } finally {
      setIsLoading(false);
      setIsLocked(false);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleOption = async (optionId) => {
    if (victory || outcome === "failure" || isLocked || isLoading || !currentDialog) return;

    setRequestError("");
    setIsLocked(true);

    try {
      const response = await fetch("/api/water7/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ optionId }),
      });

      const data = await parseResponse(response);

      if (data.correct) {
        playSuccess();
        setFeedback({ type: "success", message: data.feedback || "¡Correcto!" });
      } else {
        playError();
        setFeedback({ type: "error", message: data.feedback || "Respuesta incorrecta." });
      }

      applyServerState(data);
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Error al validar la respuesta con el servidor.",
      });
      setRequestError(error.message);
    } finally {
      setIsLocked(false);
    }
  };

  const reset = () => {
    playClick?.();
    startGame();
  };

  return (
    <section className="relative mx-auto max-w-3xl rounded-3xl bg-stone-900 p-6 text-amber-50">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-900/30 bg-amber-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
            <Compass className="h-4 w-4" />
            Isla 2: Water 7
          </p>
          <h2 className="text-3xl font-black uppercase tracking-wide text-amber-50 md:text-4xl">
            Traduce al lenguaje técnico
          </h2>
        </div>

        <button
          type="button"
          onClick={onBackToMenu}
          className="rounded-lg border border-amber-500/60 bg-amber-200/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-50 transition hover:bg-amber-200/40"
        >
          Volver al menú
        </button>
      </div>

      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: MAX_LIVES }).map((_, index) => (
          <Heart
            key={`life-${index + 1}`}
            className={`h-5 w-5 ${index < lives ? "fill-red-500 text-red-600" : "text-slate-500"}`}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 items-center">
        <div className="flex flex-col items-center gap-2">
          <User className="h-8 w-8 text-amber-300" />
          <span className="text-sm uppercase text-amber-200">Cliente</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Cpu className="h-8 w-8 text-amber-300" />
          <span className="text-sm uppercase text-amber-200">Programador</span>
        </div>
      </div>

      <motion.div
        key={`${currentQuestionNumber}-${currentDialog?.id || "empty"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 rounded-lg bg-amber-100/20 p-4 text-center text-amber-100"
      >
        <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200/80">
          Pregunta {currentQuestionNumber}/{totalQuestions || "-"}
        </p>
        {isLoading ? (
          <p className="mt-2 italic">Cargando diálogo...</p>
        ) : currentDialog ? (
          <>
            <p className="mt-2 italic">"{currentDialog.texto}"</p>
            <p className="mt-2 text-sm font-semibold">- {currentDialog.emisor}</p>
          </>
        ) : (
          <p className="mt-2 italic">No hay diálogo disponible.</p>
        )}
      </motion.div>

      {requestError && (
        <div className="mt-3 rounded-lg border border-red-300/70 bg-red-900/20 px-4 py-2 text-center text-xs font-semibold text-red-100">
          {requestError}
        </div>
      )}

      <div
        className={`mt-4 rounded-lg border px-4 py-2 text-center text-sm font-bold ${
          feedback.type === "success"
            ? "border-emerald-300 bg-emerald-100/20 text-emerald-200"
            : feedback.type === "error"
              ? "border-red-300 bg-red-100/20 text-red-200"
              : "border-amber-300 bg-amber-100/10 text-amber-100"
        }`}
      >
        {feedback.message}
      </div>

      <div className="mt-6 grid gap-4">
        {(currentDialog?.opciones || []).map((option) => (
          <button
            key={option.id}
            onClick={() => handleOption(option.id)}
            disabled={victory || outcome === "failure" || isLocked || isLoading}
            className="w-full rounded-xl bg-amber-100 px-4 py-3 font-bold text-blue-950 hover:bg-amber-200 disabled:opacity-50"
          >
            {option.texto}
          </button>
        ))}

        {!isLoading && !currentDialog && (
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-xl border-2 border-amber-400 bg-amber-300 px-4 py-3 font-black uppercase tracking-wide text-blue-950"
          >
            Reintentar conexión
          </button>
        )}
      </div>

      {outcome === "failure" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/75 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-red-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <img src={imageFail} alt="Derrota en Water 7" className="w-full max-h-[60vh] object-contain" />
            <div className="space-y-4 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wide text-red-300">Derrota en Water 7</h3>
              <p className="font-semibold text-amber-100/90">
                Te has quedado sin vidas. Reorganiza la estrategia y vuelve a intentarlo.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={reset}
                  className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-blue-950 transition hover:brightness-105"
                >
                  Reintentar Isla 2
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {victory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/75 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-emerald-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <img src={imageSuccess} alt="Victoria en Water 7" className="w-full max-h-[60vh] object-contain" />
            <div className="space-y-3 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wide text-emerald-300">¡Isla 2 completada!</h3>
              <p className="font-semibold text-amber-100/90">
                ¡Has traducido todo! Has desbloqueado la Isla 3.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={onIslandCompleted}
                  className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-blue-950 transition hover:brightness-105"
                >
                  Siguiente isla
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
