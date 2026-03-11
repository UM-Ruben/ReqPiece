import { motion } from "framer-motion";
import { AlertTriangle, Cpu, Link as LinkIcon, ShieldAlert, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import imageFail from "../image/isla6VegapunkFallo.png";
import imageSuccess from "../image/isla6VegapunkAcierto.png";

const nodosDerecha = [
  { id: "art-1", nombre: "Componente ShoppingCart.jsx", afectadoPorReq4: true },
  { id: "art-2", nombre: "Test de Integracion Auth", afectadoPorReq4: false },
  { id: "art-3", nombre: "Tabla DB: Transacciones", afectadoPorReq4: true },
  { id: "art-4", nombre: "Modulo de Perfil de Usuario", afectadoPorReq4: false },
  { id: "art-5", nombre: "API: Checkout & Gateway", afectadoPorReq4: true },
];

const totalAfectados = 3;
const MAX_ERRORES = 3;

export default function Isla6EggHead({ onIslandCompleted, onBackToMenu, playClick, playError, playSuccess }) {
  const [selectedReq, setSelectedReq] = useState(false);
  const [trazados, setTrazados] = useState([]);
  const [errores, setErrores] = useState(0);
  const [shakeId, setShakeId] = useState(null);
  const [wrongFlashId, setWrongFlashId] = useState(null);

  const completado = trazados.length === totalAfectados;
  const gameOver = errores >= MAX_ERRORES;

  const progreso = useMemo(() => {
    return Math.round((trazados.length / totalAfectados) * 100);
  }, [trazados.length]);

  const activarReq4 = () => {
    if (completado || gameOver) return;
    playClick();
    setSelectedReq(true);
  };

  const reiniciar = () => {
    playClick();
    setSelectedReq(false);
    setTrazados([]);
    setErrores(0);
    setShakeId(null);
    setWrongFlashId(null);
  };

  const handleNodoDerecha = (nodo) => {
    if (completado || gameOver) return;

    if (!selectedReq) {
      playError();
      return;
    }

    if (trazados.includes(nodo.id)) {
      return;
    }

    if (nodo.afectadoPorReq4) {
      playClick();
      const siguiente = [...trazados, nodo.id];
      setTrazados(siguiente);

      if (siguiente.length === totalAfectados) {
        playSuccess();
      }
      return;
    }

    playError();
    setErrores((prev) => prev + 1);
    setShakeId(nodo.id);
    setWrongFlashId(nodo.id);

    window.setTimeout(() => {
      setShakeId((prev) => (prev === nodo.id ? null : prev));
      setWrongFlashId((prev) => (prev === nodo.id ? null : prev));
    }, 450);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 text-cyan-300 shadow-[0_18px_40px_rgba(0,0,0,0.5)] md:p-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(34,211,238,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.13)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute -left-20 -top-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-300">Isla 6: EggHead</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-cyan-100 md:text-4xl">
              Trazabilidad Cuantica
            </h2>
          </div>
          <button
            type="button"
            onClick={onBackToMenu}
            className="rounded-lg border border-cyan-500/60 bg-slate-900/70 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-200 transition hover:bg-cyan-500/10"
          >
            Volver al menu
          </button>
        </div>

        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.15, repeat: Infinity }}
          className="mt-5 flex items-start gap-3 rounded-xl border border-fuchsia-500 bg-fuchsia-900/40 p-4 text-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.5)]"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-bold uppercase tracking-[0.08em]">
            ¡ALERTA DEL STELLA! El Cliente Corporativo ha modificado el REQ-04: Anadir pasarela de pago.
          </p>
        </motion.div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.1em]">
          <span className="rounded-lg border border-cyan-700/70 bg-cyan-900/20 px-3 py-2 text-cyan-200">
            Trazados: {trazados.length}/{totalAfectados}
          </span>
          <span className="rounded-lg border border-fuchsia-700/70 bg-fuchsia-900/20 px-3 py-2 text-fuchsia-200">
            Sincronizacion: {progreso}%
          </span>
          <span className="rounded-lg border border-red-600/70 bg-red-950/40 px-3 py-2 text-red-200">
            Strikes: {errores}/{MAX_ERRORES}
          </span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-cyan-800/50 bg-slate-900/70 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Nodos de requisitos base</p>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                disabled
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm font-bold text-slate-400"
              >
                REQ-01: Login de usuarios
              </button>
              <button
                type="button"
                disabled
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm font-bold text-slate-400"
              >
                REQ-02: Gestion de catalogo
              </button>

              <motion.button
                type="button"
                onClick={activarReq4}
                whileTap={{ scale: 0.98 }}
                animate={selectedReq ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
                transition={selectedReq ? { duration: 0.95, repeat: Infinity } : { duration: 0.2 }}
                className={`w-full rounded-xl border px-4 py-4 text-left text-sm font-black uppercase tracking-[0.06em] transition ${
                  selectedReq
                    ? "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.35)]"
                    : "border-cyan-600/70 bg-slate-800 text-cyan-200 hover:bg-cyan-500/10"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  REQ-04 (Modificado): Anadir pasarela de pago
                </span>
              </motion.button>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-800/50 bg-slate-900/70 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Artefactos de software</p>
            <div className="mt-4 grid gap-3">
              {nodosDerecha.map((nodo) => {
                const isTrazado = trazados.includes(nodo.id);
                const isWrong = wrongFlashId === nodo.id;

                return (
                  <motion.button
                    key={nodo.id}
                    type="button"
                    disabled={isTrazado || completado || gameOver}
                    onClick={() => handleNodoDerecha(nodo)}
                    whileTap={{ scale: 0.98 }}
                    animate={
                      shakeId === nodo.id
                        ? { x: [-10, 10, -10, 10, 0] }
                        : isTrazado
                          ? { scale: [1, 1.06, 1] }
                          : { scale: 1 }
                    }
                    transition={{ duration: 0.35 }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                      isTrazado
                        ? "border-fuchsia-300 bg-fuchsia-600 text-white shadow-[0_0_10px_#c026d3]"
                        : isWrong
                          ? "border-red-300 bg-red-600/30 text-red-100"
                          : "border-cyan-700/70 bg-slate-800 text-cyan-100 hover:bg-cyan-500/10"
                    } ${isTrazado ? "cursor-default" : ""}`}
                  >
                    <span>{nodo.nombre}</span>
                    {isTrazado ? (
                      <span className="inline-flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        <Cpu className="h-4 w-4" />
                      </span>
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-cyan-400/70" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {!selectedReq && !completado && !gameOver && (
          <p className="mt-5 rounded-lg border border-cyan-600/60 bg-cyan-900/20 px-4 py-3 text-sm font-bold text-cyan-200">
            Activa primero el REQ-04 para establecer la Linea de Trazabilidad Cuantica.
          </p>
        )}

        {completado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-4"
          >
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-emerald-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
              <img src={imageSuccess} alt="Victoria en EggHead" className="w-full max-h-[60vh] object-contain" />
              <div className="space-y-3 p-5">
                <h3 className="text-2xl font-black uppercase tracking-wide text-emerald-300">¡Sincronizacion completa!</h3>
                <p className="font-semibold text-amber-100/90">
                  Todos los nodos afectados fueron enlazados y el laboratorio quedo estabilizado.
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

        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-4"
          >
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-red-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
              <img src={imageFail} alt="Derrota en EggHead" className="w-full max-h-[60vh] object-contain" />
              <div className="space-y-4 p-5">
                <h3 className="text-2xl font-black uppercase tracking-wide text-red-300">Game Over en EggHead</h3>
                <p className="font-semibold text-amber-100/90">
                  Seguridad comprometida: acumulaste 3 strikes. El laboratorio reiniciara los sistemas.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-blue-950 transition hover:brightness-105"
                  >
                    Reintentar Isla 6
                  </button>
                  <button
                    type="button"
                    onClick={onBackToMenu}
                    className="rounded-xl border-2 border-red-300 bg-red-500/20 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-red-100 transition hover:bg-red-500/30"
                  >
                    Salir al menu
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
