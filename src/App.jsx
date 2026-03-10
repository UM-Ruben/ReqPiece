import { useState } from "react";
import { motion } from "framer-motion";
import { Anchor, Compass, Lock, Skull, Unlock } from "lucide-react";
import Isla1Loguetown from "./components/Isla1Loguetown";
import Isla2Water7 from "./components/Isla2Water7";
import Isla3EniesLobby from "./components/Isla3EniesLobby";
import Isla4Sabaody from "./components/Isla4Sabaody";
import Isla5ImpelDown from "./components/Isla5ImpelDown";
import Isla6LaughTale from "./components/Isla6LaughTale";
import { usePirateAudio } from "./hooks/usePirateAudio";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [unlockedIslands, setUnlockedIslands] = useState({
    isla1: true,
    isla2: false,
    isla3: false,
    isla4: false,
    isla5: false,
    isla6: false,
  });
  const { playClick, playError, playSuccess } = usePirateAudio();

  const goToIsla1 = () => {
    playClick();
    setCurrentScreen("isla1");
  };

  const backToMenu = () => {
    playClick();
    setCurrentScreen("menu");
  };

  const completeIsland1 = () => {
    setUnlockedIslands((prev) => ({
      ...prev,
      isla2: true,
    }));
    // en lugar de volver al menú, entramos de inmediato en la isla 2
    setCurrentScreen("isla2");
  };

  const goToIsla2 = () => {
    playClick();
    if (!unlockedIslands.isla2) return;
    setCurrentScreen("isla2");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-950 via-sky-900 to-blue-800 text-amber-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.25),transparent_35%),radial-gradient(circle_at_80%_5%,rgba(14,116,144,0.4),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(120,53,15,0.3),transparent_45%)]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
        <header className="mb-8 rounded-2xl border-4 border-amber-700/80 bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-950 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.4)] md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                En busca del One Spec
              </p>
              <h1 className="text-3xl font-black uppercase tracking-wider text-amber-100 md:text-5xl">
                ReqPiece
              </h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-300/40 bg-amber-100/10 px-3 py-2 text-sm font-bold text-amber-100">
              <Anchor className="h-4 w-4" />
              Ingenieria de Requisitos
            </div>
          </div>
        </header>

        {currentScreen === "menu" && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto w-full max-w-4xl rounded-3xl border-4 border-blue-900/60 bg-gradient-to-b from-amber-50 via-amber-100 to-yellow-100 p-6 text-blue-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)] md:p-10"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-900/20 bg-yellow-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-900">
              <Skull className="h-4 w-4" />
              Taberna de inicio
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase tracking-wide md:text-4xl">
              Elige tu primera travesia
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-semibold text-blue-900/80 md:text-base">
              El Rey de los Analistas, Gold Roger, antes de retirarse dejó el mayor tesoro de la Ingeniería de Software escondido en la última isla del Grand Line: El "One Spec" (El Documento de Especificación de Requisitos Perfecto).<br/>Tú eres un joven capitán pirata que aspira a ser el Rey de los Analistas. Para lograrlo, debes construir el barco definitivo (el sistema de software) y reclutar a una tripulación. Deberás navegar por 6 islas diferentes. En cada isla te enfrentarás a un minijuego que pondrá a prueba tus conocimientos teóricos de GPDS (Ingeniería de Requisitos).
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border-2 border-amber-700 bg-gradient-to-r from-blue-950 to-blue-900 p-5 text-amber-50 shadow-[0_10px_20px_rgba(0,0,0,0.25)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                  Isla disponible
                </p>
                <h3 className="mt-2 text-2xl font-black">Loguetown</h3>
                <p className="mt-2 text-sm font-medium text-amber-100/85">
                  Ordena los mapas de fases para trazar una ruta solida antes de lanzar el proyecto.
                </p>
                <button
                  type="button"
                  onClick={goToIsla1}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-base font-black uppercase tracking-[0.12em] text-blue-950 transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <Compass className="h-5 w-5" />
                  Ir a Isla 1
                </button>
              </article>

              <article
                className={`rounded-2xl border-2 p-5 shadow-[0_10px_20px_rgba(0,0,0,0.15)] ${
                  unlockedIslands.isla2
                    ? "border-amber-700 bg-gradient-to-r from-blue-950 to-blue-900 text-amber-50"
                    : "border-amber-700/40 bg-amber-50/70 text-blue-950"
                }`}
              >
                <p
                  className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${
                    unlockedIslands.isla2 ? "text-amber-300" : "text-blue-800/80"
                  }`}
                >
                  {unlockedIslands.isla2 ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {unlockedIslands.isla2 ? "Desbloqueada" : "Bloqueada"}
                </p>
                <h3 className="mt-2 text-2xl font-black">Isla 2</h3>
                <p className={`mt-2 text-sm font-semibold ${unlockedIslands.isla2 ? "text-amber-100/85" : "text-blue-900/70"}`}>
                  {unlockedIslands.isla2
                    ? "La nueva travesía está lista para desarrollarse."
                    : "Completa la Isla 1 para desbloquear esta misión."}
                </p>
                <button
                  type="button"
                  onClick={goToIsla2}
                  disabled={!unlockedIslands.isla2}
                  className={`mt-5 inline-flex items-center gap-2 rounded-xl border-2 px-5 py-3 text-base font-black uppercase tracking-[0.12em] transition ${
                    unlockedIslands.isla2
                      ? "border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 text-blue-950 hover:-translate-y-0.5 hover:brightness-105"
                      : "cursor-not-allowed border-slate-300/70 bg-slate-300/60 text-slate-600"
                  }`}
                >
                  <Compass className="h-5 w-5" />
                  {unlockedIslands.isla2 ? "Ir a Isla 2" : "Isla 2 bloqueada"}
                </button>
              </article>
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.17em] text-blue-900/70">
              Progreso actual: {unlockedIslands.isla2 ? "2/6 islas desbloqueadas" : "1/6 islas desbloqueadas"}
            </p>
          </motion.section>
        )}

        {currentScreen === "isla1" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Isla1Loguetown
              onBackToMenu={backToMenu}
              onIslandCompleted={completeIsland1}
              playClick={playClick}
              playError={playError}
              playSuccess={playSuccess}
            />
          </motion.div>
        )}

        {currentScreen === "isla2" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Isla2Water7
              onBackToMenu={backToMenu}
              onIslandCompleted={() => {
                setUnlockedIslands((prev) => ({ ...prev, isla3: true }));
                setCurrentScreen("isla3");
              }}
              playError={playError}
              playSuccess={playSuccess}
            />
          </motion.div>
        )}

        {currentScreen === "isla3" && (
          <Isla3EniesLobby
            onBackToMenu={backToMenu}
            onIslandCompleted={() => {
              setUnlockedIslands((prev) => ({ ...prev, isla4: true }));
              setCurrentScreen("isla4");
            }}
            playClick={playClick}
          />
        )}

        {currentScreen === "isla4" && (
          <Isla4Sabaody
            onBackToMenu={backToMenu}
            onIslandCompleted={() => {
              setUnlockedIslands((prev) => ({ ...prev, isla5: true }));
              setCurrentScreen("isla5");
            }}
            playClick={playClick}
          />
        )}

        {currentScreen === "isla5" && (
          <Isla5ImpelDown
            onBackToMenu={backToMenu}
            onIslandCompleted={() => {
              setUnlockedIslands((prev) => ({ ...prev, isla6: true }));
              setCurrentScreen("isla6");
            }}
            playClick={playClick}
          />
        )}

        {currentScreen === "isla6" && (
          <Isla6LaughTale
            onBackToMenu={backToMenu}
            onIslandCompleted={backToMenu}
            playClick={playClick}
          />
        )}
      </main>
    </div>
  );
}
