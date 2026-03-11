import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import imageFail from "../image/isla3Fallo.png";
import imageSuccess from "../image/isla3Acierto.png";

const GAME_TIME_SECONDS = 60;
const MAX_LIVES = 3;
const MIN_SCORE_TO_WIN = 20;

const BARREL_POOL = [
  { texto: "Restringir el acceso a personal no autorizado", tipo: "problema" },
  { texto: "El sistema debe permitir recuperar contraseñas", tipo: "problema" },
  { texto: "Reducir tiempos de espera en hora pico", tipo: "problema" },
  { texto: "Usar un escaner de retina Sony X90", tipo: "solucion" },
  { texto: "Implementar microservicios con Kubernetes", tipo: "solucion" },
  { texto: "Guardar datos en PostgreSQL version 17", tipo: "solucion" },
  { texto: "Garantizar trazabilidad de cambios", tipo: "problema" },
  { texto: "Aplicar OAuth2 con proveedor externo", tipo: "solucion" },
];

function randomFromPool() {
  return BARREL_POOL[Math.floor(Math.random() * BARREL_POOL.length)];
}

function wrapTextLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export default function Isla3Sabaody({ onIslandCompleted, playClick }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const feedbackTimeoutRef = useRef(null);
  const barrelsRef = useRef([]);
  const lastFrameTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const gameEndedRef = useRef(false);
  const crosshairRef = useRef({ x: 450, y: 260 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [lives, setLives] = useState(MAX_LIVES);
  const [running, setRunning] = useState(true);
  const [outcome, setOutcome] = useState(null);
  const [feedback, setFeedback] = useState({ text: "", color: "#16a34a" });

  const deckY = 500;

  const finishGame = useCallback((result) => {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;
    setRunning(false);
    setOutcome(result);
    barrelsRef.current = [];
  }, []);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const showFeedback = useCallback((text, color) => {
    setFeedback({ text, color });
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedback({ text: "", color: "#16a34a" });
    }, 900);
  }, []);

  const processHit = useCallback(
    (barrel) => {
      if (gameEndedRef.current) return;
      if (barrel.tipo === "solucion") {
        setScore((prev) => prev + 10);
        showFeedback("¡Buen ojo! Solucion destruida", "#15803d");
      } else {
        setScore((prev) => prev - 5);
        setLives((prev) => {
          const next = Math.max(0, prev - 1);
          if (next <= 0) {
            finishGame("failure");
          }
          return next;
        });
        showFeedback("¡Destruiste un requisito!", "#b91c1c");
      }
    },
    [finishGame, showFeedback]
  );

  const processLanding = useCallback(
    (barrel) => {
      if (gameEndedRef.current) return;
      if (barrel.tipo === "problema") {
        setScore((prev) => prev + 10);
        showFeedback("¡Requisito salvado!", "#15803d");
      } else {
        setScore((prev) => prev - 5);
        setLives((prev) => {
          const next = Math.max(0, prev - 1);
          if (next <= 0) {
            finishGame("failure");
          }
          return next;
        });
        showFeedback("¡Contaminaste el diseno!", "#b91c1c");
      }
    },
    [finishGame, showFeedback]
  );

  useEffect(() => {
    if (!running || outcome) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          finishGame(scoreRef.current >= MIN_SCORE_TO_WIN ? "success" : "failure");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finishGame, outcome, running]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const createBarrel = () => {
      const base = randomFromPool();
      const width = 190;
      const height = 62;
      barrelsRef.current.push({
        id: crypto.randomUUID(),
        texto: base.texto,
        tipo: base.tipo,
        x: 90 + Math.random() * (canvas.width - 180 - width),
        y: 30 + Math.random() * 80,
        w: width,
        h: height,
        vx: (Math.random() - 0.5) * 14,
        vy: 38 + Math.random() * 18,
      });
    };

    const drawScene = (timestamp) => {
      const deltaMs = lastFrameTimeRef.current ? timestamp - lastFrameTimeRef.current : 16;
      lastFrameTimeRef.current = timestamp;
      const dt = deltaMs / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, "#0f172a");
      skyGradient.addColorStop(0.58, "#1d4ed8");
      skyGradient.addColorStop(1, "#60a5fa");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#f8fafc33";
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.arc(130 + i * 180, 70 + (i % 2) * 12, 32, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#0ea5e9";
      ctx.fillRect(0, 360, canvas.width, 180);

      ctx.fillStyle = "#7c3f00";
      ctx.fillRect(0, deckY, canvas.width, canvas.height - deckY);
      ctx.fillStyle = "#b45309";
      for (let x = 0; x < canvas.width; x += 48) {
        ctx.fillRect(x, deckY + 8, 34, 6);
      }

      if (running && !outcome) {
        spawnTimerRef.current += dt;
        if (spawnTimerRef.current >= 1.8) {
          spawnTimerRef.current = 0;
          createBarrel();
        }
      }

      const next = [];
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      for (const barrel of barrelsRef.current) {
        barrel.x += barrel.vx * dt;
        barrel.y += barrel.vy * dt;

        if (barrel.y + barrel.h >= deckY) {
          processLanding(barrel);
          continue;
        }

        if (barrel.x <= 15 || barrel.x + barrel.w >= canvas.width - 15) {
          barrel.vx *= -1;
        }

        ctx.fillStyle = "#7c4a1a";
        ctx.fillRect(barrel.x, barrel.y, barrel.w, barrel.h);
        ctx.strokeStyle = "#3f2408";
        ctx.lineWidth = 3;
        ctx.strokeRect(barrel.x, barrel.y, barrel.w, barrel.h);

        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(barrel.x, barrel.y + 20);
        ctx.lineTo(barrel.x + barrel.w, barrel.y + 20);
        ctx.moveTo(barrel.x, barrel.y + 42);
        ctx.lineTo(barrel.x + barrel.w, barrel.y + 42);
        ctx.stroke();

        ctx.fillStyle = "#fef3c7";
        const lines = wrapTextLines(ctx, barrel.texto, barrel.w - 16);
        lines.forEach((line, idx) => {
          ctx.fillText(line, barrel.x + barrel.w / 2, barrel.y + 18 + idx * 14);
        });

        next.push(barrel);
      }

      barrelsRef.current = next;

      const { x, y } = crosshairRef.current;
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 28, y);
      ctx.lineTo(x + 28, y);
      ctx.moveTo(x, y - 28);
      ctx.lineTo(x, y + 28);
      ctx.stroke();

      if (running && !outcome) {
        animationRef.current = window.requestAnimationFrame(drawScene);
      }
    };

    animationRef.current = window.requestAnimationFrame(drawScene);

    return () => {
      window.cancelAnimationFrame(animationRef.current);
      lastFrameTimeRef.current = 0;
    };
  }, [outcome, processLanding, running]);

  const handlePointerMove = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    crosshairRef.current = {
      x: Math.max(20, Math.min(canvas.width - 20, clientX - rect.left)),
      y: Math.max(20, Math.min(canvas.height - 20, clientY - rect.top)),
    };
  }, []);

  const fireShot = useCallback(() => {
    if (!running || outcome) return;
    const { x, y } = crosshairRef.current;

    const hitIndex = barrelsRef.current.findIndex(
      (barrel) => x >= barrel.x && x <= barrel.x + barrel.w && y >= barrel.y && y <= barrel.y + barrel.h
    );

    if (hitIndex === -1) return;

    const barrel = barrelsRef.current[hitIndex];
    barrelsRef.current.splice(hitIndex, 1);
    processHit(barrel);
  }, [outcome, processHit, running]);

  const resetIsland = useCallback(() => {
    playClick();
    setScore(0);
    setTimeLeft(GAME_TIME_SECONDS);
    setLives(MAX_LIVES);
    setFeedback({ text: "", color: "#16a34a" });
    setOutcome(null);
    gameEndedRef.current = false;
    barrelsRef.current = [];
    spawnTimerRef.current = 0;
    lastFrameTimeRef.current = 0;
    crosshairRef.current = { x: 450, y: 260 };
    setRunning(true);
  }, [playClick]);

  const finalMessage = useMemo(() => {
    if (outcome === "failure" && lives <= 0) return "La tripulacion perdio el control de la cubierta.";
    if (outcome === "failure") return "El tiempo acabo y la cubierta no quedo asegurada.";
    if (score >= 90) return "Dominaste el arte de distinguir el QUE del COMO.";
    if (score >= MIN_SCORE_TO_WIN) return "Buena navegacion, pero aun puedes afinar tu punteria analitica.";
    return "Necesitas reforzar la diferencia entre requisito y solucion.";
  }, [lives, outcome, score]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-5xl rounded-3xl border-4 border-amber-800/70 bg-gradient-to-b from-amber-50 via-amber-100 to-yellow-100 p-6 text-blue-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)] md:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-900">Isla 3: Archipielago Sabaody</p>
      <h2 className="mt-2 text-3xl font-black uppercase">Shooter Arcade - QUE vs COMO</h2>
      <p className="mt-2 text-sm font-semibold text-blue-900/85">
        Destruye barriles de solucion en el aire y deja caer los de problema para rescatar requisitos.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-black uppercase tracking-[0.08em]">
        <span className="rounded-lg bg-blue-950 px-3 py-2 text-amber-100">Puntaje: {score}</span>
        <span className="rounded-lg bg-blue-950 px-3 py-2 text-amber-100">Tiempo: {timeLeft}s</span>
        <span className="rounded-lg bg-blue-950 px-3 py-2 text-amber-100">Vidas: {lives}</span>
        {feedback.text && (
          <span className="rounded-lg px-3 py-2" style={{ backgroundColor: feedback.color, color: "#fff" }}>
            {feedback.text}
          </span>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border-4 border-blue-950/80 bg-sky-950">
        <canvas
          ref={canvasRef}
          width={900}
          height={560}
          className="h-auto w-full touch-none"
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onClick={fireShot}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            if (touch) handlePointerMove(touch.clientX, touch.clientY);
          }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            if (touch) handlePointerMove(touch.clientX, touch.clientY);
            fireShot();
          }}
        />
      </div>

      {!running && !outcome && (
        <div className="mt-4 rounded-2xl border-2 border-amber-700 bg-amber-100 p-4">
          <p className="text-lg font-black uppercase">Partida finalizada</p>
          <p className="mt-1 text-sm font-semibold">{finalMessage}</p>
        </div>
      )}

      {outcome === "failure" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/75 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-red-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <img src={imageFail} alt="Derrota en Sabaody" className="w-full max-h-[60vh] object-contain" />
            <div className="space-y-4 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wide text-red-300">Derrota en Sabaody</h3>
              <p className="font-semibold text-amber-100/90">{finalMessage}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetIsland}
                  className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-blue-950 transition hover:brightness-105"
                >
                  Reintentar Isla 3
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
          className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/75 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-emerald-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <img src={imageSuccess} alt="Victoria en Sabaody" className="w-full max-h-[60vh] object-contain" />
            <div className="space-y-3 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wide text-emerald-300">¡Isla 3 completada!</h3>
              <p className="font-semibold text-amber-100/90">{finalMessage}</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onIslandCompleted();
                  }}
                  className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-blue-950 transition hover:brightness-105"
                >
                  Siguiente isla
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
