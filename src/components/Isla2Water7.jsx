import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Heart, User } from "lucide-react";
import imageFail from "../image/isla2Fallo.png";
import imageSuccess from "../image/isla2Acierto.png";

const dialogos = [
  {
    emisor: "Cliente",
    texto: "¡Quiero un botón mágico que haga todo mi trabajo con un solo clic!",
    opciones: [
      { texto: "El usuario presiona un botón y la base de datos se borra.", correcta: false },
      {
        texto: "Necesitamos un único punto de entrada en la interfaz que orqueste varios procesos en el backend.",
        correcta: true,
      },
      { texto: "Le pondremos un botón con brillos usando CSS animado.", correcta: false },
    ],
  },
  {
    emisor: "Programador",
    texto: "Implementaré una API RESTful con autenticación JWT y un pipeline CI/CD.",
    opciones: [
      {
        texto: "El sistema usará un inicio de sesión seguro estándar y actualizaciones automáticas, señor.",
        correcta: true,
      },
      { texto: "El servidor va a ser muy caro de mantener.", correcta: false },
      { texto: "Dice que va a programar un robot que haga nuestro trabajo.", correcta: false },
    ],
  },
  {
    emisor: "Cliente",
    texto: "La aplicación debe ser súper rápida y nunca colgarse, ¡eso es lo más importante!",
    opciones: [
      { texto: "Habrá que programarlo en Ensamblador.", correcta: false },
      {
        texto: "El requisito no funcional exige un tiempo de respuesta < 2s y alta disponibilidad (99.9% uptime).",
        correcta: true,
      },
      { texto: "Dice que no le importa el diseño, solo que no falle.", correcta: false },
    ],
  },
];

function shuffleOptions(options) {
  const copied = [...options];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

const MAX_LIVES = 3;

export default function Isla2Water7({ onIslandCompleted, playError, playSuccess }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [outcome, setOutcome] = useState(null);
  const [victory, setVictory] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "info",
    message: "Selecciona la mejor traducción.",
  });
  const [displayedOptions, setDisplayedOptions] = useState(() =>
    shuffleOptions(dialogos[0].opciones),
  );

  const lockRef = useRef(false);
  const livesRef = useRef(MAX_LIVES);

  const loseLife = () => {
    const newLives = livesRef.current - 1;
    livesRef.current = newLives;
    setLives(newLives);
    return newLives;
  };

  const handleOption = (option) => {
    if (victory || outcome === "failure" || lockRef.current) return;

    lockRef.current = true;
    setIsLocked(true);

    if (option.correcta) {
      playSuccess();
      const nextIndex = currentIndex + 1;
      if (nextIndex >= dialogos.length) {
        setVictory(true);
        lockRef.current = false;
        setIsLocked(false);
        return;
      }
      setFeedback({
        type: "success",
        message: `¡Correcto! Pregunta ${nextIndex + 1}/${dialogos.length}.`,
      });
      setCurrentIndex(nextIndex);
      setDisplayedOptions(shuffleOptions(dialogos[nextIndex].opciones));
    } else {
      playError();
      const newLives = loseLife();

      if (newLives <= 0) {
        setOutcome("failure");
        return;
      }

      setFeedback({
        type: "error",
        message: `¡Respuesta incorrecta! Te quedan ${newLives} vidas. Inténtalo de nuevo.`,
      });
      setDisplayedOptions(shuffleOptions(dialogos[currentIndex].opciones));
    }

    lockRef.current = false;
    setIsLocked(false);
  };

  const reset = () => {
    livesRef.current = MAX_LIVES;
    setCurrentIndex(0);
    setLives(MAX_LIVES);
    setOutcome(null);
    setVictory(false);
    setFeedback({ type: "info", message: "Selecciona la mejor traducción." });
    setDisplayedOptions(shuffleOptions(dialogos[0].opciones));
    lockRef.current = false;
    setIsLocked(false);
  };

  return (
    <section className="relative mx-auto max-w-3xl rounded-3xl bg-stone-900 p-6 text-amber-50">
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
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 rounded-lg bg-amber-100/20 p-4 text-center text-amber-100"
      >
        <p className="italic">"{dialogos[currentIndex].texto}"</p>
        <p className="mt-2 text-sm font-semibold">- {dialogos[currentIndex].emisor}</p>
      </motion.div>

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
        {displayedOptions.map((option, idx) => (
          <button
            key={`${option.texto}-${idx}`}
            onClick={() => handleOption(option)}
            disabled={victory || outcome === "failure" || isLocked}
            className="w-full rounded-xl bg-amber-100 px-4 py-3 font-bold text-blue-950 hover:bg-amber-200 disabled:opacity-50"
          >
            {option.texto}
          </button>
        ))}
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
