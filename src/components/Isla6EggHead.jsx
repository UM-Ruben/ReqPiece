import { motion } from "framer-motion";
import { AlertTriangle, Cpu, Database, Link as LinkIcon, ShieldAlert, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import imageFail from "../image/isla6VegapunkFallo.png";
import imageSuccess from "../image/isla6VegapunkAcierto.png";

const requirements = [
  {
    id: "req-01",
    code: "REQ-01",
    name: "Login de usuarios",
    status: "estable",
    brief: "Los usuarios deben autenticarse y el sistema debe registrar correctamente los accesos.",
    affectedArtifacts: ["art-2", "art-4"],
  },
  {
    id: "req-02",
    code: "REQ-02",
    name: "Gestion de catalogo",
    status: "estable",
    brief: "El catalogo debe poder consultarse y mantenerse desde la capa funcional del sistema.",
    affectedArtifacts: ["art-4", "art-5"],
  },
  {
    id: "req-03",
    code: "REQ-03",
    name: "Checkout seguro",
    status: "estable",
    brief: "La compra debe validarse, persistirse y ejecutarse de forma segura de extremo a extremo.",
    affectedArtifacts: ["art-1", "art-3", "art-5"],
  },
  {
    id: "req-04",
    code: "REQ-04",
    name: "Anadir pasarela de pago",
    status: "modificado",
    brief: "Se incorpora pago externo, por lo que hay que localizar que partes del sistema cambian realmente.",
    affectedArtifacts: ["art-1", "art-3", "art-5"],
  },
];

const artifacts = [
  {
    id: "art-1",
    name: "Componente ShoppingCart.jsx",
    description: "Gestiona carrito, resumen del pedido y arranque del flujo de compra.",
  },
  {
    id: "art-2",
    name: "Test de Integracion Auth",
    description: "Valida autenticacion, sesiones y permisos de acceso.",
  },
  {
    id: "art-3",
    name: "Tabla DB: Transacciones",
    description: "Persiste cobros, estados de pago y evidencias de operacion.",
  },
  {
    id: "art-4",
    name: "Modulo de Perfil de Usuario",
    description: "Centraliza datos de cuenta, preferencias y datos visibles del usuario.",
  },
  {
    id: "art-5",
    name: "API: Checkout & Gateway",
    description: "Orquesta checkout, comunicacion con servicios externos y confirmacion final.",
  },
];

const MAX_ERRORS = 3;
const TOTAL_REQUIRED_LINKS = requirements.reduce((acc, req) => acc + req.affectedArtifacts.length, 0);

function createEmptyLinks() {
  return requirements.reduce((acc, req) => ({ ...acc, [req.id]: [] }), {});
}

export default function Isla6EggHead({ onIslandCompleted, onBackToMenu, playClick, playError, playSuccess }) {
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [linksByReq, setLinksByReq] = useState(createEmptyLinks);
  const [errors, setErrors] = useState(0);
  const [shakeId, setShakeId] = useState(null);
  const [wrongFlashId, setWrongFlashId] = useState(null);
  const [feedback, setFeedback] = useState("Selecciona un requisito y enlaza sus artefactos como en una matriz DOORS.");

  const linkedCount = useMemo(
    () => Object.values(linksByReq).reduce((acc, links) => acc + links.length, 0),
    [linksByReq]
  );

  const progress = useMemo(() => Math.round((linkedCount / TOTAL_REQUIRED_LINKS) * 100), [linkedCount]);

  const selectedRequirement = useMemo(
    () => requirements.find((req) => req.id === selectedReqId) ?? null,
    [selectedReqId]
  );

  const completedRequirements = useMemo(
    () => requirements.filter((req) => linksByReq[req.id].length === req.affectedArtifacts.length).length,
    [linksByReq]
  );

  const completed = linkedCount === TOTAL_REQUIRED_LINKS;
  const gameOver = errors >= MAX_ERRORS;

  const isLinked = (reqId, artifactId) => linksByReq[reqId].includes(artifactId);

  const resetGame = () => {
    playClick();
    setSelectedReqId(null);
    setLinksByReq(createEmptyLinks());
    setErrors(0);
    setShakeId(null);
    setWrongFlashId(null);
    setFeedback("Selecciona un requisito y enlaza sus artefactos como en una matriz DOORS.");
  };

  const selectRequirement = (req) => {
    if (completed || gameOver) return;
    playClick();
    setSelectedReqId(req.id);
    setFeedback(`${req.code} activo: analiza su descripcion y deduce que artefactos deben actualizarse.`);
  };

  const registerError = (artifactId, message) => {
    playError();
    setErrors((prev) => prev + 1);
    setShakeId(artifactId);
    setWrongFlashId(artifactId);
    setFeedback(message);

    window.setTimeout(() => {
      setShakeId((prev) => (prev === artifactId ? null : prev));
      setWrongFlashId((prev) => (prev === artifactId ? null : prev));
    }, 420);
  };

  const clickArtifact = (artifact) => {
    if (completed || gameOver) return;

    if (!selectedRequirement) {
      registerError(artifact.id, "Activa un requisito primero para crear una traza valida.");
      return;
    }

    if (isLinked(selectedRequirement.id, artifact.id)) {
      setFeedback("Este enlace ya estaba registrado en la matriz.");
      return;
    }

    const isExpected = selectedRequirement.affectedArtifacts.includes(artifact.id);

    if (!isExpected) {
      registerError(
        artifact.id,
        `Enlace invalido: ${artifact.name} no esta impactado por ${selectedRequirement.code}.`
      );
      return;
    }

    playClick();
    setLinksByReq((prev) => {
      const next = {
        ...prev,
        [selectedRequirement.id]: [...prev[selectedRequirement.id], artifact.id],
      };

      const totalAfter = Object.values(next).reduce((acc, links) => acc + links.length, 0);
      if (totalAfter === TOTAL_REQUIRED_LINKS) {
        playSuccess();
      }

      return next;
    });

    setFeedback(`Traza creada: ${selectedRequirement.code} -> ${artifact.name}`);
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
              DOORS Arcade - Trazabilidad Cuantica
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
            Modo laboratorio DOORS: inspecciona un requisito, razona el impacto y registra solo las trazas que tengan sentido.
          </p>
        </motion.div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.1em]">
          <span className="rounded-lg border border-cyan-700/70 bg-cyan-900/20 px-3 py-2 text-cyan-200">
            Trazas creadas: {linkedCount}
          </span>
          <span className="rounded-lg border border-fuchsia-700/70 bg-fuchsia-900/20 px-3 py-2 text-fuchsia-200">
            Requisitos completos: {completedRequirements}/{requirements.length}
          </span>
          <span className="rounded-lg border border-red-600/70 bg-red-950/40 px-3 py-2 text-red-200">
            Strikes: {errors}/{MAX_ERRORS}
          </span>
        </div>

        <p className="mt-4 rounded-lg border border-cyan-600/60 bg-cyan-900/20 px-4 py-3 text-sm font-bold text-cyan-200">
          {feedback}
        </p>

        {selectedRequirement && !completed && !gameOver && (
          <div className="mt-4 rounded-2xl border border-fuchsia-500/50 bg-slate-900/80 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-300">Expediente activo</p>
            <h3 className="mt-2 text-lg font-black uppercase text-cyan-100">
              {selectedRequirement.code}: {selectedRequirement.name}
            </h3>
            <p className="mt-2 text-sm font-semibold text-cyan-100/85">{selectedRequirement.brief}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-amber-200/90">
              Piensa como en DOORS: si este requisito cambia, que artefactos deberian revisarse o actualizarse.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-cyan-800/50 bg-slate-900/70 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Requisitos del baseline</p>
            <div className="mt-4 space-y-3">
              {requirements.map((req) => {
                const isSelected = selectedReqId === req.id;
                const linkedForReq = linksByReq[req.id].length;
                const reqDone = linkedForReq === req.affectedArtifacts.length;
                const reqStatusLabel = reqDone
                  ? "Trazado completo"
                  : linkedForReq > 0
                    ? "En revision"
                    : "Sin revisar";

                return (
                  <button
                    key={req.id}
                    type="button"
                    disabled={completed || gameOver}
                    onClick={() => selectRequirement(req)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                      isSelected
                        ? "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.35)]"
                        : req.status === "modificado"
                          ? "border-cyan-600/70 bg-slate-800 text-cyan-200 hover:bg-cyan-500/10"
                          : "border-slate-600/70 bg-slate-800/90 text-slate-200 hover:bg-slate-700/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        {req.code}: {req.name}
                      </span>
                      <span
                        className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
                          req.status === "modificado"
                            ? "bg-fuchsia-500/25 text-fuchsia-100"
                            : "bg-cyan-500/20 text-cyan-100"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-cyan-100/80">
                      {reqStatusLabel}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-800/50 bg-slate-900/70 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Artefactos de software</p>
            <div className="mt-4 grid gap-3">
              {artifacts.map((artifact) => {
                const linkedForSelected = selectedRequirement ? isLinked(selectedRequirement.id, artifact.id) : false;
                const isWrong = wrongFlashId === artifact.id;

                return (
                  <motion.button
                    key={artifact.id}
                    type="button"
                    disabled={completed || gameOver}
                    onClick={() => clickArtifact(artifact)}
                    whileTap={{ scale: 0.98 }}
                    animate={
                      shakeId === artifact.id
                        ? { x: [-10, 10, -10, 10, 0] }
                        : linkedForSelected
                          ? { scale: [1, 1.04, 1] }
                          : { scale: 1 }
                    }
                    transition={{ duration: 0.35 }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                      linkedForSelected
                        ? "border-fuchsia-300 bg-fuchsia-600 text-white shadow-[0_0_10px_#c026d3]"
                        : isWrong
                          ? "border-red-300 bg-red-600/30 text-red-100"
                          : "border-cyan-700/70 bg-slate-800 text-cyan-100 hover:bg-cyan-500/10"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate">{artifact.name}</p>
                      <p className="mt-1 text-xs font-semibold text-cyan-100/70">{artifact.description}</p>
                    </div>
                    {linkedForSelected ? (
                      <span className="inline-flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        <Cpu className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-cyan-400/70">
                        <Database className="h-4 w-4" />
                        <ShieldAlert className="h-4 w-4" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-auto rounded-2xl border border-cyan-700/60 bg-slate-900/80 p-4">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Matriz de trazabilidad (estilo DOORS)</p>
          <table className="min-w-full border-separate border-spacing-2 text-xs">
            <thead>
              <tr>
                <th className="rounded bg-slate-800 px-2 py-2 text-left text-cyan-200">Requisito</th>
                {artifacts.map((artifact) => (
                  <th key={artifact.id} className="rounded bg-slate-800 px-2 py-2 text-cyan-200">
                    {artifact.id.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={`row-${req.id}`}>
                  <td className="rounded bg-slate-800 px-2 py-2 font-black text-cyan-100">{req.code}</td>
                  {artifacts.map((artifact) => {
                    const linked = isLinked(req.id, artifact.id);
                    return (
                      <td
                        key={`${req.id}-${artifact.id}`}
                        className={`rounded border px-2 py-2 text-center font-black ${
                          linked
                            ? "border-emerald-400 bg-emerald-500/30 text-emerald-100"
                            : "border-slate-700 bg-slate-900/60 text-slate-500"
                        }`}
                      >
                        {linked ? "OK" : "..."}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-4"
          >
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-emerald-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
              <img src={imageSuccess} alt="Victoria en EggHead" className="w-full max-h-[60vh] object-contain" />
              <div className="space-y-3 p-5">
                <h3 className="text-2xl font-black uppercase tracking-wide text-emerald-300">Matriz completada</h3>
                <p className="font-semibold text-amber-100/90">
                  Trazaste todos los impactos como un pro de DOORS. El laboratorio quedo estabilizado.
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
                  Acumulaste 3 strikes por enlaces invalidos. Reinicia la matriz y vuelve a intentarlo.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetGame}
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
