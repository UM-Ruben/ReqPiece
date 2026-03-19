import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import express from "express";
import session from "express-session";
import { MAX_LIVES, WATER7_DIALOGS } from "./water7Dialogs.js";
import {
  LOGUETOWN_PHASES,
  LOGUETOWN_CORRECT_ORDER,
  LOGUETOWN_MAX_LIVES,
} from "./loguetownData.js";
import {
  SABAODY_BARREL_POOL,
  SABAODY_GAME_TIME_SECONDS,
  SABAODY_MAX_LIVES,
  SABAODY_MIN_SCORE_TO_WIN,
} from "./sabaodyData.js";
import {
  WHOLECAKE_GAME_TIME_SECONDS,
  WHOLECAKE_MAX_TIME_SECONDS,
  WHOLECAKE_REQUIREMENTS_POOL,
  WHOLECAKE_TIME_GAIN_ON_HIT,
  WHOLECAKE_TIME_PENALTY_ON_FAIL,
} from "./wholeCakeData.js";
import { WANO_MAX_LIVES, WANO_REQUIREMENTS, WANO_TOTAL_TIME } from "./wanoData.js";
import {
  EGGHEAD_ARTIFACTS,
  EGGHEAD_MAX_ERRORS,
  EGGHEAD_REQUIREMENTS,
} from "./eggheadData.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "..", "dist");

app.disable("x-powered-by");

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isLocalNetworkOrigin =
    typeof origin === "string" &&
    /^http:\/\/(localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(:\d+)?$/i.test(origin);

  if (isLocalNetworkOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "64kb" }));
app.use(
  session({
    name: "reqpiece.sid",
    secret: process.env.SESSION_SECRET || "reqpiece-dev-session-secret-change-me",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "reqpiece-api" });
});

