import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Anchor, Compass, Lock, Skull, Unlock } from "lucide-react";
import Isla1Loguetown from "./components/Isla1Loguetown";
import Isla2Water7 from "./components/Isla2Water7";
import Isla3Sabaody from "./components/Isla3Sabaody";
import Isla4Sabaody from "./components/Isla4BigMom";
import Isla5Wano from "./components/Isla5Wano";
import Isla6EggHead from "./components/Isla6EggHead";
import Isla7LaughTale from "./components/Isla7LaughTale";
import IslandIntro from "./components/IslandIntro";
import { usePirateAudio } from "./hooks/usePirateAudio";

const ISLAND_KEYS = ["isla1", "isla2", "isla3", "isla4", "isla5", "isla6", "isla7"];

const ISLAND_SLUGS = {
  isla1: "isla1-loguetown",
  isla2: "isla2-water7",
  isla3: "isla3-sabaody",
  isla4: "isla4-wholecake",
  isla5: "isla5-wano",
  isla6: "isla6-egghead",
  isla7: "isla7-laughtale",
};

const SLUG_TO_ISLAND = Object.fromEntries(
  Object.entries(ISLAND_SLUGS).map(([key, slug]) => [slug, key])
);

const UNLOCKED_ISLANDS_STORAGE_KEY = "reqpiece-unlocked-islands";
const DEFAULT_UNLOCKED_ISLANDS = {
  isla1: true,
  isla2: false,
  isla3: false,
  isla4: false,
  isla5: false,
  isla6: false,
  isla7: false,
};

function loadUnlockedIslands() {
  if (typeof window === "undefined") return { ...DEFAULT_UNLOCKED_ISLANDS };

  try {
    const storedValue = window.localStorage.getItem(UNLOCKED_ISLANDS_STORAGE_KEY);
    if (!storedValue) return { ...DEFAULT_UNLOCKED_ISLANDS };

    const parsed = JSON.parse(storedValue);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ...DEFAULT_UNLOCKED_ISLANDS };
    }

    // Enforce sequential integrity: if any island is locked, all subsequent must be too
    const result = { ...DEFAULT_UNLOCKED_ISLANDS };
    for (let i = 0; i < ISLAND_KEYS.length; i++) {
      const key = ISLAND_KEYS[i];
      if (parsed[key] === true) {
        result[key] = true;
      } else {
        break;
      }
    }
    return result;
  } catch {
    return { ...DEFAULT_UNLOCKED_ISLANDS };
  }
}

function getScreenFromPath(pathname, unlockedIslands) {
  const normalized = (pathname.replace(/\/+$/, "") || "/").toLowerCase();

  if (normalized === "/") return "menu";
  if (normalized === "/victoria") {
    const allUnlocked = ISLAND_KEYS.every((k) => unlockedIslands[k]);
    return allUnlocked ? "victory" : "menu";
  }

  const slug = normalized.slice(1);
  const islandKey = SLUG_TO_ISLAND[slug];
  if (!islandKey) return "menu";
  if (!unlockedIslands[islandKey]) return "menu";
  return islandKey;
}

function getPathFromScreen(screen) {
  if (screen === "menu") return "/";
  if (screen === "victory") return "/victoria";
  const slug = ISLAND_SLUGS[screen];
  return slug ? `/${slug}` : "/";
}

