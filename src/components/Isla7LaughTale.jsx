import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Crown,
  Eye,
  Flame,
  Hammer,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const INITIAL_INTEGRITY = 100;
const PHASE_ONE_TIME_LIMIT = 10;
const PHASE_ONE_MIN_VALID = 2;
const PHASE_ONE_STREAK_GOAL = 3;
const PHASE_ONE_STREAK_REWARD = 2;
const PHASE_TWO_BUDGET = 12;
const SWIPE_THRESHOLD = 120;

const PRIORITY_LABELS = {
  must: "Must Have",
  should: "Should Have",
  could: "Could Have",
  wont: "Won't Have",
};

const PRIORITY_STYLES = {
  unclassified: "border-slate-600 bg-slate-900/65 text-slate-100",
  must: "border-red-400/80 bg-red-500/15 text-red-100",
  should: "border-amber-400/80 bg-amber-500/15 text-amber-100",
  could: "border-sky-400/80 bg-sky-500/15 text-sky-100",
  wont: "border-violet-400/80 bg-violet-500/15 text-violet-100",
};

const PHASE_ONE_CARDS = [
  {
    id: "card-01",
    text: "El sistema debe permitir recuperar la contrasena mediante correo con token de un solo uso.",
    verdict: "accept",
    reason: "Es un QUE claro, verificable y centrado en comportamiento.",
    requirement: {
      id: "rf-recovery",
      title: "Recuperacion de contrasena por correo",
      detail: "Permite restaurar acceso con un enlace temporal y seguro.",
      priority: "must",
      effort: 3,
      businessNeed: "Reducir bloqueos de acceso de usuarios activos",
      validationTest: "Prueba E2E de solicitud y uso correcto del token de recuperacion",
    },
  },
  {
    id: "card-02",
    text: "La aplicacion debe ser super intuitiva y muy moderna para cualquier usuario.",
    verdict: "discard",
    reason: "Es ambiguo y no verificable; no define una medida concreta.",
  },
  {
    id: "card-03",
    text: "El carrito de compras debe conservar los productos aunque el usuario recargue la pagina durante 24 horas.",
    verdict: "accept",
    reason: "Es un comportamiento observable, acotado y comprobable.",
    requirement: {
      id: "rf-cart",
      title: "Persistencia temporal del carrito",
      detail: "Mantiene el estado del carrito durante una jornada de compra.",
      priority: "must",
      effort: 4,
      businessNeed: "Aumentar conversion y reducir abandonos de compra",
      validationTest: "Prueba funcional de persistencia del carrito tras recarga y nueva sesion",
    },
  },
  {
    id: "card-04",
    text: "El frontend debe usar microservicios con Kubernetes y Redis para escalar mejor.",
    verdict: "discard",
    reason: "Describe un COMO tecnico, no un requisito de negocio o calidad.",
  },
  {
    id: "card-05",
    text: "La busqueda del catalogo debe responder en menos de 2 segundos para consultas normales.",
    verdict: "accept",
    reason: "Es un requisito no funcional medible y verificable.",
    requirement: {
      id: "rf-search",
      title: "Busqueda de catalogo bajo 2 segundos",
      detail: "El catalogo debe responder de forma agil bajo carga habitual.",
      priority: "should",
      effort: 2,
      businessNeed: "Reducir abandono de usuarios durante exploracion de productos",
      validationTest: "Prueba de rendimiento con consultas tipo y umbral maximo de 2 segundos",
    },
  },
  {
    id: "card-06",
    text: "La plataforma no incluira chat en tiempo real en la primera entrega del producto.",
    verdict: "accept",
    reason: "Es un alcance explicitamente definido y apto para clasificar como Won't Have.",
    requirement: {
      id: "rf-chat-scope",
      title: "Chat en tiempo real fuera de alcance en v1",
      detail: "Se documenta que el chat queda fuera de la primera release.",
      priority: "wont",
      effort: 1,
      businessNeed: "Proteger la fecha de salida del producto minimo viable",
      validationTest: "Revision de alcance y pruebas de aceptacion sin historias de chat activas",
    },
  },
  {
    id: "card-07",
    text: "El dashboard de ventas debe permitir exportar los datos mensuales a CSV.",
    verdict: "accept",
    reason: "Es una capacidad funcional clara que puede validarse facilmente.",
    requirement: {
      id: "rf-export",
      title: "Exportacion de ventas a CSV",
      detail: "Permite descargar informes mensuales para analisis comercial.",
      priority: "could",
      effort: 2,
      businessNeed: "Mejorar el analisis del equipo comercial sin bloquear la salida",
      validationTest: "Prueba funcional de exportacion correcta de informes mensuales a CSV",
    },
  },
  {
    id: "card-08",
    text: "El boton de comprar debe ser azul oscuro y situarse a la derecha del resumen.",
    verdict: "discard",
    reason: "Es una decision de diseno, no un requisito esencial del QUE.",
  },
  {
    id: "card-09",
    text: "El servicio debe mantenerse disponible el 99.9% del tiempo entre las 8:00 y las 22:00.",
    verdict: "accept",
    reason: "Es una restriccion de calidad cuantificable y verificable.",
    requirement: {
      id: "rf-sla",
      title: "Disponibilidad del 99.9% en horario comercial",
      detail: "Garantiza continuidad del servicio en las horas de mayor demanda.",
      priority: "should",
      effort: 3,
      businessNeed: "Evitar caidas en ventanas criticas de venta online",
      validationTest: "Prueba de monitoreo y calculo de SLA en horario comercial",
    },
  },
  {
    id: "card-10",
    text: "La solucion debe desplegarse en tres regiones de nube usando Terraform desde el primer sprint.",
    verdict: "discard",
    reason: "Es una imposicion de implementacion tecnica, no una necesidad del negocio.",
  },
];

function shuffle(array) {
  const next = [...array];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
}

function buildPhaseTwoAssignments(requirements) {
  return {
    unclassified: requirements.map((item) => item.id),
    must: [],
    should: [],
    could: [],
    wont: [],
  };
}

function removeRequirementFromAssignments(assignments, requirementId) {
  return Object.fromEntries(
    Object.entries(assignments).map(([zone, items]) => [
      zone,
      items.filter((itemId) => itemId !== requirementId),
    ])
  );
}

function placeRequirement(assignments, requirementId, targetZone) {
  const cleaned = removeRequirementFromAssignments(assignments, requirementId);
  return {
    ...cleaned,
    [targetZone]: [...cleaned[targetZone], requirementId],
  };
}