function shuffle(items) {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function toPublicQuestion(question) {
  return {
    id: question.id,
    emisor: question.emisor,
    texto: question.texto,
    opciones: shuffle(question.opciones).map(({ id, texto }) => ({ id, texto })),
  };
}

function initWater7Game(sessionObj) {
  sessionObj.water7 = {
    index: 0,
    lives: MAX_LIVES,
    status: "in_progress",
  };
}

function getOrCreateWater7Game(req) {
  if (!req.session.water7) {
    initWater7Game(req.session);
  }
  return req.session.water7;
}

function buildGamePayload(game, feedback) {
  const totalQuestions = WATER7_DIALOGS.length;
  const currentQuestion = WATER7_DIALOGS[game.index] || null;

  return {
    status: game.status,
    currentQuestionNumber: Math.min(game.index + 1, totalQuestions),
    totalQuestions,
    lives: game.lives,
    question: game.status === "in_progress" && currentQuestion ? toPublicQuestion(currentQuestion) : null,
    feedback,
  };
}

app.post("/api/water7/start", (req, res) => {
  initWater7Game(req.session);
  const payload = buildGamePayload(req.session.water7, "Selecciona la mejor traducción.");
  res.json(payload);
});

app.get("/api/water7/state", (req, res) => {
  const game = getOrCreateWater7Game(req);
  const payload = buildGamePayload(game, "Partida cargada.");
  res.json(payload);
});

app.post("/api/water7/answer", (req, res) => {
  const game = getOrCreateWater7Game(req);

  if (game.status !== "in_progress") {
    return res.status(409).json({
      error: "La partida ya terminó. Inicia una nueva para continuar.",
      ...buildGamePayload(game, "La partida actual ya está cerrada."),
    });
  }

  const { optionId } = req.body || {};
  if (!optionId || typeof optionId !== "string") {
    return res.status(400).json({ error: "optionId es obligatorio." });
  }

  const question = WATER7_DIALOGS[game.index];
  if (!question) {
    game.status = "failure";
    return res.status(500).json({ error: "Estado de partida inválido." });
  }

  const isCorrect = question.correctOptionId === optionId;

  if (isCorrect) {
    game.index += 1;

    if (game.index >= WATER7_DIALOGS.length) {
      game.status = "victory";
      return res.json({
        correct: true,
        ...buildGamePayload(game, "¡Has traducido todo! Has desbloqueado la Isla 3."),
      });
    }

    return res.json({
      correct: true,
      ...buildGamePayload(game, `¡Correcto! Pregunta ${game.index + 1}/${WATER7_DIALOGS.length}.`),
    });
  }

  game.lives -= 1;

  if (game.lives <= 0) {
    game.status = "failure";
    game.lives = 0;
    return res.json({
      correct: false,
      ...buildGamePayload(game, "Te has quedado sin vidas. Reorganiza la estrategia y vuelve a intentarlo."),
    });
  }

  return res.json({
    correct: false,
    ...buildGamePayload(game, `¡Respuesta incorrecta! Te quedan ${game.lives} vidas. Inténtalo de nuevo.`),
  });
});

// ── Isla 1: Loguetown ─────────────────────────────────────────────────────

function initLoguetownGame(sessionObj) {
  sessionObj.loguetown = {
    lives: LOGUETOWN_MAX_LIVES,
    status: "in_progress",
  };
}

function getOrCreateLoguetownGame(req) {
  if (!req.session.loguetown) initLoguetownGame(req.session);
  return req.session.loguetown;
}

function shuffledPublicPhases() {
  return shuffle(LOGUETOWN_PHASES.map(({ id, label, description }) => ({ id, label, description })));
}

function sendLoguetownStart(req, res) {
  initLoguetownGame(req.session);
  const game = req.session.loguetown;
  res.json({
    status: game.status,
    lives: game.lives,
    phases: shuffledPublicPhases(),
    feedback: "Arrastra las tarjetas para ordenar las fases.",
  });
}

app.post("/api/loguetown/start", sendLoguetownStart);
app.get("/api/loguetown/start", sendLoguetownStart);

app.post("/api/loguetown/check", (req, res) => {
  const game = getOrCreateLoguetownGame(req);

  if (game.status !== "in_progress") {
    return res.status(409).json({ error: "La partida ya terminó. Inicia una nueva para continuar." });
  }

  const { order } = req.body || {};
  const validIds = new Set(LOGUETOWN_CORRECT_ORDER);

  if (
    !Array.isArray(order) ||
    order.length !== LOGUETOWN_CORRECT_ORDER.length ||
    !order.every((id) => typeof id === "string" && validIds.has(id))
  ) {
    return res.status(400).json({ error: "El orden enviado no es válido." });
  }

  const isCorrect = order.every((id, i) => id === LOGUETOWN_CORRECT_ORDER[i]);

  if (isCorrect) {
    game.status = "victory";
    return res.json({
      correct: true,
      status: game.status,
      lives: game.lives,
      feedback: "¡Has ordenado los mapas correctamente! Rumbo a la Isla 2...",
    });
  }

  game.lives -= 1;

  if (game.lives <= 0) {
    game.status = "failure";
    game.lives = 0;
    return res.json({
      correct: false,
      status: game.status,
      lives: game.lives,
      feedback: "¡Cuidado capitán! Hemos chocado contra un arrecife. Nos hemos quedado sin vidas en esta travesía.",
    });
  }

  return res.json({
    correct: false,
    status: game.status,
    lives: game.lives,
    feedback: `¡Cuidado capitán! Hemos chocado contra un arrecife. Nos quedan ${game.lives} vidas.`,
  });
});

// ── Isla 3: Sabaody ───────────────────────────────────────────────────────

function randomSabaodyEntry() {
  return SABAODY_BARREL_POOL[Math.floor(Math.random() * SABAODY_BARREL_POOL.length)];
}

function initSabaodyGame(sessionObj) {
  sessionObj.sabaody = {
    score: 0,
    lives: SABAODY_MAX_LIVES,
    status: "in_progress",
    barrels: {},
    retryBarrels: [],
  };
}

function getOrCreateSabaodyGame(req) {
  if (!req.session.sabaody) initSabaodyGame(req.session);
  return req.session.sabaody;
}

function saabodyStatePayload(game, extra = {}) {
  return {
    status: game.status,
    score: game.score,
    lives: game.lives,
    gameTimeSeconds: SABAODY_GAME_TIME_SECONDS,
    minScoreToWin: SABAODY_MIN_SCORE_TO_WIN,
    ...extra,
  };
}

app.post("/api/sabaody/start", (req, res) => {
  initSabaodyGame(req.session);
  const game = req.session.sabaody;
  res.json(
    saabodyStatePayload(game, {
      feedback: "Comienza la ronda: dispara solo a barriles de solucion.",
      feedbackTone: "neutral",
    })
  );
});

app.post("/api/sabaody/spawn", (req, res) => {
  const game = getOrCreateSabaodyGame(req);

  if (game.status !== "in_progress") {
    return res.status(409).json({
      error: "La partida ya terminó. Inicia una nueva para continuar.",
      ...saabodyStatePayload(game),
    });
  }

  // Reinsert missed solution barrels before pulling new random ones.
  const barrelEntry = game.retryBarrels.length > 0 ? game.retryBarrels.shift() : randomSabaodyEntry();
  const barrelId = crypto.randomUUID();
  game.barrels[barrelId] = {
    tipo: barrelEntry.tipo,
    texto: barrelEntry.texto,
  };

  return res.json(
    saabodyStatePayload(game, {
      barrel: {
        id: barrelId,
        texto: barrelEntry.texto,
      },
    })
  );
});

app.post("/api/sabaody/event", (req, res) => {
  const game = getOrCreateSabaodyGame(req);

  if (game.status !== "in_progress") {
    return res.status(409).json({
      error: "La partida ya terminó. Inicia una nueva para continuar.",
      ...saabodyStatePayload(game),
    });
  }

  const { barrelId, eventType } = req.body || {};
  if (!barrelId || typeof barrelId !== "string") {
    return res.status(400).json({ error: "barrelId es obligatorio." });
  }
  if (eventType !== "hit" && eventType !== "land") {
    return res.status(400).json({ error: "eventType debe ser 'hit' o 'land'." });
  }

  const barrelType = game.barrels[barrelId];
  if (!barrelType) {
    return res.status(404).json({ error: "Barril no encontrado o ya procesado." });
  }
  const barrelInfo = barrelType;
  const barrelKind = barrelInfo.tipo;
  delete game.barrels[barrelId];

  let feedback = "";
  let feedbackTone = "neutral";

  if (eventType === "hit") {
    if (barrelKind === "solucion") {
      game.score += 10;
      feedback = "¡Buen ojo! Solucion destruida";
      feedbackTone = "success";
    } else {
      game.score -= 5;
      game.lives -= 1;
      feedback = "¡Destruiste un requisito!";
      feedbackTone = "error";
    }
  } else if (barrelKind === "problema") {
    game.score += 10;
    feedback = "";
    feedbackTone = "neutral";
  } else {
    // If a solution barrel reaches the deck, recycle it to appear again later.
    game.retryBarrels.push(barrelInfo);
    feedback = "";
    feedbackTone = "neutral";
  }

  if (game.lives <= 0) {
    game.lives = 0;
    game.status = "failure";
  }

  return res.json(
    saabodyStatePayload(game, {
      feedback,
      feedbackTone,
    })
  );
});

app.post("/api/sabaody/finalize", (req, res) => {
  const game = getOrCreateSabaodyGame(req);

  if (game.status === "in_progress") {
    game.status = game.score >= SABAODY_MIN_SCORE_TO_WIN ? "victory" : "failure";
  }

  res.json(saabodyStatePayload(game));
});

// ── Isla 4: Whole Cake ─────────────────────────────────────────────────────

function toWholeCakePublicCard(card) {
  return {
    id: card.id,
    texto: card.texto,
  };
}

function syncWholeCakeTimer(game) {
  if (game.status !== "in_progress") return;

  const now = Date.now();
  const elapsedSeconds = Math.floor((now - game.lastTickAtMs) / 1000);
  if (elapsedSeconds <= 0) return;

  game.timeLeft = Math.max(0, game.timeLeft - elapsedSeconds);
  game.lastTickAtMs = now;

  if (game.timeLeft <= 0) {
    game.status = "failure";
  }
}

function initWholeCakeGame(sessionObj) {
  const shuffledDeck = shuffle(WHOLECAKE_REQUIREMENTS_POOL.map((c) => ({ ...c })));
  sessionObj.wholecake = {
    deck: shuffledDeck,
    cardIndex: 0,
    score: 0,
    timeLeft: WHOLECAKE_GAME_TIME_SECONDS,
    status: "in_progress",
    lastTickAtMs: Date.now(),
  };
}

function getOrCreateWholeCakeGame(req) {
  if (!req.session.wholecake) {
    initWholeCakeGame(req.session);
  }
  return req.session.wholecake;
}

function buildWholeCakePayload(game, feedback = "", feedbackTone = "neutral") {
  const totalCards = game.deck.length;
  const currentCard = game.status === "in_progress" ? game.deck[game.cardIndex] || null : null;

  return {
    status: game.status,
    score: game.score,
    timeLeft: game.timeLeft,
    initialTime: WHOLECAKE_GAME_TIME_SECONDS,
    maxTime: WHOLECAKE_MAX_TIME_SECONDS,
    currentCardNumber: Math.min(game.cardIndex + 1, totalCards),
    totalCards,
    card: currentCard ? toWholeCakePublicCard(currentCard) : null,
    feedback,
    feedbackTone,
  };
}

app.post("/api/wholecake/start", (req, res) => {
  initWholeCakeGame(req.session);
  const game = req.session.wholecake;
  res.json(buildWholeCakePayload(game));
});

app.post("/api/wholecake/swipe", (req, res) => {
  const game = getOrCreateWholeCakeGame(req);
  syncWholeCakeTimer(game);

  if (game.status !== "in_progress") {
    return res.status(409).json({
      error: "La partida ya terminó. Inicia una nueva para continuar.",
      ...buildWholeCakePayload(game),
    });
  }

  const { side } = req.body || {};
  if (side !== "left" && side !== "right") {
    return res.status(400).json({ error: "side debe ser 'left' o 'right'." });
  }

  const currentCard = game.deck[game.cardIndex];
  if (!currentCard) {
    game.status = "victory";
    return res.json(buildWholeCakePayload(game));
  }

  const guessedType = side === "left" ? "funcional" : "no-funcional";
  const isCorrect = guessedType === currentCard.tipo;

  let feedback = "";
  let feedbackTone = "neutral";

  if (isCorrect) {
    game.score += 10;
    game.timeLeft = Math.min(WHOLECAKE_MAX_TIME_SECONDS, game.timeLeft + WHOLECAKE_TIME_GAIN_ON_HIT);
    feedback = "¡Delicioso!";
    feedbackTone = "success";
  } else {
    game.timeLeft = Math.max(0, game.timeLeft - WHOLECAKE_TIME_PENALTY_ON_FAIL);
    feedback = "¡Sabor amargo!";
    feedbackTone = "error";
  }

  game.cardIndex += 1;
  game.lastTickAtMs = Date.now();

  if (game.timeLeft <= 0) {
    game.status = "failure";
  } else if (game.cardIndex >= game.deck.length) {
    game.status = "victory";
  }

  return res.json(buildWholeCakePayload(game, feedback, feedbackTone));
});

app.post("/api/wholecake/finalize", (req, res) => {
  const game = getOrCreateWholeCakeGame(req);
  syncWholeCakeTimer(game);

  if (game.status === "in_progress") {
    game.status = game.cardIndex >= game.deck.length ? "victory" : "failure";
  }

  res.json(buildWholeCakePayload(game));
});

// ── Isla 5: Wano ──────────────────────────────────────────────────────────

function normalizeWord(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function createWanoResolvedMap() {
  return WANO_REQUIREMENTS.reduce((acc, req) => {
    acc[req.id] = false;
    return acc;
  }, {});
}

function initWanoGame(sessionObj) {
  sessionObj.wano = {
    resolvedMap: createWanoResolvedMap(),
    lives: WANO_MAX_LIVES,
    score: 0,
    status: "in_progress",
    feedback: "Activa el Haki de Observacion y revisa el pergamino.",
  };
}

function getOrCreateWanoGame(req) {
  if (!req.session.wano) {
    initWanoGame(req.session);
  }
  return req.session.wano;
}

function buildWanoPayload(game, extra = {}) {
  const requirements = WANO_REQUIREMENTS.map((req) => ({
    id: req.id,
    text: req.text,
  }));

  const resolvedDetails = {};
  WANO_REQUIREMENTS.forEach((req) => {
    if (game.resolvedMap[req.id]) {
      resolvedDetails[req.id] = {
        replacement: req.replacement,
        reason: req.reason,
      };
    }
  });

  const solvedCount = Object.values(game.resolvedMap).filter(Boolean).length;

  return {
    status: game.status,
    lives: game.lives,
    maxLives: WANO_MAX_LIVES,
    score: game.score,
    totalTime: WANO_TOTAL_TIME,
    solvedCount,
    totalRequirements: WANO_REQUIREMENTS.length,
    resolvedMap: game.resolvedMap,
    resolvedDetails,
    requirements,
    feedback: game.feedback,
    ...extra,
  };
}

app.post("/api/wano/start", (req, res) => {
  initWanoGame(req.session);
  res.json(buildWanoPayload(req.session.wano));
});

app.post("/api/wano/cut", (req, res) => {
  const game = getOrCreateWanoGame(req);

  if (game.status !== "in_progress") {
    return res.status(409).json({
      error: "La partida ya termino. Inicia una nueva para continuar.",
      ...buildWanoPayload(game),
    });
  }

  const { requirementId, token } = req.body || {};
  if (!requirementId || typeof requirementId !== "string") {
    return res.status(400).json({ error: "requirementId es obligatorio." });
  }
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "token es obligatorio." });
  }

  const requirement = WANO_REQUIREMENTS.find((item) => item.id === requirementId);
  if (!requirement) {
    return res.status(400).json({ error: "requirementId invalido." });
  }

  if (game.resolvedMap[requirement.id]) {
    game.feedback = "Ese requisito ya fue corregido.";
    return res.json(buildWanoPayload(game));
  }

  const isCorrect = normalizeWord(token) === normalizeWord(requirement.targetWord);

  if (isCorrect) {
    game.resolvedMap[requirement.id] = true;
    game.score += 20;
    game.feedback = `Tajo preciso: "${requirement.targetWord}" ahora es verificable.`;

    const solvedCount = Object.values(game.resolvedMap).filter(Boolean).length;
    if (solvedCount >= WANO_REQUIREMENTS.length) {
      game.status = "victory";
    }

    return res.json(
      buildWanoPayload(game, {
        action: "success",
        actionRequirementId: requirement.id,
      })
    );
  }

  game.lives = Math.max(0, game.lives - 1);
  game.feedback = "Tajo errado: esa palabra no era ambigua.";
  if (game.lives <= 0) {
    game.status = "failure";
  }

  return res.json(
    buildWanoPayload(game, {
      action: "error",
      actionRequirementId: requirement.id,
    })
  );
});