export default function App() {
  const [unlockedIslands, setUnlockedIslands] = useState(loadUnlockedIslands);
  const [currentScreen, setCurrentScreen] = useState(() =>
    getScreenFromPath(window.location.pathname, loadUnlockedIslands())
  );
  const [showingIntro, setShowingIntro] = useState(false);
  const { playClick, playError, playSuccess } = usePirateAudio();

  const goToIsland = (islandKey) => {
    playClick();
    if (!unlockedIslands[islandKey]) return;
    setCurrentScreen(islandKey);
    setShowingIntro(true);
  };

  const startIsland = () => {
    setShowingIntro(false);
  };

  const backToMenu = () => {
    playClick();
    setCurrentScreen("menu");
    setShowingIntro(false);
  };

  const completeIsland1 = () => {
    setUnlockedIslands((prev) => ({
      ...prev,
      isla2: true,
    }));
    setCurrentScreen("menu");
  };

  const islandsMenu = [
    {
      key: "isla1",
      nombre: "Loguetown",
      descripcion: "Ordena fases del ciclo de requisitos para iniciar la travesia.",
      lockedHint: "",
    },
    {
      key: "isla2",
      nombre: "Water 7",
      descripcion: "Traduce dialogos cliente-programador al lenguaje tecnico.",
      lockedHint: "Completa Isla 1 para desbloquear.",
    },
    {
      key: "isla3",
      nombre: "Archipielago Sabaody",
      descripcion: "Shooter: distingue requisito (QUE) de solucion (COMO).",
      lockedHint: "Completa Isla 2 para desbloquear.",
    },
    {
      key: "isla4",
      nombre: "Whole Cake",
      descripcion: "Swipe: clasifica requisitos funcionales y no funcionales.",
      lockedHint: "Completa Isla 3 para desbloquear.",
    },
    {
      key: "isla5",
      nombre: "Wano",
      descripcion: "Valida requisitos con precision IEEE 830 en Onigashima.",
      lockedHint: "Completa Isla 4 para desbloquear.",
    },
    {
      key: "isla6",
      nombre: "EggHead",
      descripcion: "Laboratorio del futuro: trazabilidad cuantica e impacto automatizado.",
      lockedHint: "Completa Isla 5 para desbloquear.",
    },
    {
      key: "isla7",
      nombre: "Laugh Tale",
      descripcion: "Recta final para encontrar el One Spec.",
      lockedHint: "Completa Isla 6 para desbloquear.",
    },
  ];

  const unlockedCount = Object.values(unlockedIslands).filter(Boolean).length;

  useEffect(() => {
    window.localStorage.setItem(UNLOCKED_ISLANDS_STORAGE_KEY, JSON.stringify(unlockedIslands));
  }, [unlockedIslands]);

  // Redirect to menu if current screen is a locked island (safety net)
  useEffect(() => {
    if (ISLAND_KEYS.includes(currentScreen) && !unlockedIslands[currentScreen]) {
      setCurrentScreen("menu");
      setShowingIntro(false);
    }
  }, [currentScreen, unlockedIslands]);

  useEffect(() => {
    const nextPath = getPathFromScreen(currentScreen);
    const currentPath = (window.location.pathname.replace(/\/+$/, "") || "/").toLowerCase();
    if (currentPath !== nextPath) {
      window.history.pushState({ screen: currentScreen }, "", nextPath);
    }
  }, [currentScreen]);

  useEffect(() => {
    const handlePopState = () => {
      const unlocked = loadUnlockedIslands();
      setCurrentScreen(getScreenFromPath(window.location.pathname, unlocked));
      setShowingIntro(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return undefined;
    }

    const previousReqPiece = window.reqpiece;

    const resolveIsland = (islandNumber) => {
      const parsed = Number(islandNumber);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 7) {
        // eslint-disable-next-line no-console
        console.error("Uso: reqpiece.resolveIsland(<1-7>)");
        return false;
      }

      const unlockUntil = Math.min(7, parsed + 1);
      setUnlockedIslands(() => {
        const next = { ...DEFAULT_UNLOCKED_ISLANDS };

        ISLAND_KEYS.slice(0, unlockUntil).forEach((key) => {
          next[key] = true;
        });

        return next;
      });
      setCurrentScreen("menu");

      // eslint-disable-next-line no-console
      console.info(`Isla ${parsed} resuelta. Progreso actualizado y menu abierto.`);
      return true;
    };

    window.reqpiece = {
      ...(previousReqPiece || {}),
      resolveIsland,
      help: "Comando: reqpiece.resolveIsland(1..7)",
    };

    // eslint-disable-next-line no-console
    console.info("ReqPiece console command ready: reqpiece.resolveIsland(1..7)");

    return () => {
      if (previousReqPiece === undefined) {
        delete window.reqpiece;
      } else {
        window.reqpiece = previousReqPiece;
      }
    };
  }, []);

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

            <h2 className="mt-4 text-3xl font-black uppercase tracking-wide md:text-4xl text-center">
              Elige tu isla
            </h2>

            <p className="mt-3 w-full text-sm font-semibold text-blue-900/80 md:text-base text-center">
              El Rey de los Analistas, Gold Roger, antes de retirarse dejó el mayor tesoro de la Ingeniería de Software escondido en la última isla del Grand Line: El "One Spec" (El Documento de Especificación de Requisitos Perfecto).<br/>Tú eres un joven capitán pirata que aspira a ser el Rey de los Analistas. Para lograrlo, debes construir el barco definitivo (el sistema de software) y reclutar a una tripulación. Deberás navegar por 7 islas diferentes. En cada isla te enfrentarás a un minijuego que pondrá a prueba tus conocimientos teóricos de GPDS (Ingeniería de Requisitos).
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {islandsMenu.map((island, index) => {
                const unlocked = unlockedIslands[island.key];
                return (
                  <article
                    key={island.key}
                    className={`rounded-2xl border-2 p-5 shadow-[0_10px_20px_rgba(0,0,0,0.15)] ${
                      unlocked
                        ? "border-amber-700 bg-gradient-to-r from-blue-950 to-blue-900 text-amber-50"
                        : "border-amber-700/40 bg-amber-50/70 text-blue-950"
                    }`}
                  >
                    <p
                      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${
                        unlocked ? "text-amber-300" : "text-blue-800/80"
                      }`}
                    >
                      {unlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      {unlocked ? "Desbloqueada" : "Bloqueada"}
                    </p>
                    <h3 className="mt-2 text-2xl font-black">Isla {index + 1}: {island.nombre}</h3>
                    <p className={`mt-2 text-sm font-semibold ${unlocked ? "text-amber-100/85" : "text-blue-900/70"}`}>
                      {unlocked ? island.descripcion : island.lockedHint}
                    </p>
                    <button
                      type="button"
                      onClick={() => goToIsland(island.key)}
                      disabled={!unlocked}
                      className={`mt-5 inline-flex items-center gap-2 rounded-xl border-2 px-5 py-3 text-base font-black uppercase tracking-[0.12em] transition ${
                        unlocked
                          ? "border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 text-blue-950 hover:-translate-y-0.5 hover:brightness-105"
                          : "cursor-not-allowed border-slate-300/70 bg-slate-300/60 text-slate-600"
                      }`}
                    >
                      <Compass className="h-5 w-5" />
                      {unlocked ? `Ir a Isla ${index + 1}` : `Isla ${index + 1} bloqueada`}
                    </button>
                  </article>
                );
              })}
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.17em] text-blue-900/70">
              Progreso actual: {unlockedCount}/7 islas desbloqueadas
            </p>
          </motion.section>
        )}

        {currentScreen === "isla1" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {showingIntro ? (
              <IslandIntro 
                islandKey="isla1" 
                onStart={startIsland} 
                playClick={playClick}
              />
            ) : (
              <Isla1Loguetown
                onBackToMenu={backToMenu}
                onIslandCompleted={completeIsland1}
                playClick={playClick}
                playError={playError}
                playSuccess={playSuccess}
              />
            )}
          </motion.div>
        )}

        {currentScreen === "isla2" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {showingIntro ? (
              <IslandIntro 
                islandKey="isla2" 
                onStart={startIsland} 
                playClick={playClick}
              />
            ) : (
              <Isla2Water7
                onBackToMenu={backToMenu}
                onIslandCompleted={() => {
                  setUnlockedIslands((prev) => ({ ...prev, isla3: true }));
                  setCurrentScreen("menu");
                }}
                playError={playError}
                playSuccess={playSuccess}
              />
            )}
          </motion.div>
        )}

        {currentScreen === "isla3" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {showingIntro ? (
              <IslandIntro 
                islandKey="isla3" 
                onStart={startIsland} 
                playClick={playClick}
              />
            ) : (
              <Isla3Sabaody
                onBackToMenu={backToMenu}
                onIslandCompleted={() => {
                  setUnlockedIslands((prev) => ({ ...prev, isla4: true }));
                  setCurrentScreen("menu");
                }}
                playClick={playClick}
              />
            )}
          </motion.div>
        )}

        {currentScreen === "isla4" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {showingIntro ? (
              <IslandIntro 
                islandKey="isla4" 
                onStart={startIsland} 
                playClick={playClick}
              />
            ) : (
              <Isla4Sabaody
                onBackToMenu={backToMenu}
                onIslandCompleted={() => {
                  setUnlockedIslands((prev) => ({ ...prev, isla5: true }));
                  setCurrentScreen("menu");
                }}
                playClick={playClick}
              />
            )}
          </motion.div>
        )}

        {currentScreen === "isla5" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {showingIntro ? (
              <IslandIntro 
                islandKey="isla5" 
                onStart={startIsland} 
                playClick={playClick}
              />
            ) : (
              <Isla5Wano
                onBackToMenu={backToMenu}
                onIslandCompleted={() => {
                  setUnlockedIslands((prev) => ({ ...prev, isla6: true }));
                  setCurrentScreen("menu");
                }}
                playClick={playClick}
              />
            )}
          </motion.div>
        )}

        {currentScreen === "isla6" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {showingIntro ? (
              <IslandIntro 
                islandKey="isla6" 
                onStart={startIsland} 
                playClick={playClick}
              />
            ) : (
              <Isla6EggHead
                onBackToMenu={backToMenu}
                onIslandCompleted={() => {
                  setUnlockedIslands((prev) => ({ ...prev, isla7: true }));
                  setCurrentScreen("menu");
                }}
                playClick={playClick}
                playError={playError}
                playSuccess={playSuccess}
              />
            )}
          </motion.div>
        )}

        {currentScreen === "isla7" && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {showingIntro ? (
              <IslandIntro 
                islandKey="isla7" 
                onStart={startIsland} 
                playClick={playClick}
              />
            ) : (
              <Isla7LaughTale
                onBackToMenu={backToMenu}
                onIslandCompleted={() => {
                  setCurrentScreen("victory");
                }}
                playClick={playClick}
              />
            )}
          </motion.div>
        )}

        {currentScreen === "victory" && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto w-full max-w-4xl rounded-3xl border-4 border-amber-700/70 bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 p-8 text-blue-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-900">Tesoro encontrado</p>
            <h2 className="mt-2 text-4xl font-black uppercase">¡Has reclamado el One Spec!</h2>
            <p className="mt-4 text-base font-semibold text-blue-900/85">
              Superaste las 7 islas del Grand Line y dominaste la Ingenieria de Requisitos.
              Tu tripulacion ya canta tu nombre como el nuevo Rey de los Analistas.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setCurrentScreen("menu");
                }}
                className="rounded-xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-blue-950 transition hover:-translate-y-0.5"
              >
                Volver al menu
              </button>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
