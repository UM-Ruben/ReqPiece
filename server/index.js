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

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "..", "dist");

app.disable("x-powered-by");
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

app.post("/api/loguetown/start", (req, res) => {
  initLoguetownGame(req.session);
  const game = req.session.loguetown;
  res.json({
    status: game.status,
    lives: game.lives,
    phases: shuffledPublicPhases(),
    feedback: "Arrastra las tarjetas para ordenar las fases.",
  });
});

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

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`ReqPiece backend listening on http://localhost:${PORT}`);
});