app.post("/api/wano/finalize", (req, res) => {
  const game = getOrCreateWanoGame(req);

  if (game.status === "in_progress") {
    game.status = "failure";
  }

  res.json(buildWanoPayload(game));
});

// ── Isla 6: EggHead ───────────────────────────────────────────────────────

const EGGHEAD_TOTAL_REQUIRED_LINKS = EGGHEAD_REQUIREMENTS.reduce(
  (acc, req) => acc + req.affectedArtifacts.length,
  0
);

function createEggHeadEmptyLinks() {
  return EGGHEAD_REQUIREMENTS.reduce((acc, req) => {
    acc[req.id] = [];
    return acc;
  }, {});
}

function toPublicEggHeadRequirement(req) {
  return {
    id: req.id,
    code: req.code,
    name: req.name,
    status: req.status,
    brief: req.brief,
  };
}

function initEggHeadGame(sessionObj) {
  sessionObj.egghead = {
    selectedReqId: null,
    linksByReq: createEggHeadEmptyLinks(),
    errors: 0,
    status: "in_progress",
    feedback: "Selecciona un requisito y enlaza sus artefactos como en una matriz DOORS.",
  };
}

function getOrCreateEggHeadGame(req) {
  if (!req.session.egghead) {
    initEggHeadGame(req.session);
  }
  return req.session.egghead;
}

