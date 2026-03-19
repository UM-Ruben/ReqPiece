import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import imageFail from "../image/isla5KaidoFallo.webp";
import imageSuccess from "../image/isla5KaidoAcierto.webp";
import { apiFetch } from "../lib/api";

const TOTAL_TIME = 45;

async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("La API no esta disponible. Inicia tambien el servidor backend (npm run start:api).");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || "No se pudo conectar con el servidor del minijuego.");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Respuesta invalida del servidor del minijuego.");
  }

  return payload;
}

function tokenize(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean);
}

export default function Isla5Wano({ onBackToMenu, onIslandCompleted, playClick, playError, playSuccess }) {
  const [requirements, setRequirements] = useState([]);
  const [resolvedMap, setResolvedMap] = useState({});
  const [resolvedDetails, setResolvedDetails] = useState({});
  const [hoveredWordId, setHoveredWordId] = useState(null);
  const [slicedWordId, setSlicedWordId] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [maxLives, setMaxLives] = useState(2);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [totalTime, setTotalTime] = useState(TOTAL_TIME);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalRequirements, setTotalRequirements] = useState(0);
  const [feedback, setFeedback] = useState({ text: "Activa el Haki de Observacion y revisa el pergamino.", color: "#1d4ed8" });
  const [status, setStatus] = useState("in_progress");
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState("");

  const outcome = status === "victory" ? "success" : status === "failure" ? "failure" : null;

  const progress = useMemo(() => {
    if (totalTime <= 0) return 0;
    return Math.max(0, (timeLeft / totalTime) * 100);
  }, [timeLeft, totalTime]);

  const applyPayload = useCallback((data) => {
    setStatus(data.status || "in_progress");
    setScore(data.score || 0);
    setLives(data.lives || 0);
    setMaxLives(data.maxLives || 2);
    setResolvedMap(data.resolvedMap || {});
    setResolvedDetails(data.resolvedDetails || {});
    setRequirements(data.requirements || []);
    setTotalTime(data.totalTime || TOTAL_TIME);
    setSolvedCount(data.solvedCount || 0);
    setTotalRequirements(data.totalRequirements || 0);

    if (typeof data.feedback === "string" && data.feedback.length > 0) {
      setFeedback((prev) => ({ ...prev, text: data.feedback }));
    }

    if (data.action === "success") {
      setFeedback({ text: data.feedback || "Tajo preciso.", color: "#15803d" });
      setSlicedWordId(data.actionRequirementId || null);
      playSuccess?.();
      window.setTimeout(() => {
        setSlicedWordId((prev) => (prev === data.actionRequirementId ? null : prev));
      }, 280);
    } else if (data.action === "error") {
      setFeedback({ text: data.feedback || "Tajo errado.", color: "#b91c1c" });
      playError?.();
    }
  }, [playError, playSuccess]);

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setRequestError("");
    try {
      const response = await apiFetch("/api/wano/start", { method: "POST" });
      const data = await parseApiResponse(response);
      applyPayload(data);
      setTimeLeft(data.totalTime || TOTAL_TIME);
      setHoveredWordId(null);
      setSlicedWordId(null);
      setFeedback({
        text: data.feedback || "Activa el Haki de Observacion y revisa el pergamino.",
        color: "#1d4ed8",
      });
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [applyPayload]);

  useEffect(() => {
    void startGame();
  }, [startGame]);

  useEffect(() => {
    if (outcome || isLoading) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setStatus("failure");
          void apiFetch("/api/wano/finalize", { method: "POST" }).catch(() => {
            // ignore network finalize errors; local status is already failure
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isLoading, outcome]);

  useEffect(() => {
    if (!outcome) return;
    if (outcome === "success") {
      playSuccess?.();
    } else {
      playError?.();
    }
  }, [outcome, playError, playSuccess]);

  const handleSlice = async (requirement, token) => {
    if (outcome || isLoading || resolvedMap[requirement.id]) return;

    playClick?.();
    setRequestError("");
    try {
      const response = await apiFetch("/api/wano/cut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirementId: requirement.id, token }),
      });
      const data = await parseApiResponse(response);
      applyPayload(data);
    } catch (error) {
      setRequestError(error.message);
    }
  };

  const resetGame = () => {
    playClick();
    void startGame();
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

      {requestError && (
        <p className="mt-3 rounded-lg border border-red-500/70 bg-red-900/30 px-4 py-2 text-sm font-bold text-red-100">
          {requestError}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-3 text-sm font-black uppercase tracking-[0.08em]">
        <span className="rounded-lg bg-zinc-900 px-3 py-2 text-amber-100">Puntaje: {score}</span>
        <span className="rounded-lg bg-zinc-900 px-3 py-2 text-amber-100">Vidas: {lives}/{maxLives}</span>
        <span className="rounded-lg bg-zinc-900 px-3 py-2 text-amber-100">Corregidos: {solvedCount}/{totalRequirements}</span>
        <span className="rounded-lg px-3 py-2 text-white" style={{ backgroundColor: feedback.color }}>
          {feedback.text}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border-4 border-amber-900/50 bg-[linear-gradient(135deg,#f5e6c8_0%,#ead2a2_55%,#d7b77d_100%)] p-5 shadow-inner">
        <p className="mb-4 text-center font-black uppercase tracking-[0.2em] text-amber-950">Pergamino de requisitos</p>

        <div className="space-y-4">
          {requirements.map((req) => {
            const solved = Boolean(resolvedMap[req.id]);
            const tokens = tokenize(req.text);
            const detail = resolvedDetails[req.id] || null;

            return (
              <div key={req.id} className="rounded-xl border border-amber-900/25 bg-amber-100/70 p-4 text-sm leading-relaxed text-amber-950">
                <p>
                  {solved ? (
                    req.text
                  ) : (
                    tokens.map((part, idx) => (
                      <span key={`${req.id}-${idx}`}>
                        <button
                          type="button"
                          onMouseEnter={() => setHoveredWordId(req.id)}
                          onMouseLeave={() => setHoveredWordId((prev) => (prev === req.id ? null : prev))}
                          onClick={() => handleSlice(req, part)}
                          className="relative inline border-none bg-transparent p-0 text-inherit"
                        >
                          {part}
                          {slicedWordId === req.id && hoveredWordId === req.id && (
                            <span className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-[-16deg] bg-red-600" />
                          )}
                        </button>{" "}
                      </span>
                    ))
                  )}
                </p>
                <p className="mt-2 text-xs font-semibold text-zinc-800/80">
                  {solved && detail
                    ? `Reemplazo aplicado: ${detail.replacement}. Motivo: ${detail.reason}`
                    : "Inspeccion en curso."}
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
