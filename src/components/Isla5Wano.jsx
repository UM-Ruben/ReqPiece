import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import imageFail from "../image/isla5KaidoFallo.png";
import imageSuccess from "../image/isla5KaidoAcierto.png";

const TOTAL_TIME = 45;
const MAX_LIVES = 2;

const REQUIREMENTS = [
  {
    id: "r1",
    before: "El sistema de alerta debe responder de forma ",
    palabra: "rapido",
    after: " cuando el capataz active una emergencia.",
    reemplazo: "en menos de 2 segundos",
    razon: "Es verificable midiendo tiempo de respuesta maximo.",
  },
  {
    id: "r2",
    before: "La consola central de Onigashima debe ser ",
    palabra: "intuitiva",
    after: " para nuevos operarios.",
    reemplazo: "aprendible en menos de 15 minutos con 0 errores criticos",
    razon: "Permite pruebas de usabilidad con un criterio cuantificable.",
  },
  {
    id: "r3",
    before: "El blindaje del arsenal debe ser ",
    palabra: "indestructible",
    after: " ante ataques externos.",
    reemplazo: "capaz de soportar impactos de mas de 50 toneladas sin ruptura",
    razon: "Define umbral de resistencia comprobable en laboratorio.",
  },
  {
    id: "r4",
    before: "La red de comunicacion del castillo debe ser ",
    palabra: "robusta",
    after: " durante operaciones nocturnas.",
    reemplazo: "disponible al 99.95% mensual y tolerar 1 nodo caido",
    razon: "Es medible con metricas de disponibilidad y tolerancia a fallos.",
  },
  {
    id: "r5",
    before: "El registro de armamento debe ser ",
    palabra: "seguro",
    after: " para evitar sabotajes de infiltrados.",
    reemplazo: "protegido con cifrado AES-256 y MFA obligatoria",
    razon: "Es auditable mediante controles tecnicos concretos.",
  },
  {
    id: "r6",
    before: "El sistema de vigilancia debe funcionar de manera ",
    palabra: "eficiente",
    after: " durante todo el dia.",
    reemplazo: "consumiendo menos de 500W y procesando 30 fps minimo",
    razon: "Define consumo energetico y rendimiento medibles.",
  },
  {
    id: "r7",
    before: "La plataforma de logistica debe tener una interfaz ",
    palabra: "amigable",
    after: " para los soldados rasos.",
    reemplazo: "con indice SUS superior a 75 puntos en tests de usuario",
    razon: "Usa metrica estandar de usabilidad verificable.",
  },
  {
    id: "r8",
    before: "El tiempo de respaldo de datos debe ser ",
    palabra: "aceptable",
    after: " para no interrumpir operaciones.",
    reemplazo: "completado en menos de 4 horas en ventana nocturna",
    razon: "Establece limite temporal concreto y verificable.",
  },
];