function buildEggHeadPayload(game, extra = {}) {
  const linkedCount = Object.values(game.linksByReq).reduce((acc, links) => acc + links.length, 0);
  const completedRequirements = EGGHEAD_REQUIREMENTS.filter(
    (req) => (game.linksByReq[req.id] || []).length === req.affectedArtifacts.length
  ).length;

  return {
    status: game.status,
    selectedReqId: game.selectedReqId,
    linksByReq: game.linksByReq,
    errors: game.errors,
    maxErrors: EGGHEAD_MAX_ERRORS,
    linkedCount,
    completedRequirements,
    totalRequiredLinks: EGGHEAD_TOTAL_REQUIRED_LINKS,
    requirements: EGGHEAD_REQUIREMENTS.map(toPublicEggHeadRequirement),
    artifacts: EGGHEAD_ARTIFACTS,
    feedback: game.feedback,
    ...extra,
  };
}

function registerEggHeadError(game, feedback, artifactId) {
  game.errors += 1;
  game.feedback = feedback;
  if (game.errors >= EGGHEAD_MAX_ERRORS) {
    game.status = "failure";
  }

  return buildEggHeadPayload(game, {
    wrongArtifactId: artifactId,
  });
}

app.post("/api/egghead/start", (req, res) => {
  initEggHeadGame(req.session);
  res.json(buildEggHeadPayload(req.session.egghead));
});

