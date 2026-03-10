import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, User } from "lucide-react";

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

export default function Isla2Water7({ onBackToMenu, onIslandCompleted, playError, playSuccess }) {
  const TURN_TIME = 30;
  const TARGET_STREAK = 3;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [seconds, setSeconds] = useState(TURN_TIME);
  const [gameOver, setGameOver] = useState(false);
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

  useEffect(() => {
    if (victory || gameOver) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [victory, gameOver]);

  const handleOption = (option) => {
    if (gameOver || victory || lockRef.current) return;

    lockRef.current = true;
    setIsLocked(true);

    if (option.correcta) {
      playSuccess();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setFeedback({
        type: "success",
        message: `¡Correcto! Racha actual: ${nextStreak}/${TARGET_STREAK}.`,
      });

      if (nextStreak >= TARGET_STREAK) {
        setVictory(true);
        lockRef.current = false;
        setIsLocked(false);
        return;
      }

      const nextIndex = (currentIndex + 1) % dialogos.length;
      setCurrentIndex(nextIndex);
      setDisplayedOptions(shuffleOptions(dialogos[nextIndex].opciones));
    } else {
      playError();
      setStreak(0);
      setFeedback({
        type: "error",
        message: "Has fallado. Tienes otra oportunidad con las opciones en otra posición.",
      });
      // Repite el mismo dialogo con opciones mezcladas para reintento.
      setDisplayedOptions(shuffleOptions(dialogos[currentIndex].opciones));
    }

    // Se reinicia el contador tras cada respuesta.
    setSeconds(TURN_TIME);
    lockRef.current = false;
    setIsLocked(false);
  };

  const reset = () => {
    setCurrentIndex(0);
    setStreak(0);
    setSeconds(TURN_TIME);
    setGameOver(false);
    setVictory(false);
    setFeedback({ type: "info", message: "Selecciona la mejor traducción." });
    setDisplayedOptions(shuffleOptions(dialogos[0].opciones));
    lockRef.current = false;
    setIsLocked(false);
  };

  return (
    <section className="relative mx-auto max-w-3xl rounded-3xl bg-stone-900 p-6 text-amber-50">
      <div className="flex justify-center">
        <span className={`text-2xl font-bold ${seconds < 10 ? "text-red-500" : "text-amber-300"}`}>
          {seconds}s
        </span>
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
            disabled={gameOver || victory || isLocked}
            className="w-full rounded-xl bg-amber-100 px-4 py-3 font-bold text-blue-950 hover:bg-amber-200 disabled:opacity-50"
          >
            {option.texto}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-6 text-center">
          <p className="mb-4 text-2xl font-black text-red-400">¡Se acabó el tiempo!</p>
          <button onClick={reset} className="rounded-xl bg-yellow-500 px-6 py-3 font-bold uppercase">
            Reintentar
          </button>
        </div>
      )}

      {victory && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-6 text-center">
          <p className="mb-4 text-2xl font-black text-green-400">
            ¡Has traducido todo! Rumbo a la Isla 3...
          </p>
          <button
            onClick={onIslandCompleted}
            className="mb-3 rounded-xl bg-yellow-500 px-6 py-3 font-bold uppercase"
          >
            Ir a Isla 3
          </button>
          <button onClick={onBackToMenu} className="text-sm text-amber-200 underline">
            Volver al menú
          </button>
        </div>
      )}
    </section>
  );
}
