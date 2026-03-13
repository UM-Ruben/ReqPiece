import { motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import imageFail from "../image/isla4BigMomFallo.png";
import imageSuccess from "../image/isla4BigMomAcierto.png";

const GAME_TIME_SECONDS = 40;
const MAX_TIME_SECONDS = 60;
const TIME_GAIN_ON_HIT = 2;
const TIME_PENALTY_ON_FAIL = 7;
const SWIPE_THRESHOLD = 120;

const REQUIREMENTS_POOL = [
  { texto: "El usuario debe poder registrar una cuenta nueva.", tipo: "funcional" },
  { texto: "El sistema debe permitir recuperar la contrasena por correo.", tipo: "funcional" },
  { texto: "La app debe generar reportes PDF de ventas.", tipo: "funcional" },
  { texto: "El cliente puede filtrar pedidos por fecha y estado.", tipo: "funcional" },
  { texto: "El administrador puede eliminar usuarios inactivos.", tipo: "funcional" },
  { texto: "El sistema debe enviar notificaciones push al móvil.", tipo: "funcional" },
  { texto: "La respuesta de búsqueda debe tardar menos de 2 segundos.", tipo: "no-funcional" },
  { texto: "El sistema debe tener disponibilidad mínima del 99.9%.", tipo: "no-funcional" },
  { texto: "Las contraseñas deben almacenarse cifradas con hash seguro.", tipo: "no-funcional" },
  { texto: "La interfaz debe ser usable desde móviles y tablets.", tipo: "no-funcional" },
  { texto: "El tiempo de carga de la página principal debe ser menor a 3 segundos.", tipo: "no-funcional" },
  { texto: "El sistema debe cumplir con el estándar ISO 27001 de seguridad.", tipo: "no-funcional" },
];

function shuffle(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

export default function Isla4Sabaody({ onBackToMenu, onIslandCompleted, playClick, playError, playSuccess }) {
  const [deck, setDeck] = useState(() => shuffle(REQUIREMENTS_POOL));
  const [cardIndex, setCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [feedback, setFeedback] = useState({ text: "", color: "#0369a1" });
  const [outcome, setOutcome] = useState(null);
  const controls = useAnimation();

  const currentCard = deck[cardIndex] || null;
  const progressPercent = useMemo(
    () => Math.min(100, Math.max(0, (timeLeft / GAME_TIME_SECONDS) * 100)),
    [timeLeft]
  );

  const showFeedback = useCallback((text, color) => {
    setFeedback({ text, color });
    window.setTimeout(() => {
      setFeedback((prev) => (prev.text === text ? { text: "", color: "#0369a1" } : prev));
    }, 850);
  }, []);

  const finishGame = useCallback(
    (result) => {
      if (outcome) return;
      setOutcome(result);
      controls.stop();
    },
    [controls, outcome]
  );

  useEffect(() => {
    if (outcome) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          finishGame("failure");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finishGame, outcome]);

  useEffect(() => {
    if (!outcome && cardIndex >= deck.length && deck.length > 0) {
      finishGame("success");
    }
  }, [cardIndex, deck.length, finishGame, outcome]);

  const nextCard = useCallback(() => {
    setCardIndex((prev) => prev + 1);
  }, []);

  const applyChoice = useCallback(
    (side) => {
      if (!currentCard || outcome) return;

      const guessedType = side === "left" ? "funcional" : "no-funcional";
      const isCorrect = guessedType === currentCard.tipo;

      if (isCorrect) {
        playSuccess?.();
        setScore((prev) => prev + 10);
        setTimeLeft((prev) => Math.min(MAX_TIME_SECONDS, prev + TIME_GAIN_ON_HIT));
        showFeedback("¡Delicioso!", "#16a34a");
      } else {
        playError?.();
        setTimeLeft((prev) => {
          const next = Math.max(0, prev - TIME_PENALTY_ON_FAIL);
          if (next <= 0) {
            finishGame("failure");
          }
          return next;
        });
        showFeedback("¡Sabor amargo!", "#b91c1c");
      }

      nextCard();
    },
    [currentCard, finishGame, nextCard, outcome, playError, playSuccess, showFeedback]
  );

  useEffect(() => {
    if (!outcome) return;
    if (outcome === "success") {
      playSuccess?.();
    } else {
      playError?.();
    }
  }, [outcome, playError, playSuccess]);

  const resetGame = useCallback(() => {
    playClick();
    setDeck(shuffle(REQUIREMENTS_POOL));
    setCardIndex(0);
    setScore(0);
    setTimeLeft(GAME_TIME_SECONDS);
    setFeedback({ text: "", color: "#0369a1" });
    setOutcome(null);
    controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
  }, [controls, playClick]);

  const handleDragEnd = async (_, info) => {
    if (outcome || !currentCard) return;
    const offsetX = info.offset.x;

    if (offsetX <= -SWIPE_THRESHOLD) {
      await controls.start({ x: -460, rotate: -16, opacity: 0, transition: { duration: 0.2 } });
      controls.set({ x: 0, rotate: 0, opacity: 1 });
      applyChoice("left");
      return;
    }

    if (offsetX >= SWIPE_THRESHOLD) {
      await controls.start({ x: 460, rotate: 16, opacity: 0, transition: { duration: 0.2 } });
      controls.set({ x: 0, rotate: 0, opacity: 1 });
      applyChoice("right");
      return;
    }

    controls.start({ x: 0, y: 0, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 380, damping: 26 } });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-5xl rounded-3xl border-4 border-pink-300/90 bg-gradient-to-b from-pink-100 via-rose-100 to-yellow-100 p-5 text-slate-800 shadow-[0_18px_40px_rgba(0,0,0,0.28)] md:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-700">Isla 4: Whole Cake</p>
          <h2 className="mt-2 text-3xl font-black uppercase text-rose-900">Swipe de Requisitos Dulces</h2>
          <p className="mt-2 text-sm font-semibold text-rose-900/85">
            Arrastra la tarjeta: izquierda = Funcional, derecha = No Funcional. Si fallas o tardas, Big Mom entra en rabieta.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToMenu}
          className="rounded-lg border border-amber-500/60 bg-amber-200/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-rose-900 transition hover:bg-amber-200/40"
        >
          Volver al menú
        </button>
      </div>

      <div className="mt-4 rounded-xl border-2 border-rose-300/70 bg-white/60 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-rose-800">
          <span>Barra de Rabieta</span>
          <span>{timeLeft}s</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-rose-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-pink-500 to-rose-600"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-black uppercase tracking-[0.08em]">
        <span className="rounded-lg bg-sky-500 px-3 py-2 text-white">Puntaje: {score}</span>
        <span className="rounded-lg bg-yellow-400 px-3 py-2 text-slate-900">Tarjeta: {Math.min(cardIndex + 1, deck.length)}/{deck.length}</span>
        {feedback.text && (
          <span className="rounded-lg px-3 py-2 text-white" style={{ backgroundColor: feedback.color }}>
            {feedback.text}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.2fr_1fr] md:items-center">
        <div className="min-h-[180px] rounded-2xl border-4 border-sky-300 bg-sky-100/80 p-4 text-center shadow-inner">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Caldero Izquierdo</p>
          <p className="mt-2 text-2xl font-black text-sky-900">Funcional</p>
          <p className="mt-2 text-xs font-semibold text-sky-800/80">Acciones: que hace el sistema.</p>
        </div>

        <div className="relative flex min-h-[260px] items-center justify-center">
          {currentCard && !outcome ? (
            <motion.div
              key={`${cardIndex}-${currentCard.texto}`}
              className="w-full max-w-md cursor-grab select-none rounded-3xl border-4 border-yellow-300 bg-gradient-to-b from-yellow-100 to-amber-100 p-6 text-center shadow-[0_12px_28px_rgba(0,0,0,0.2)] active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              animate={controls}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Ingrediente Dulce</p>
              <p className="mt-4 text-lg font-black leading-snug text-amber-950">{currentCard.texto}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
                Desliza a izquierda o derecha
              </p>
            </motion.div>
          ) : (
            <div className="w-full max-w-md rounded-3xl border-4 border-rose-200 bg-white/70 p-6 text-center">
              <p className="text-lg font-black text-rose-900">Esperando resultado final...</p>
            </div>
          )}
        </div>

        <div className="min-h-[180px] rounded-2xl border-4 border-pink-300 bg-pink-100/85 p-4 text-center shadow-inner">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">Caldero Derecho</p>
          <p className="mt-2 text-2xl font-black text-pink-900">No Funcional</p>
          <p className="mt-2 text-xs font-semibold text-pink-800/80">Calidad: rendimiento, seguridad, usabilidad.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={outcome !== "success"}
          onClick={() => {
            playClick();
            onIslandCompleted();
          }}
          className={`rounded-xl border-2 px-5 py-3 text-sm font-black uppercase tracking-wide ${
            outcome === "success"
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "cursor-not-allowed border-slate-300 bg-slate-300 text-slate-600"
          }`}
        >
          Siguiente isla
        </button>
      </div>

      {outcome === "failure" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-rose-950/65 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-rose-300 bg-pink-50 text-center shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <img src={imageFail} alt="Derrota en Whole Cake" className="w-full max-h-[60vh] object-contain bg-rose-100" />
            <div className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-700">Big Mom</p>
              <h3 className="mt-2 text-3xl font-black uppercase text-rose-900">Rabieta de hambre</h3>
              <p className="mt-3 font-semibold text-rose-900/85">
                El tiempo se agoto. Puntaje final: {score}. Vuelve a preparar el pastel clasificando mejor.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-xl border-2 border-yellow-400 bg-yellow-300 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-rose-900"
                >
                  Reintentar Isla 4
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {outcome === "success" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-sky-950/55 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-sky-300 bg-sky-50 text-center shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <img src={imageSuccess} alt="Victoria en Whole Cake" className="w-full max-h-[60vh] object-contain bg-sky-100" />
            <div className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">Whole Cake</p>
              <h3 className="mt-2 text-3xl font-black uppercase text-sky-900">Pastel perfecto</h3>
              <p className="mt-3 font-semibold text-sky-900/85">
                Clasificaste todos los ingredientes. Puntaje final: {score}. Isla 5 desbloqueada.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onIslandCompleted();
                  }}
                  className="rounded-xl border-2 border-emerald-500 bg-emerald-500 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white"
                >
                  Siguiente isla
                </button>
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-xl border-2 border-yellow-500 bg-yellow-300 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-sky-900"
                >
                  Jugar otra vez
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
