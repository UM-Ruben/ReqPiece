import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import session from "express-session";
import { MAX_LIVES, WATER7_DIALOGS } from "./water7Dialogs.js";

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

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`ReqPiece backend listening on http://localhost:${PORT}`);
});