export default function Isla5Wano({ onBackToMenu, onIslandCompleted, playClick }) {
  const [resolvedMap, setResolvedMap] = useState(() =>
    REQUIREMENTS.reduce((acc, req) => ({ ...acc, [req.id]: false }), {})
  );
  const [hoveredWordId, setHoveredWordId] = useState(null);
  const [slicedWordId, setSlicedWordId] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [feedback, setFeedback] = useState({ text: "Activa el Haki de Observacion y revisa el pergamino.", color: "#1d4ed8" });
  const [outcome, setOutcome] = useState(null);

  const solvedCount = useMemo(
    () => Object.values(resolvedMap).filter(Boolean).length,
    [resolvedMap]
  );

  const progress = Math.max(0, (timeLeft / TOTAL_TIME) * 100);

  const finishGame = useCallback((result) => {
    setOutcome((prev) => prev || result);
  }, []);

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
    if (!outcome && solvedCount >= REQUIREMENTS.length) {
      finishGame("success");
    }
  }, [finishGame, outcome, solvedCount]);

  const loseLife = useCallback(() => {
    setLives((prev) => {
      const next = Math.max(0, prev - 1);
      if (next <= 0) {
        finishGame("failure");
      }
      return next;
    });
  }, [finishGame]);

  const handleSlice = (requirement) => {
    if (outcome || resolvedMap[requirement.id]) return;

    setSlicedWordId(requirement.id);
    setResolvedMap((prev) => ({ ...prev, [requirement.id]: true }));
    setScore((prev) => prev + 20);
    setFeedback({
      text: `Tajo preciso: "${requirement.palabra}" ahora es verificable.`,
      color: "#15803d",
    });

    window.setTimeout(() => {
      setSlicedWordId((prev) => (prev === requirement.id ? null : prev));
    }, 280);
  };

  const handleWrongSlice = useCallback((requirement) => {
    if (outcome || resolvedMap[requirement.id]) return;

    loseLife();
    setFeedback({
      text: "Tajo errado: esa palabra no era ambigua.",
      color: "#b91c1c",
    });
  }, [loseLife, outcome, resolvedMap]);

  const tokenize = useCallback((text) => {
    return text.trim().split(/\s+/).filter(Boolean);
  }, []);

  const resetGame = () => {
    playClick();
    setResolvedMap(REQUIREMENTS.reduce((acc, req) => ({ ...acc, [req.id]: false }), {}));
    setHoveredWordId(null);
    setSlicedWordId(null);
    setScore(0);
    setLives(MAX_LIVES);
    setTimeLeft(TOTAL_TIME);
    setFeedback({ text: "Activa el Haki de Observacion y revisa el pergamino.", color: "#1d4ed8" });
    setOutcome(null);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-5xl rounded-3xl border-4 border-zinc-700/70 bg-gradient-to-b from-zinc-100 via-stone-100 to-amber-100 p-6 text-zinc-900 shadow-[0_18px_40px_rgba(0,0,0,0.35)] md:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-900">Isla 5: Pais de Wano - Onigashima</p>
          <h2 className="mt-2 text-3xl font-black uppercase">El Corte de la Precision (IEEE 830)</h2>
        </div>

        <button
          type="button"
          onClick={onBackToMenu}
          className="rounded-lg border border-amber-500/60 bg-amber-200/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-zinc-900 transition hover:bg-amber-200/40"
        >
          Volver al menú
        </button>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-zinc-500/60 bg-zinc-950 p-4 text-amber-100">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Dialogo de introduccion</p>
        <p className="mt-2 text-sm font-semibold text-amber-50/95">
          <span className="text-amber-300">Queen:</span> "Infiltrado, aqui tienes el plano del nuevo sistema de armamento de Onigashima. Kaido no tolera errores."
        </p>
        <p className="mt-1 text-sm font-semibold text-amber-50/95">
          <span className="text-amber-300">King:</span> "Activa tu Haki de Observacion. Detecta palabras debiles y cortalas. Convierte cada termino ambiguo en metrica verificable... o caeremos todos."
        </p>
      </div>

      <div className="mt-4 rounded-xl border-2 border-red-300/70 bg-red-50 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.15em] text-red-800">
          <span>Barra de Incursion</span>
          <span>{timeLeft}s</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-red-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-red-400 via-rose-500 to-zinc-900"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm font-black uppercase tracking-[0.08em]">
        <span className="rounded-lg bg-zinc-900 px-3 py-2 text-amber-100">Puntaje: {score}</span>
        <span className="rounded-lg bg-zinc-900 px-3 py-2 text-amber-100">Vidas: {lives}/{MAX_LIVES}</span>
        <span className="rounded-lg bg-zinc-900 px-3 py-2 text-amber-100">Corregidos: {solvedCount}/{REQUIREMENTS.length}</span>
        <span className="rounded-lg px-3 py-2 text-white" style={{ backgroundColor: feedback.color }}>
          {feedback.text}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border-4 border-amber-900/50 bg-[linear-gradient(135deg,#f5e6c8_0%,#ead2a2_55%,#d7b77d_100%)] p-5 shadow-inner">
        <p className="mb-4 text-center font-black uppercase tracking-[0.2em] text-amber-950">Pergamino de requisitos</p>

        <div className="space-y-4">
          {REQUIREMENTS.map((req) => {
            const solved = resolvedMap[req.id];
            const beforeTokens = tokenize(req.before);
            const afterTokens = tokenize(req.after);
            return (
              <div key={req.id} className="rounded-xl border border-amber-900/25 bg-amber-100/70 p-4 text-sm leading-relaxed text-amber-950">
                <p>
                  {beforeTokens.map((part, idx) => (
                    <span key={`${req.id}-before-${idx}`}>
                      <button
                        type="button"
                        onClick={() => handleWrongSlice(req)}
                        className="inline border-none bg-transparent p-0 text-inherit"
                      >
                        {part}
                      </button>{" "}
                    </span>
                  ))}
                  {!solved ? (
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredWordId(req.id)}
                      onMouseLeave={() => setHoveredWordId((prev) => (prev === req.id ? null : prev))}
                      onClick={() => handleSlice(req)}
                      className={`relative inline border-none bg-transparent p-0 text-inherit transition`}
                    >
                      {req.palabra}
                      {slicedWordId === req.id && (
                        <span className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-[-16deg] bg-red-600" />
                      )}
                    </button>
                  ) : (
                    <span className="font-black text-emerald-800">{req.reemplazo}</span>
                  )}
                  {afterTokens.length > 0 && " "}
                  {afterTokens.map((part, idx) => (
                    <span key={`${req.id}-after-${idx}`}>
                      <button
                        type="button"
                        onClick={() => handleWrongSlice(req)}
                        className="inline border-none bg-transparent p-0 text-inherit"
                      >
                        {part}
                      </button>
                      {idx < afterTokens.length - 1 && " "}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-xs font-semibold text-zinc-800/80">
                  {solved ? `Metrica aplicada: ${req.razon}` : "Inspeccion en curso."}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {outcome === "failure" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/80 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-red-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <img src={imageFail} alt="Derrota en Wano" className="w-full max-h-[60vh] object-contain" />
            <div className="space-y-4 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wide text-red-300">Derrota en Onigashima</h3>
              <p className="font-semibold text-amber-100/90">
                {lives <= 0
                  ? "Tus cortes fueron imprecisos y se agotaron tus vidas."
                  : "Se agotó el tiempo de infiltracion. Kaido detecto inconsistencias en el plano."}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-zinc-900 transition hover:brightness-105"
                >
                  Reintentar Isla 5
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
          className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/80 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-emerald-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <img src={imageSuccess} alt="Victoria en Wano" className="w-full max-h-[60vh] object-contain" />
            <div className="space-y-3 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wide text-emerald-300">¡Plano validado!</h3>
              <p className="font-semibold text-amber-100/90">
                Cortaste toda ambigüedad. Ahora los requisitos son no ambiguos, verificables y consistentes.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onIslandCompleted();
                  }}
                  className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-zinc-900 transition hover:brightness-105"
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