app.post("/api/egghead/select", (req, res) => {
  const game = getOrCreateEggHeadGame(req);

  if (game.status !== "in_progress") {
    return res.status(409).json({
      error: "La partida ya terminó. Inicia una nueva para continuar.",
      ...buildEggHeadPayload(game),
    });
  }

  const { reqId } = req.body || {};
  const selectedReq = EGGHEAD_REQUIREMENTS.find((reqItem) => reqItem.id === reqId);

  if (!selectedReq) {
    return res.status(400).json({ error: "reqId invalido." });
  }

  game.selectedReqId = selectedReq.id;
  game.feedback = `${selectedReq.code} activo: analiza su descripcion y deduce que artefactos deben actualizarse.`;

  return res.json(buildEggHeadPayload(game));
});

app.post("/api/egghead/artifact", (req, res) => {
  const game = getOrCreateEggHeadGame(req);

  if (game.status !== "in_progress") {
    return res.status(409).json({
      error: "La partida ya terminó. Inicia una nueva para continuar.",
      ...buildEggHeadPayload(game),
    });
  }

  const { artifactId } = req.body || {};
  const artifact = EGGHEAD_ARTIFACTS.find((item) => item.id === artifactId);

  if (!artifact) {
    return res.status(400).json({ error: "artifactId invalido." });
  }

  if (!game.selectedReqId) {
    return res.json(
      registerEggHeadError(game, "Activa un requisito primero para crear una traza valida.", artifact.id)
    );
  }

  const selectedReq = EGGHEAD_REQUIREMENTS.find((item) => item.id === game.selectedReqId);
  const linkedForReq = game.linksByReq[selectedReq.id] || [];

  if (linkedForReq.includes(artifact.id)) {
    game.feedback = "Este enlace ya estaba registrado en la matriz.";
    return res.json(buildEggHeadPayload(game));
  }

  const isExpected = selectedReq.affectedArtifacts.includes(artifact.id);

  if (!isExpected) {
    return res.json(
      registerEggHeadError(
        game,
        `Enlace invalido: ${artifact.name} no esta impactado por ${selectedReq.code}.`,
        artifact.id
      )
    );
  }

  game.linksByReq[selectedReq.id] = [...linkedForReq, artifact.id];
  game.feedback = `Traza creada: ${selectedReq.code} -> ${artifact.name}`;

  const linkedCount = Object.values(game.linksByReq).reduce((acc, links) => acc + links.length, 0);
  if (linkedCount >= EGGHEAD_TOTAL_REQUIRED_LINKS) {
    game.status = "victory";
  }

  return res.json(buildEggHeadPayload(game));
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

const runningOnVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

if (!runningOnVercel) {
  app.listen(PORT, () => {
    console.log(`ReqPiece backend listening on http://localhost:${PORT}`);
  });
}

export default app;
