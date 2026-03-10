import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Cpu } from "lucide-react";

const dialogos = [
  {
    emisor: "Cliente",
    texto: "¡Quiero un botón mágico que haga todo mi trabajo con un solo clic!",
    opciones: [
      { texto: "El usuario presiona un botón y la base de datos se borra.", correcta: false },
      { texto: "Necesitamos un único punto de entrada en la interfaz que orqueste varios procesos en el backend.", correcta: true },
      { texto: "Le pondremos un botón con brillos usando CSS animado.", correcta: false }
    ]
  },
  {
    emisor: "Programador",
    texto: "Implementaré una API RESTful con autenticación JWT y un pipeline CI/CD.",
    opciones: [
      { texto: "El sistema usará un inicio de sesión seguro estándar y actualizaciones automáticas, señor.", correcta: true },
      { texto: "El servidor va a ser muy caro de mantener.", correcta: false },
      { texto: "Dice que va a programar un robot que haga nuestro trabajo.", correcta: false }
    ]
  },
  {
    emisor: "Cliente",
    texto: "La aplicación debe ser súper rápida y nunca colgarse, ¡eso es lo más importante!",
    opciones: [
      { texto: "Habrá que programarlo en Ensamblador.", correcta: false },
      { texto: "El requisito no funcional exige un tiempo de respuesta < 2s y alta disponibilidad (99.9% uptime).", correcta: true },
      { texto: "Dice que no le importa el diseño, solo que no falle.", correcta: false }
    ]
  }
];

export default function Isla2Water7({ onBackToMenu, onIslandCompleted, playError, playSuccess }) {
  const TURN_TIME = 30;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [seconds, setSeconds] = useState(TURN_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  // temporizador global
  useEffect(() => {
    if (victory || gameOver) return;
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [victory, gameOver]);

  const handleOption = (op) => {
    if (gameOver || victory) return;

    if (op.correcta) {
      playSuccess();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak >= 3) {
        setVictory(true);
        return;
      }
    } else {
      playError();
      setStreak(0);
    }

    setCurrentIndex((i) => (i + 1) % dialogos.length);
    // Cada nueva respuesta abre un nuevo turno de 30 segundos.
    setSeconds(TURN_TIME);
  };

  const reset = () => {
    setCurrentIndex(0);
    setStreak(0);
    setSeconds(TURN_TIME);
    setGameOver(false);
    setVictory(false);
  };

  return (
    <section className="relative mx-auto max-w-3xl rounded-3xl bg-stone-900 p-6 text-amber-50">
      {/* cronómetro */}
      <div className="flex justify-center">
        <span className={`text-2xl font-bold ${seconds < 10 ? "text-red-500" : "text-amber-300"}`}>{seconds}s</span>
      </div>

      {/* emisor/actor */}
      <div className="mt-4 grid grid-cols-2 items-center">
        <div className="flex flex-col items-center gap-2">
          <User className="h-8 w-8 text-amber-300" />
          <span className="uppercase text-sm text-amber-200">Cliente</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Cpu className="h-8 w-8 text-amber-300" />
          <span className="uppercase text-sm text-amber-200">Programador</span>
        </div>
      </div>

      {/* diálogo actual */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 rounded-lg bg-amber-100/20 p-4 text-center text-amber-100"
      >
        <p className="italic">"{dialogos[currentIndex].texto}"</p>
        <p className="mt-2 font-semibold text-sm">– {dialogos[currentIndex].emisor}</p>
      </motion.div>

      {/* opciones */}
      <div className="mt-6 grid gap-4">
        {dialogos[currentIndex].opciones.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOption(opt)}
            disabled={gameOver || victory}
            className="w-full rounded-xl bg-amber-100 px-4 py-3 text-blue-950 font-bold hover:bg-amber-200 disabled:opacity-50"
          >
            {opt.texto}
          </button>
        ))}
      </div>

      {/* game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-6 text-center">
          <p className="mb-4 text-2xl font-black text-red-400">¡Se acabó el tiempo!</p>
          <button
            onClick={reset}
            className="rounded-xl bg-yellow-500 px-6 py-3 font-bold uppercase"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* victoria overlay */}
      {victory && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-6 text-center">
          <p className="mb-4 text-2xl font-black text-green-400">
            ¡Has traducido todo! Rumbo a la siguiente isla...
          </p>
          <button
            onClick={onIslandCompleted}
            className="mb-3 rounded-xl bg-yellow-500 px-6 py-3 font-bold uppercase"
          >
            ¡Zarpar a la siguiente isla!
          </button>
          <button
            onClick={onBackToMenu}
            className="text-sm underline text-amber-200"
          >
            Volver al menú
          </button>
        </div>
      )}
    </section>
  );
}
