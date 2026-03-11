import { useMemo, useState } from "react";
import { motion, Reorder } from "framer-motion";
import { AlertTriangle, ArrowDown, CheckCircle2, Compass, GripVertical, Heart, Map } from "lucide-react";
import imageFail from "../image/isla1Fallo.png";
import imageSuccess from "../image/isla1Acierto.png";

const CORRECT_ORDER = ["Obtencion", "Analisis", "Especificacion", "Validacion"];
const DISPLAY_LABELS = {
  Obtencion: "Obtención",
  Analisis: "Análisis",
  Especificacion: "Especificación",
  Validacion: "Validación",
};
const PHASE_DESCRIPTIONS = {
  Obtencion: "Recopilar necesidades del cliente",
  Analisis: "Estudiar viabilidad y conflictos",
  Especificacion: "Documentar requisitos formalmente",
  Validacion: "Confirmar que los requisitos son correctos",
};
const MAX_LIVES = 3;

function shuffle(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function getShuffledOrder() {
  let shuffled = shuffle(CORRECT_ORDER);
  while (shuffled.every((phase, index) => phase === CORRECT_ORDER[index])) {
    shuffled = shuffle(CORRECT_ORDER);
  }
  return shuffled;
}

export default function Isla1Loguetown({
  onIslandCompleted,
  playClick,
  playError,
  playSuccess,
}) {
  const initialCards = useMemo(() => getShuffledOrder(), []);
  const [cards, setCards] = useState(initialCards);
  const [lives, setLives] = useState(MAX_LIVES);
  const [result, setResult] = useState({ type: null, message: "" });
  const [outcome, setOutcome] = useState(null);

  // handle attempt to check current order
  const checkOrder = () => {
    if (outcome) return;

    playClick();

    const isCorrect = cards.every((card, index) => card === CORRECT_ORDER[index]);

    if (isCorrect) {
      playSuccess();
      setOutcome("success");
      setResult({
        type: "success",
        message: "¡Has ordenado los mapas correctamente! Rumbo a la Isla 2...",
      });
      return;
    }

    playError();

    const nextLives = lives - 1;
    setLives(nextLives);

    if (nextLives <= 0) {
      setOutcome("failure");
      setResult({
        type: "error",
        message:
          "¡Cuidado capitán! Hemos chocado contra un arrecife. Nos hemos quedado sin vidas en esta travesía.",
      });
      return;
    }

    setResult({
      type: "error",
      message:
        `¡Cuidado capitán! Hemos chocado contra un arrecife. Nos quedan ${nextLives} vidas.`,
    });
  };


  // reinitialize everything: shuffle cards and reset lives/outcome
  const resetIsland = () => {
    playClick();
    setCards(getShuffledOrder());
    setLives(MAX_LIVES);
    setOutcome(null);
    setResult({ type: null, message: "" });
  };

  // only shuffle cards without affecting lives or current outcome
  const shuffleCards = () => {
    playClick();
    setCards(getShuffledOrder());
  };

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col rounded-3xl border-4 border-amber-800/70 bg-gradient-to-b from-amber-50 via-amber-100 to-yellow-100 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-900/30 bg-amber-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
            <Compass className="h-4 w-4" />
            Isla 1: Loguetown
          </p>
          <h2 className="text-3xl font-black uppercase tracking-wide text-blue-950 md:text-4xl">
            Ordena los mapas
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-blue-900/80 md:text-base">
            Arrastra las tarjetas hacia arriba o abajo para ordenar las fases del ciclo de vida de
            requisitos.
          </p>
        </div>

      </div>

      <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border-2 border-amber-300/80 bg-amber-100 px-4 py-2 text-blue-950">
        <span className="text-sm font-bold uppercase tracking-[0.15em]">Vidas:</span>
        {Array.from({ length: MAX_LIVES }).map((_, index) => (
          <Heart
            key={`life-${index + 1}`}
            className={`h-5 w-5 ${index < lives ? "fill-red-500 text-red-600" : "text-slate-400"}`}
          />
        ))}
      </div>

      {/* ── Canvas de reordenamiento ── */}
      <div className="relative rounded-2xl border-2 border-amber-900/30 bg-blue-950/90 p-3 md:p-4">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">
          ↕ Arrastra para reordenar de primera a última fase
        </p>

        <div className="max-h-[44vh] overflow-y-auto pr-1 sm:max-h-[48vh] md:max-h-[52vh]">
          <Reorder.Group
            axis="y"
            values={cards}
            onReorder={setCards}
            className="flex flex-col gap-3 px-5 overflow-hidden"
          >
            {cards.map((phase, index) => (
              <Reorder.Item
                key={phase}
                value={phase}
                whileDrag={{
                  scale: 1.03,
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.45)",
                  cursor: "grabbing",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative cursor-grab select-none rounded-xl border-2 border-amber-700/80 bg-gradient-to-r from-amber-100 to-yellow-50 p-4 active:cursor-grabbing"
              >
                <div className="flex items-center gap-4">
                  {/* Grip handle */}
                  <div className="flex flex-col items-center gap-0.5 text-amber-800/60">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Position badge */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-950 text-sm font-black text-amber-100">
                    {index + 1}
                  </span>

                  {/* Phase info */}
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Map className="h-5 w-5 shrink-0 text-amber-900" />
                    <div className="min-w-0">
                      <p className="truncate text-lg font-extrabold leading-tight text-blue-950">
                        {DISPLAY_LABELS[phase]}
                      </p>
                      <p className="truncate text-xs font-medium text-blue-900/60">
                        {PHASE_DESCRIPTIONS[phase]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow between items (except the last) */}
                {index < cards.length - 1 && (
                  <div className="pointer-events-none absolute -bottom-3 left-1/2 z-10 -translate-x-1/2">
                    <ArrowDown className="h-4 w-4 text-amber-400/70" />
                  </div>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {/* ── Botones ── */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={checkOrder}
            disabled={Boolean(outcome)}
            className="w-full rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 px-8 py-4 text-xl font-black uppercase tracking-[0.1em] text-blue-950 shadow-[0_10px_20px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:brightness-105 sm:w-auto"
          >
            ¡Zarpar!
          </button>

          <button
            type="button"
            onClick={shuffleCards}
            disabled={Boolean(outcome)}
            className="rounded-xl border-2 border-amber-300 bg-transparent px-4 py-2 text-sm font-bold uppercase tracking-wide text-amber-100 transition hover:bg-amber-200/10"
          >
            Barajar de nuevo
          </button>
        </div>

        {/* ── Feedback ── */}
        {result.type === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-start gap-3 rounded-xl border-2 border-emerald-300/60 bg-emerald-500/20 p-4"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
            <p className="font-semibold text-emerald-50">{result.message}</p>
          </motion.div>
        )}

        {result.type === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-start gap-3 rounded-xl border-2 border-red-300/60 bg-red-500/20 p-4"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-200" />
            <p className="font-semibold text-red-50">{result.message}</p>
          </motion.div>
        )}

        {outcome === "failure" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/75 p-4"
          >
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-red-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
              <img src={imageFail} alt="Barco chocando contra arrecifes" className="w-full max-h-[60vh] object-contain" />
              <div className="space-y-4 p-5">
                <h3 className="text-2xl font-black uppercase tracking-wide text-red-300">Derrota en Loguetown</h3>
                <p className="font-semibold text-amber-100/90">
                  Te has quedado sin vidas. Reorganiza la estrategia y vuelve a intentarlo.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetIsland}
                    className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-blue-950 transition hover:brightness-105"
                  >
                    Reintentar Isla 1
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
              <img src={imageSuccess} alt="Barco navegando con éxito" className="w-full max-h-[60vh] object-contain" />
              <div className="space-y-3 p-5">
                <h3 className="text-2xl font-black uppercase tracking-wide text-emerald-300">¡Isla 1 completada!</h3>
                <p className="font-semibold text-amber-100/90">
                  Has desbloqueado la Isla 2. Pulsa para ir al inicio y elegir la siguiente isla.
                </p>
                <div className="mt-4 flex justify-end">
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
      </div>
    </section>
  );
}