function findRequirementZone(assignments, requirementId) {
  return Object.entries(assignments).find(([, items]) => items.includes(requirementId))?.[0] ?? "unclassified";
}

function calculateUsedBudget(assignments, requirements) {
  const lookup = Object.fromEntries(requirements.map((item) => [item.id, item]));
  return [...assignments.must, ...assignments.should].reduce(
    (total, requirementId) => total + (lookup[requirementId]?.effort ?? 0),
    0
  );
}

function getNodeId(column, requirementId) {
  return `${column}-${requirementId}`;
}

function getCurvePath(start, end) {
  const controlOffset = Math.max(70, Math.abs(end.x - start.x) * 0.45);
  return `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${end.x - controlOffset} ${end.y}, ${end.x} ${end.y}`;
}

function scrollToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Isla7LaughTale({
  onBackToMenu,
  onIslandCompleted,
  playClick,
  playError,
  playSuccess,
}) {
  const [faseActual, setFaseActual] = useState(0);
  const [integridadPoneglyph, setIntegridadPoneglyph] = useState(INITIAL_INTEGRITY);
  const [requisitosFiltrados, setRequisitosFiltrados] = useState([]);
  const [checkpoint, setCheckpoint] = useState({
    phase: 1,
    integrity: INITIAL_INTEGRITY,
    filteredRequirements: [],
  });
  const [gameOverMessage, setGameOverMessage] = useState("");

  const [phaseOneDeck, setPhaseOneDeck] = useState(() => shuffle(PHASE_ONE_CARDS));
  const [phaseOneIndex, setPhaseOneIndex] = useState(0);
  const [phaseOneTimeLeft, setPhaseOneTimeLeft] = useState(PHASE_ONE_TIME_LIMIT);
  const [phaseOneLocked, setPhaseOneLocked] = useState(false);
  const [phaseOneFeedback, setPhaseOneFeedback] = useState({ tone: "neutral", text: "Observa el fragmento y decide si describe un QUE valido." });
  const [phaseOneStats, setPhaseOneStats] = useState({ total: 0, correct: 0, wrong: 0, streak: 0 });

  const [phaseTwoAssignments, setPhaseTwoAssignments] = useState(() => buildPhaseTwoAssignments([]));
  const [phaseTwoReview, setPhaseTwoReview] = useState({});
  const [phaseTwoFeedback, setPhaseTwoFeedback] = useState("Distribuye los fragmentos sin hundir el barco del proyecto.");
  const [phaseTwoHistory, setPhaseTwoHistory] = useState([]);
  const [budgetCollapsed, setBudgetCollapsed] = useState(false);

  const [phaseThreeConnections, setPhaseThreeConnections] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [phaseThreeFeedback, setPhaseThreeFeedback] = useState("Conecta necesidad, requisito y prueba para cerrar la trazabilidad.");
  const [shortCircuitIds, setShortCircuitIds] = useState([]);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState({});

  const integrityRef = useRef(INITIAL_INTEGRITY);
  const filteredRequirementsRef = useRef([]);
  const boardRef = useRef(null);
  const zoneRefs = useRef({});
  const nodeRefs = useRef({});

  useEffect(() => {
    integrityRef.current = integridadPoneglyph;
  }, [integridadPoneglyph]);

  useEffect(() => {
    filteredRequirementsRef.current = requisitosFiltrados;
  }, [requisitosFiltrados]);

  const currentPhaseOneCard = phaseOneDeck[phaseOneIndex] ?? null;

  const usedBudget = useMemo(
    () => calculateUsedBudget(phaseTwoAssignments, requisitosFiltrados),
    [phaseTwoAssignments, requisitosFiltrados]
  );
  const budgetPercent = Math.min(100, Math.round((usedBudget / PHASE_TWO_BUDGET) * 100));

  const totalPhaseTwoAssigned = useMemo(
    () => Object.values(phaseTwoAssignments).reduce((total, items) => total + items.length, 0),
    [phaseTwoAssignments]
  );

  const traceRows = useMemo(
    () =>
      requisitosFiltrados.map((requirement) => ({
        requirement,
        needNodeId: getNodeId("need", requirement.id),
        requirementNodeId: getNodeId("req", requirement.id),
        testNodeId: getNodeId("test", requirement.id),
      })),
    [requisitosFiltrados]
  );

  const nodeMeta = useMemo(() => {
    const entries = [];
    traceRows.forEach((row) => {
      entries.push([
        row.needNodeId,
        {
          id: row.needNodeId,
          type: "need",
          label: row.requirement.businessNeed,
          requirementId: row.requirement.id,
        },
      ]);
      entries.push([
        row.requirementNodeId,
        {
          id: row.requirementNodeId,
          type: "req",
          label: row.requirement.title,
          requirementId: row.requirement.id,
        },
      ]);
      entries.push([
        row.testNodeId,
        {
          id: row.testNodeId,
          type: "test",
          label: row.requirement.validationTest,
          requirementId: row.requirement.id,
        },
      ]);
    });
    return Object.fromEntries(entries);
  }, [traceRows]);

  const requiredTraceKeys = useMemo(() => {
    return traceRows.flatMap((row) => [
      `${row.needNodeId}->${row.requirementNodeId}`,
      `${row.requirementNodeId}->${row.testNodeId}`,
    ]);
  }, [traceRows]);

  const permanentTraceKeys = useMemo(
    () => new Set(phaseThreeConnections.map((connection) => connection.key)),
    [phaseThreeConnections]
  );

  const refreshNodePositions = useCallback(() => {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const nextPositions = {};

    Object.entries(nodeRefs.current).forEach(([nodeId, element]) => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      nextPositions[nodeId] = {
        x: rect.left - boardRect.left + rect.width / 2,
        y: rect.top - boardRect.top + rect.height / 2,
      };
    });

    setNodePositions(nextPositions);
  }, []);

  useEffect(() => {
    if (faseActual !== 3) return undefined;

    const handleResize = () => refreshNodePositions();
    const rafId = window.requestAnimationFrame(refreshNodePositions);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [faseActual, refreshNodePositions, requisitosFiltrados, phaseThreeConnections]);

  // El estado de fase 2 se inicializa en startPhaseTwo, este effect es un fallback
  useEffect(() => {
    if (faseActual !== 2) return;
    if (requisitosFiltrados.length === 0) return;
    // Solo rehidratar si no hay nada asignado todavía
    const totalItems = Object.values(phaseTwoAssignments).flat().length;
    if (totalItems > 0) return;

    setPhaseTwoAssignments(buildPhaseTwoAssignments(requisitosFiltrados));
  }, [faseActual, requisitosFiltrados, phaseTwoAssignments]);

  const failCurrentRun = useCallback((message) => {
    setActiveNodeId(null);
    setGameOverMessage(message);
    setFaseActual(5);
  }, []);

  const loseIntegrity = useCallback(
    (amount, message) => {
      const nextIntegrity = Math.max(0, integrityRef.current - amount);
      setIntegridadPoneglyph(nextIntegrity);
      integrityRef.current = nextIntegrity;

      if (nextIntegrity <= 0) {
        playError?.();
        failCurrentRun(message);
        return true;
      }

      return false;
    },
    [failCurrentRun, playError]
  );

  const resetPhaseOneState = useCallback(() => {
    setPhaseOneDeck(shuffle(PHASE_ONE_CARDS));
    setPhaseOneIndex(0);
    setPhaseOneTimeLeft(PHASE_ONE_TIME_LIMIT);
    setPhaseOneLocked(false);
    setPhaseOneFeedback({ tone: "neutral", text: "Observa el fragmento y decide si describe un QUE valido." });
    setPhaseOneStats({ total: 0, correct: 0, wrong: 0, streak: 0 });
  }, []);

  const resetPhaseTwoState = useCallback((requirements) => {
    setPhaseTwoAssignments(buildPhaseTwoAssignments(requirements));
    setPhaseTwoReview({});
    setPhaseTwoFeedback("Distribuye los fragmentos sin hundir el barco del proyecto.");
    setPhaseTwoHistory([]);
    setBudgetCollapsed(false);
  }, []);

  const resetPhaseThreeState = useCallback(() => {
    setPhaseThreeConnections([]);
    setActiveNodeId(null);
    setPhaseThreeFeedback("Conecta necesidad, requisito y prueba para cerrar la trazabilidad.");
    setShortCircuitIds([]);
  }, []);

  const startPhaseOne = useCallback(() => {
    const nextCheckpoint = {
      phase: 1,
      integrity: INITIAL_INTEGRITY,
      filteredRequirements: [],
    };

    setCheckpoint(nextCheckpoint);
    setIntegridadPoneglyph(INITIAL_INTEGRITY);
    integrityRef.current = INITIAL_INTEGRITY;
    setRequisitosFiltrados([]);
    filteredRequirementsRef.current = [];
    resetPhaseOneState();
    resetPhaseTwoState([]);
    resetPhaseThreeState();
    setGameOverMessage("");
    setFaseActual(1);
    scrollToTop();
    playClick?.();
  }, [playClick, resetPhaseOneState, resetPhaseThreeState, resetPhaseTwoState]);

  const startPhaseTwo = useCallback(
    (requirements) => {
      const nextCheckpoint = {
        phase: 2,
        integrity: integrityRef.current,
        filteredRequirements: requirements,
      };

      setCheckpoint(nextCheckpoint);
      setRequisitosFiltrados(requirements);
      filteredRequirementsRef.current = requirements;
      resetPhaseTwoState(requirements);
      setFaseActual(2);
      scrollToTop();
      playSuccess?.();
    },
    [playSuccess, resetPhaseTwoState]
  );

  const startPhaseThree = useCallback(() => {
    const nextCheckpoint = {
      phase: 3,
      integrity: integrityRef.current,
      filteredRequirements: filteredRequirementsRef.current,
    };

    setCheckpoint(nextCheckpoint);
    resetPhaseThreeState();
    setFaseActual(3);
    scrollToTop();
    playSuccess?.();
  }, [playSuccess, resetPhaseThreeState]);

  const retryCurrentPhase = useCallback(() => {
    const nextIntegrity = checkpoint.integrity;
    const nextRequirements = checkpoint.filteredRequirements;

    setIntegridadPoneglyph(nextIntegrity);
    integrityRef.current = nextIntegrity;
    setRequisitosFiltrados(nextRequirements);
    filteredRequirementsRef.current = nextRequirements;
    setGameOverMessage("");

    if (checkpoint.phase === 1) {
      resetPhaseOneState();
    }

    if (checkpoint.phase === 2) {
      resetPhaseTwoState(nextRequirements);
    }

    if (checkpoint.phase === 3) {
      resetPhaseThreeState();
    }

    setFaseActual(checkpoint.phase);
    scrollToTop();
    playClick?.();
  }, [checkpoint, playClick, resetPhaseOneState, resetPhaseThreeState, resetPhaseTwoState]);

  const resolvePhaseOneCard = useCallback(
    (decision) => {
      if (!currentPhaseOneCard || phaseOneLocked) return;

      setPhaseOneLocked(true);
      const isCorrect = decision === currentPhaseOneCard.verdict;
      const nextFiltered = [...filteredRequirementsRef.current];

      if (isCorrect) {
        const nextStats = {
          total: phaseOneStats.total + 1,
          correct: phaseOneStats.correct + 1,
          wrong: phaseOneStats.wrong,
          streak: phaseOneStats.streak + 1,
        };
        setPhaseOneStats(nextStats);

        let rewardMessage = "";
        if (nextStats.streak % PHASE_ONE_STREAK_GOAL === 0) {
          const healedIntegrity = Math.min(100, integrityRef.current + PHASE_ONE_STREAK_REWARD);
          setIntegridadPoneglyph(healedIntegrity);
          integrityRef.current = healedIntegrity;
          rewardMessage = ` Racha x${nextStats.streak}: +${PHASE_ONE_STREAK_REWARD}% de integridad.`;
        }

        if (decision === "accept" && currentPhaseOneCard.requirement) {
          nextFiltered.push(currentPhaseOneCard.requirement);
          setRequisitosFiltrados(nextFiltered);
          filteredRequirementsRef.current = nextFiltered;
        }

        playSuccess?.();
        setPhaseOneFeedback({
          tone: "success",
          text: `Decision correcta. ${currentPhaseOneCard.reason}${rewardMessage}`,
        });
      } else {
        setPhaseOneStats((previous) => ({
          total: previous.total + 1,
          correct: previous.correct,
          wrong: previous.wrong + 1,
          streak: 0,
        }));

        playError?.();
        setPhaseOneFeedback({
          tone: "error",
          text:
            decision === "timeout"
              ? `El fragmento se desvanecio. ${currentPhaseOneCard.reason}`
              : `Decision incorrecta. ${currentPhaseOneCard.reason}`,
        });

        const didGameOver = loseIntegrity(
          decision === "timeout" ? 8 : 12,
          "El Poneglyph se resquebrajo por decisiones ambiguas en la Forja."
        );

        if (didGameOver) {
          return;
        }
      }

      window.setTimeout(() => {
        const nextIndex = phaseOneIndex + 1;

        if (nextIndex >= phaseOneDeck.length) {
          if (nextFiltered.length < PHASE_ONE_MIN_VALID) {
            failCurrentRun(
              "No rescataste suficientes fragmentos validos del One Spec. Necesitas al menos dos para continuar."
            );
            return;
          }

          startPhaseTwo(nextFiltered);
          return;
        }

        setPhaseOneIndex(nextIndex);
        setPhaseOneTimeLeft(PHASE_ONE_TIME_LIMIT);
        setPhaseOneLocked(false);
      }, 700);
    },
    [
      currentPhaseOneCard,
      failCurrentRun,
      loseIntegrity,
      phaseOneDeck.length,
      phaseOneIndex,
      phaseOneLocked,
      phaseOneStats,
      playError,
      playSuccess,
      startPhaseTwo,
    ]
  );

  useEffect(() => {
    if (faseActual !== 1 || !currentPhaseOneCard || phaseOneLocked) return undefined;

    const onKeyDown = (event) => {
      if (event.repeat) return;
      const lowerKey = event.key.toLowerCase();

      if (event.key === "ArrowRight" || lowerKey === "d") {
        event.preventDefault();
        resolvePhaseOneCard("accept");
      }

      if (event.key === "ArrowLeft" || lowerKey === "a") {
        event.preventDefault();
        resolvePhaseOneCard("discard");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentPhaseOneCard, faseActual, phaseOneLocked, resolvePhaseOneCard]);

  useEffect(() => {
    if (faseActual !== 1 || !currentPhaseOneCard || phaseOneLocked) {
      return undefined;
    }

    setPhaseOneTimeLeft(PHASE_ONE_TIME_LIMIT);
    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const nextValue = Math.max(0, Number((PHASE_ONE_TIME_LIMIT - elapsed).toFixed(1)));
      setPhaseOneTimeLeft(nextValue);
    }, 100);

    const timeoutId = window.setTimeout(() => {
      resolvePhaseOneCard("timeout");
    }, PHASE_ONE_TIME_LIMIT * 1000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [currentPhaseOneCard, faseActual, phaseOneLocked, resolvePhaseOneCard]);

  const handlePhaseOneSwipe = (_, info) => {
    if (phaseOneLocked) return;

    if (info.offset.x >= SWIPE_THRESHOLD) {
      resolvePhaseOneCard("accept");
      return;
    }

    if (info.offset.x <= -SWIPE_THRESHOLD) {
      resolvePhaseOneCard("discard");
    }
  };

  const getDropZoneFromPoint = useCallback((point) => {
    const zones = Object.entries(zoneRefs.current);

    for (const [zoneId, element] of zones) {
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      const inside = point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
      if (inside) {
        return zoneId;
      }
    }

    return null;
  }, []);

  const handlePhaseTwoDrop = useCallback(
    (requirementId, point) => {
      const targetZone = getDropZoneFromPoint(point);
      if (!targetZone || targetZone === "board") return;

      setPhaseTwoHistory((previous) => [...previous, phaseTwoAssignments].slice(-18));
      const nextAssignments = placeRequirement(phaseTwoAssignments, requirementId, targetZone);
      const nextUsedBudget = calculateUsedBudget(nextAssignments, requisitosFiltrados);

      if (nextUsedBudget > PHASE_TWO_BUDGET) {
        playError?.();
        setBudgetCollapsed(true);
        setPhaseTwoFeedback("Sobrecargaste el barco: demasiados Must/Should en esta travesia.");
        const didGameOver = loseIntegrity(
          18,
          "El barco del proyecto se hundio por una priorizacion desbalanceada."
        );

        if (!didGameOver) {
          window.setTimeout(() => {
            setBudgetCollapsed(false);
            resetPhaseTwoState(filteredRequirementsRef.current);
          }, 900);
        }

        return;
      }

      playClick?.();
      setPhaseTwoReview({});
      setBudgetCollapsed(false);
      setPhaseTwoAssignments(nextAssignments);
      setPhaseTwoFeedback(`Fragmento movido a ${PRIORITY_LABELS[targetZone]}.`);
    },
    [getDropZoneFromPoint, loseIntegrity, phaseTwoAssignments, playClick, playError, requisitosFiltrados, resetPhaseTwoState]
  );

  const undoPhaseTwoMove = useCallback(() => {
    if (phaseTwoHistory.length === 0) {
      playError?.();
      setPhaseTwoFeedback("No hay movimientos para deshacer en la balanza.");
      return;
    }

    const previousAssignments = phaseTwoHistory[phaseTwoHistory.length - 1];
    setPhaseTwoHistory((previous) => previous.slice(0, -1));
    setPhaseTwoAssignments(previousAssignments);
    setPhaseTwoReview({});
    setBudgetCollapsed(false);
    setPhaseTwoFeedback("Deshiciste el ultimo movimiento. Revisa de nuevo la carga del barco.");
    playClick?.();
  }, [phaseTwoHistory, playClick, playError]);

  const validatePhaseTwo = useCallback(() => {
    if (phaseTwoAssignments.unclassified.length > 0) {
      playError?.();
      setPhaseTwoFeedback("Aun quedan fragmentos sin clasificar en la balanza de Sabaody.");
      return;
    }

    const review = {};
    const mistakes = [];

    requisitosFiltrados.forEach((requirement) => {
      const assignedZone = findRequirementZone(phaseTwoAssignments, requirement.id);
      const isCorrect = assignedZone === requirement.priority;
      review[requirement.id] = isCorrect ? "correct" : "wrong";

      if (!isCorrect) {
        mistakes.push(requirement.title);
      }
    });

    setPhaseTwoReview(review);

    if (mistakes.length > 0) {
      playError?.();
      setPhaseTwoFeedback(`Hay ${mistakes.length} prioridad(es) mal asignadas. Reequilibra la carga del barco.`);
      loseIntegrity(
        Math.min(24, mistakes.length * 9),
        "El Poneglyph se fracturo por una priorizacion MoSCoW incorrecta."
      );
      return;
    }

    setPhaseTwoFeedback("Balanza estabilizada. Los fragmentos estan listos para el circuito final.");
    startPhaseThree();
  }, [loseIntegrity, phaseTwoAssignments, playError, requisitosFiltrados, startPhaseThree]);

  const normalizeConnection = useCallback(
    (nodeIdA, nodeIdB) => {
      const first = nodeMeta[nodeIdA];
      const second = nodeMeta[nodeIdB];
      if (!first || !second) return null;

      const order = { need: 0, req: 1, test: 2 };
      if (Math.abs(order[first.type] - order[second.type]) !== 1) {
        return null;
      }

      return order[first.type] < order[second.type]
        ? { from: first.id, to: second.id, key: `${first.id}->${second.id}` }
        : { from: second.id, to: first.id, key: `${second.id}->${first.id}` };
    },
    [nodeMeta]
  );

  const registerNode = useCallback(
    (nodeId) => (element) => {
      nodeRefs.current[nodeId] = element;
      if (element && faseActual === 3) {
        window.requestAnimationFrame(refreshNodePositions);
      }
    },
    [faseActual, refreshNodePositions]
  );

  const flashShortCircuit = useCallback((nodeIds) => {
    setShortCircuitIds(nodeIds);
    window.setTimeout(() => setShortCircuitIds([]), 500);
  }, []);

  const tryConnectNodes = useCallback(
    (originId, targetId) => {
      if (!originId || !targetId || originId === targetId) {
        setActiveNodeId(null);
        return;
      }

      const connection = normalizeConnection(originId, targetId);

      if (!connection) {
        playError?.();
        setPhaseThreeFeedback("Solo puedes cablear columnas contiguas del circuito.");
        flashShortCircuit([originId, targetId]);
        loseIntegrity(8, "Un cortocircuito rompio el circuito de trazabilidad.");
        setActiveNodeId(null);
        return;
      }

      if (permanentTraceKeys.has(connection.key)) {
        setPhaseThreeFeedback("Ese cable ya esta fijado en el circuito.");
        setActiveNodeId(null);
        return;
      }

      if (!requiredTraceKeys.includes(connection.key)) {
        playError?.();
        setPhaseThreeFeedback("Conexion incorrecta: la trazabilidad del negocio no cuadra.");
        flashShortCircuit([originId, targetId]);
        loseIntegrity(12, "El circuito final entro en cortocircuito por una relacion invalida.");
        setActiveNodeId(null);
        return;
      }

      playSuccess?.();
      const nextConnections = [...phaseThreeConnections, connection];
      setPhaseThreeConnections(nextConnections);
      setPhaseThreeFeedback("Cable fijado. La traza permanece energizada.");
      setActiveNodeId(null);

      if (nextConnections.length === requiredTraceKeys.length) {
        setFaseActual(4);
      }
    },
    [
      flashShortCircuit,
      loseIntegrity,
      normalizeConnection,
      permanentTraceKeys,
      phaseThreeConnections,
      playError,
      playSuccess,
      requiredTraceKeys,
    ]
  );

  const undoPhaseThreeConnection = useCallback(() => {
    if (phaseThreeConnections.length === 0) {
      playError?.();
      setPhaseThreeFeedback("Aun no hay cables para retirar del circuito.");
      return;
    }

    setPhaseThreeConnections((previous) => previous.slice(0, -1));
    setActiveNodeId(null);
    setPhaseThreeFeedback("Retiraste el ultimo cable. Puedes reconectar ese tramo.");
    playClick?.();
  }, [phaseThreeConnections.length, playClick, playError]);

  const activeDraftLine = useMemo(() => {
    if (!activeNodeId || !nodePositions[activeNodeId]) return null;
    return {
      from: nodePositions[activeNodeId],
      to: pointerPosition,
    };
  }, [activeNodeId, nodePositions, pointerPosition]);

  const traceCompletionPercent = requiredTraceKeys.length
    ? Math.round((phaseThreeConnections.length / requiredTraceKeys.length) * 100)
    : 0;

  const phaseOneAccuracy = phaseOneStats.total
    ? Math.round((phaseOneStats.correct / phaseOneStats.total) * 100)
    : 0;

  const renderRequirementCard = (requirementId) => {
    const requirement = requisitosFiltrados.find((item) => item.id === requirementId);
    if (!requirement) return null;

    const reviewTone = phaseTwoReview[requirement.id];

    return (
      <motion.div
        key={requirement.id}
        layout
        drag
        dragSnapToOrigin
        onDragEnd={(_, info) => handlePhaseTwoDrop(requirement.id, info.point)}
        whileDrag={{ scale: 1.04, rotate: 1.5, zIndex: 30 }}
        className={`rounded-2xl border p-4 shadow-[0_12px_28px_rgba(0,0,0,0.22)] ${
          reviewTone === "correct"
            ? "border-emerald-400 bg-emerald-500/10"
            : reviewTone === "wrong"
              ? "border-red-400 bg-red-500/10"
              : "border-amber-300/70 bg-slate-950/70"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-200">{requirement.title}</p>
            <p className="mt-2 text-sm font-medium text-slate-200">{requirement.detail}</p>
          </div>
          <span className="rounded-lg border border-amber-300/40 bg-amber-400/10 px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-amber-100">
            Coste {requirement.effort}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.12em]">
          <span className="rounded-md bg-slate-800 px-2 py-1 text-slate-200">Objetivo: {requirement.businessNeed}</span>
          <span className="rounded-md bg-slate-800 px-2 py-1 text-slate-200">Esperado: {PRIORITY_LABELS[requirement.priority]}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-amber-400/40 bg-slate-950 p-5 text-amber-50 shadow-[0_20px_50px_rgba(0,0,0,0.45)] md:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(251,191,36,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.11)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">Isla 7: Laugh Tale</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-amber-50 md:text-5xl">La Forja del Poneglyph</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold text-amber-100/80 md:text-base">
              Une todo lo aprendido sobre claridad, priorizacion y trazabilidad para reparar el One Spec.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToMenu}
            className="rounded-lg border border-amber-500/60 bg-amber-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-100 transition hover:bg-amber-200/20"
          >
            Volver al menu
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-amber-400/30 bg-slate-900/70 p-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.14em]">
              <span className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-cyan-100">
                Fase {faseActual === 0 ? "Intro" : faseActual === 4 ? "Victoria" : faseActual === 5 ? "Fallo" : `${faseActual}/3`}
              </span>
              <span className="rounded-lg border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-amber-100">
                Fragmentos validos: {requisitosFiltrados.length}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em] text-emerald-100">
              <span>Integridad del Poneglyph</span>
              <span>{integridadPoneglyph}%</span>
            </div>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className={`h-full rounded-full ${
                  integridadPoneglyph > 60
                    ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                    : integridadPoneglyph > 30
                      ? "bg-gradient-to-r from-amber-400 to-orange-400"
                      : "bg-gradient-to-r from-red-500 to-fuchsia-500"
                }`}
                animate={{ width: `${integridadPoneglyph}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence initial={false} mode="sync">
          {faseActual === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="rounded-3xl border border-amber-400/35 bg-gradient-to-br from-amber-500/12 to-slate-950 p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                  <Hammer className="h-4 w-4" />
                  Escritorio de Ensamblaje
                </div>
                <h3 className="mt-4 text-3xl font-black uppercase text-amber-50">Repara el One Spec fragmentado</h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-amber-100/85">
                  En Laugh Tale pondrás a prueba tres habilidades: detectar requisitos validos, priorizarlos sin romper el proyecto y cerrar la trazabilidad de extremo a extremo.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4">
                    <Eye className="h-5 w-5 text-sky-300" />
                    <p className="mt-3 text-sm font-black uppercase text-sky-100">Fase 1</p>
                    <p className="mt-2 text-sm font-medium text-sky-50/80">Filtra ambiguedades con Haki de Observacion.</p>
                  </div>
                  <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
                    <Target className="h-5 w-5 text-amber-300" />
                    <p className="mt-3 text-sm font-black uppercase text-amber-100">Fase 2</p>
                    <p className="mt-2 text-sm font-medium text-amber-50/80">Prioriza con MoSCoW y vigila el presupuesto del barco.</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                    <Sparkles className="h-5 w-5 text-emerald-300" />
                    <p className="mt-3 text-sm font-black uppercase text-emerald-100">Fase 3</p>
                    <p className="mt-2 text-sm font-medium text-emerald-50/80">Cablea necesidad, requisito y prueba sin cortocircuitos.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-fuchsia-400/30 bg-slate-900/80 p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200">Condiciones de la forja</p>
                <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-100/85">
                  <li>La integridad del Poneglyph persiste entre fases y baja con cada error grave.</li>
                  <li>Si la integridad llega a cero, entraras en Game Over y podras reintentar desde la fase actual.</li>
                  <li>La Fase 3 usa SVG dinamico para las lineas; no se anade ninguna dependencia nueva.</li>
                </ul>

                <button
                  type="button"
                  onClick={startPhaseOne}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-slate-950 transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <Hammer className="h-4 w-4" />
                  Comenzar la Forja
                </button>
              </div>
            </motion.div>
          )}

          {faseActual === 1 && (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"
            >
              <div className="rounded-3xl border border-sky-400/30 bg-slate-900/80 p-5">
                <div className="flex items-center gap-2 text-sky-200">
                  <Eye className="h-5 w-5" />
                  <p className="text-xs font-black uppercase tracking-[0.18em]">Fase 1: Haki de Observacion</p>
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-100/85">
                  Acepta solo requisitos claros, verificables y centrados en el QUE. Descarta implementaciones tecnicas, ambiguedades o decisiones de diseno.
                </p>

                <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-sky-100">
                    <span>Tiempo del fragmento</span>
                    <span>{phaseOneTimeLeft.toFixed(1)}s</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400"
                      animate={{ width: `${(phaseOneTimeLeft / PHASE_ONE_TIME_LIMIT) * 100}%` }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4 text-sm font-semibold text-amber-50/90">
                  {phaseOneFeedback.text}
                </div>

                <div className="mt-4 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-4 text-xs font-semibold text-cyan-50/90">
                  <p className="font-black uppercase tracking-[0.14em] text-cyan-100">Guia rapida del QUE</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Describe comportamiento esperado, no tecnologia.</li>
                    <li>• Debe poder validarse con una prueba objetiva.</li>
                    <li>• Evita terminos ambiguos como "moderno" o "intuitivo".</li>
                  </ul>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-black uppercase tracking-[0.14em]">
                  <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-emerald-100">
                    Precision: {phaseOneAccuracy}%
                  </div>
                  <div className="rounded-xl border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-amber-100">
                    Racha: x{phaseOneStats.streak}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => resolvePhaseOneCard("discard")}
                    disabled={phaseOneLocked}
                    className="rounded-xl border-2 border-rose-400 bg-rose-500/15 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-rose-100 transition hover:bg-rose-500/25 disabled:opacity-50"
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={() => resolvePhaseOneCard("accept")}
                    disabled={phaseOneLocked}
                    className="rounded-xl border-2 border-emerald-400 bg-emerald-500/15 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-emerald-100 transition hover:bg-emerald-500/25 disabled:opacity-50"
                  >
                    Aceptar
                  </button>
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Fragmento {Math.min(phaseOneIndex + 1, phaseOneDeck.length)}/{phaseOneDeck.length}
                </p>
              </div>

              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-amber-400/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
                {currentPhaseOneCard && (
                  <motion.div
                    key={currentPhaseOneCard.id}
                    initial={{ opacity: 0, y: -120, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 120, scale: 0.9 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={handlePhaseOneSwipe}
                    whileDrag={{ scale: 1.03, rotate: 2 }}
                    className={`w-full max-w-2xl cursor-grab rounded-[2rem] border-4 p-8 shadow-[0_24px_50px_rgba(0,0,0,0.35)] active:cursor-grabbing ${
                      phaseOneFeedback.tone === "success" && phaseOneLocked
                        ? "border-emerald-400 bg-emerald-500/15"
                        : phaseOneFeedback.tone === "error" && phaseOneLocked
                          ? "border-red-400 bg-red-500/15"
                          : "border-amber-300 bg-gradient-to-b from-amber-100 to-yellow-100 text-slate-950"
                    }`}
                  >
                    <p className={`text-xs font-black uppercase tracking-[0.22em] ${phaseOneFeedback.tone === "neutral" || !phaseOneLocked ? "text-amber-900" : "text-slate-50/90"}`}>
                      Fragmento del One Spec
                    </p>
                    <p className={`mt-5 text-2xl font-black leading-snug ${phaseOneFeedback.tone === "neutral" || !phaseOneLocked ? "text-slate-950" : "text-slate-50"}`}>
                      {currentPhaseOneCard.text}
                    </p>
                    <div className={`mt-8 flex flex-wrap items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em] ${phaseOneFeedback.tone === "neutral" || !phaseOneLocked ? "text-slate-700" : "text-slate-200"}`}>
                      <span>Izquierda: descartar</span>
                      <span>Derecha: aceptar</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {faseActual === 2 && (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-6 min-h-[32rem] space-y-5"
            >
              <div className="rounded-3xl border border-amber-400/35 bg-gradient-to-r from-amber-500/15 via-yellow-400/10 to-cyan-500/10 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">Fase 2 activa</p>
                    <h3 className="mt-2 text-2xl font-black uppercase text-amber-50">La Balanza de Sabaody</h3>
                    <p className="mt-2 text-sm font-semibold text-amber-100/80">
                      Ya has pasado el filtrado. Ahora arrastra cada requisito a su prioridad correcta sin hundir el barco.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/55 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-cyan-100">
                    Requisitos listos: {requisitosFiltrados.length}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-amber-400/30 bg-slate-900/80 p-5">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Target className="h-5 w-5" />
                    <p className="text-xs font-black uppercase tracking-[0.18em]">Fase 2: Balanza de Sabaody</p>
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-100/85">Arrastra cada fragmento a su cuadrante MoSCoW. Must y Should consumen capacidad del barco.</p>

                  <div className="mt-5 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-amber-100">
                      <span>Capacidad del barco</span>
                      <span>
                        {usedBudget}/{PHASE_TWO_BUDGET}
                      </span>
                    </div>
                    <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-800">
                      <motion.div
                        className={`h-full rounded-full ${budgetCollapsed ? "bg-gradient-to-r from-red-500 to-fuchsia-500" : "bg-gradient-to-r from-cyan-400 to-emerald-400"}`}
                        animate={{ width: `${budgetPercent}%`, scaleY: budgetCollapsed ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.25 }}
                      />
                    </div>
                  </div>

                  <p className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm font-semibold text-slate-100/90">
                    {phaseTwoFeedback}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={validatePhaseTwo}
                      className="rounded-xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-slate-950 transition hover:-translate-y-0.5 hover:brightness-105"
                    >
                      Validar priorizacion
                    </button>
                    <button
                      type="button"
                      onClick={undoPhaseTwoMove}
                      className="rounded-xl border-2 border-cyan-400 bg-cyan-500/15 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-500/25"
                    >
                      Deshacer ultimo
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-200">Sin clasificar</p>
                  <div
                    ref={(element) => {
                      zoneRefs.current.unclassified = element;
                    }}
                    className="mt-4 min-h-[150px] rounded-2xl border border-dashed border-slate-600 bg-slate-950/60 p-4"
                  >
                    {phaseTwoAssignments.unclassified.length > 0 ? (
                      <div className="grid gap-3">{phaseTwoAssignments.unclassified.map(renderRequirementCard)}</div>
                    ) : (
                      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-sm font-semibold text-slate-300">
                        No quedan requisitos en la columna inicial. Revisa los cuadrantes MoSCoW y pulsa <span className="font-black text-amber-200">Validar priorizacion</span>.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div ref={(element) => { zoneRefs.current.board = element; }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { key: "must", title: "Must Have", hint: "Imprescindible para zarpar" },
                  { key: "should", title: "Should Have", hint: "Muy valioso, pero negociable" },
                  { key: "could", title: "Could Have", hint: "Aporta valor sin bloquear" },
                  { key: "wont", title: "Won't Have", hint: "Fuera de alcance en esta entrega" },
                ].map((zone) => (
                  <div
                    key={zone.key}
                    ref={(element) => {
                      zoneRefs.current[zone.key] = element;
                    }}
                    className={`rounded-3xl border p-4 ${PRIORITY_STYLES[zone.key]}`}
                  >
                    <p className="text-sm font-black uppercase tracking-[0.14em]">{zone.title}</p>
                    <p className="mt-1 text-xs font-semibold opacity-80">{zone.hint}</p>
                    <div className="mt-4 space-y-3">
                      <AnimatePresence>{phaseTwoAssignments[zone.key].map(renderRequirementCard)}</AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {faseActual === 3 && (
            <motion.div
              key="phase-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-6 space-y-5"
            >
              <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="rounded-3xl border border-emerald-400/30 bg-slate-900/80 p-5">
                  <div className="flex items-center gap-2 text-emerald-200">
                    <Sparkles className="h-5 w-5" />
                    <p className="text-xs font-black uppercase tracking-[0.18em]">Fase 3: Circuito de Trazabilidad</p>
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-100/85">
                    Haz clic en un nodo y luego en otro nodo contiguo para tender un cable. Las conexiones correctas quedaran energizadas.
                  </p>

                  <div className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-emerald-100">
                      <span>Circuito completado</span>
                      <span>{traceCompletionPercent}%</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        animate={{ width: `${traceCompletionPercent}%` }}
                        transition={{ duration: 0.25 }}
                      />
                    </div>
                  </div>

                  <p className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm font-semibold text-slate-100/90">
                    {phaseThreeFeedback}
                  </p>

                  <div className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Cables fijados: {phaseThreeConnections.length}/{requiredTraceKeys.length}
                  </div>

                  <button
                    type="button"
                    onClick={undoPhaseThreeConnection}
                    className="mt-5 rounded-xl border-2 border-cyan-400 bg-cyan-500/15 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-500/25"
                  >
                    Retirar ultimo cable
                  </button>
                </div>

                <div
                  ref={boardRef}
                  onPointerMove={(event) => {
                    if (!boardRef.current) return;
                    const rect = boardRef.current.getBoundingClientRect();
                    setPointerPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                  }}
                  className="relative overflow-hidden rounded-3xl border border-cyan-400/25 bg-slate-900/80 p-5"
                >
                  <svg className="pointer-events-none absolute inset-0 h-full w-full">
                    {phaseThreeConnections.map((connection) => {
                      const from = nodePositions[connection.from];
                      const to = nodePositions[connection.to];
                      if (!from || !to) return null;
                      return (
                        <path
                          key={connection.key}
                          d={getCurvePath(from, to)}
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="10 6"
                        />
                      );
                    })}

                    {activeDraftLine && (
                      <path
                        d={getCurvePath(activeDraftLine.from, activeDraftLine.to)}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="9 6"
                      />
                    )}
                  </svg>

                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { key: "need", title: "Necesidad del Negocio", tone: "border-cyan-400/40 bg-cyan-500/10 text-cyan-50" },
                      { key: "req", title: "Requisito Funcional", tone: "border-amber-400/40 bg-amber-500/10 text-amber-50" },
                      { key: "test", title: "Prueba de Validacion", tone: "border-emerald-400/40 bg-emerald-500/10 text-emerald-50" },
                    ].map((column) => (
                      <div key={column.key} className={`rounded-2xl border p-4 ${column.tone}`}>
                        <p className="text-xs font-black uppercase tracking-[0.18em]">{column.title}</p>
                        <div className="mt-4 space-y-3">
                          {traceRows.map((row) => {
                            const nodeId =
                              column.key === "need"
                                ? row.needNodeId
                                : column.key === "req"
                                  ? row.requirementNodeId
                                  : row.testNodeId;
                            const isActive = activeNodeId === nodeId;
                            const isFlashing = shortCircuitIds.includes(nodeId);
                            const isCompleted = phaseThreeConnections.some(
                              (connection) => connection.from === nodeId || connection.to === nodeId
                            );

                            return (
                              <button
                                key={nodeId}
                                ref={registerNode(nodeId)}
                                type="button"
                                onClick={() => {
                                  playClick?.();
                                  if (!activeNodeId) {
                                    setActiveNodeId(nodeId);
                                    setPhaseThreeFeedback("Nodo armado. Selecciona el siguiente extremo del cable.");
                                    return;
                                  }

                                  tryConnectNodes(activeNodeId, nodeId);
                                }}
                                className={`relative w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                                  isActive
                                    ? "border-amber-300 bg-amber-400/20 shadow-[0_0_0_2px_rgba(251,191,36,0.2)]"
                                    : isCompleted
                                      ? "border-emerald-400 bg-emerald-500/15"
                                      : isFlashing
                                        ? "border-red-400 bg-red-500/20"
                                        : "border-slate-600 bg-slate-950/55 hover:bg-slate-900"
                                }`}
                              >
                                <span className="block text-xs font-black uppercase tracking-[0.14em] text-slate-300">{nodeMeta[nodeId]?.type}</span>
                                <span className="mt-2 block">{nodeMeta[nodeId]?.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {faseActual === 4 && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-6 rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/12 to-slate-950 p-8 text-center"
            >
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/10 text-emerald-200">
                <Crown className="h-8 w-8" />
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Forja completada</p>
              <h3 className="mt-3 text-4xl font-black uppercase text-emerald-50">Rey de los Analistas</h3>
              <p className="mx-auto mt-4 max-w-3xl text-base font-semibold text-emerald-50/85">
                Reconstruiste el One Spec detectando requisitos validos, equilibrando el backlog y cerrando la trazabilidad completa del producto.
              </p>

              <div className="mx-auto mt-7 grid max-w-4xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-emerald-300/25 bg-slate-950/50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-200">Precision Fase 1</p>
                  <p className="mt-2 text-2xl font-black text-emerald-50">{phaseOneAccuracy}%</p>
                </div>
                <div className="rounded-2xl border border-amber-300/25 bg-slate-950/50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-200">Aciertos</p>
                  <p className="mt-2 text-2xl font-black text-amber-50">{phaseOneStats.correct}</p>
                </div>
                <div className="rounded-2xl border border-rose-300/25 bg-slate-950/50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-rose-200">Errores</p>
                  <p className="mt-2 text-2xl font-black text-rose-50">{phaseOneStats.wrong}</p>
                </div>
                <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">Integridad final</p>
                  <p className="mt-2 text-2xl font-black text-cyan-50">{integridadPoneglyph}%</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playSuccess?.();
                    onIslandCompleted();
                  }}
                  className="rounded-xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-slate-950 transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Reclamar el One Spec
                </button>
                <button
                  type="button"
                  onClick={startPhaseOne}
                  className="rounded-xl border-2 border-emerald-400 bg-emerald-500/15 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-emerald-100 transition hover:bg-emerald-500/25"
                >
                  Reforjar isla 7
                </button>
              </div>
            </motion.div>
          )}

          {faseActual === 5 && (
            <motion.div
              key="game-over"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-6 rounded-3xl border border-red-400/40 bg-gradient-to-br from-red-500/12 to-slate-950 p-8 text-center"
            >
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-red-300/40 bg-red-400/10 text-red-200">
                <Flame className="h-8 w-8" />
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-red-200">Game Over</p>
              <h3 className="mt-3 text-4xl font-black uppercase text-red-50">El Poneglyph se ha roto</h3>
              <p className="mx-auto mt-4 max-w-3xl text-base font-semibold text-red-50/85">{gameOverMessage}</p>

              <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
                <div className="rounded-2xl border border-red-300/20 bg-slate-950/60 p-4">
                  <AlertTriangle className="h-5 w-5 text-red-300" />
                  <p className="mt-3 text-sm font-black uppercase text-red-100">Fase guardada</p>
                  <p className="mt-2 text-sm font-medium text-red-50/80">Retomas desde la fase {checkpoint.phase} con el estado valido anterior.</p>
                </div>
                <div className="rounded-2xl border border-amber-300/20 bg-slate-950/60 p-4">
                  <ShieldAlert className="h-5 w-5 text-amber-300" />
                  <p className="mt-3 text-sm font-black uppercase text-amber-100">Integridad recuperada</p>
                  <p className="mt-2 text-sm font-medium text-amber-50/80">Se restaura la integridad del ultimo checkpoint para evitar reiniciar toda la isla.</p>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-slate-950/60 p-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <p className="mt-3 text-sm font-black uppercase text-emerald-100">Listo para seguir</p>
                  <p className="mt-2 text-sm font-medium text-emerald-50/80">Los fragmentos ya validados permanecen si estabas en fases posteriores.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={retryCurrentPhase}
                  className="rounded-xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-slate-950 transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Reintentar fase actual
                </button>
                <button
                  type="button"
                  onClick={startPhaseOne}
                  className="rounded-xl border-2 border-sky-400 bg-sky-500/15 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-sky-100 transition hover:bg-sky-500/25"
                >
                  Reiniciar Isla 7
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
