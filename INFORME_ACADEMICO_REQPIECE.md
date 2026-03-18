# Informe de evaluación didáctica del juego **ReqPiece, en busca del One Spec**

**Proyecto analizado:** ReqPiece, en busca del One Spec

---

## 1) Identificación

- **Nombre del juego:** ReqPiece, en busca del One Spec
- **Idiomas disponibles:**
  - **Español** (interfaz, narrativa y minijuegos).
- **Autores / organismo:** Rubén Fernández García y Aarón Ruiz Martínez
- **Fuentes para recuperar información sobre el juego (primarias):**
  - `README.md` (resumen, arquitectura, objetivos didácticos, flujo).
  - `GUIA_DEL_JUEGO.md` (normas, mapa de islas y recomendaciones de uso).
  - `src/App.jsx` y `src/components/*` (mecánicas de juego, rutas y desbloqueo).
  - `server/index.js` y `server/*Data.js` (reglas de validación, tiempos, vidas, puntuación y lógica de cada isla).
  - Ejecución local: `http://localhost:5173` (frontend) + `http://localhost:3001` (API).

- **Referencias bibliográficas/técnicas relacionadas** Material de teoría de la asignatura GPDS y ambiente del universo de One Piece.
---

## 2) Objetivo / Descripción del juego

ReqPiece es un juego serio inspirado en el universo de *One Piece* para entrenar competencias de **Ingeniería de Requisitos** mediante 6 islas secuenciales. Cada isla representa una habilidad concreta:

- Ordenación del ciclo de vida de requisitos.
- Traducción de lenguaje del cliente a requisitos técnicos verificables.
- Distinción entre **problema/requisito (QUÉ)** y **solución (CÓMO)**.
- Clasificación funcional vs no funcional.
- Eliminación de ambigüedad y mejora de verificabilidad (enfoque IEEE 830 / calidad de requisitos).
- Trazabilidad y análisis de impacto tipo matriz (estilo DOORS).

La progresión está controlada mediante vidas, puntuación y temporizadores.

---

## 3) Tipo de juego

- **Plataforma principal:** juego **web online/local** (SPA React + backend Express).
- **Modalidad técnica:**
  - Se ejecuta en navegador (no requiere instalación nativa de escritorio ni app móvil nativa).
  - Puede usarse en PC de aula y, previsiblemente, en móvil/tablet si el navegador lo soporta (sin versión móvil nativa dedicada).
- **Modalidad didáctica:** apto para actividad **individual** y también **grupal** (por parejas o equipos).

---

## 4) Duración de una sesión/partida

Duración estimada basada en reglas implementadas en código:

- **Isla 1 (Loguetown):** ~3–6 min (3 vidas, ordenación de fases).
- **Isla 2 (Water 7):** ~8–12 min (10 preguntas, 5 vidas).
- **Isla 3 (Sabaody):** ~2–5 min (tiempo fijo 45 s + inicio/cierre).
- **Isla 4 (Whole Cake):** ~3–6 min (base 40 s, hasta 60 s por aciertos, deck de 12 tarjetas).
- **Isla 5 (Wano):** ~4–7 min (temporizador 45 s, 8 requisitos, 2 vidas).
- **Isla 6 (EggHead):** ~6–10 min (matriz de trazabilidad, 4 requisitos, límite 3 errores).

**Duración total recomendada de una partida completa:** **30–45 minutos** (sin contar explicación inicial docente).

---

## 5) Relación con la asignatura

### a) Ingeniería de Requisitos

- Elicitación y clarificación semántica (cliente ↔ analista).
- Calidad de requisitos (no ambigüedad, consistencia, verificabilidad).
- Requisitos funcionales y no funcionales.
- Trazabilidad y análisis de impacto.
- Vínculo con prácticas SRS y criterios de calidad tipo IEEE 830.

### b) Gestión de proyectos

- Apoya comprensión de riesgo por mala especificación.
- Introduce impacto de cambios de requisitos sobre artefactos y esfuerzo.
- Menor foco explícito en planificación, costes, cronograma o contratación.

---

## 6) Estrategias de uso en clase

### Estrategia A — Clase teórica con demostración guiada (50–60 min)

1. 10–15 min de marco conceptual (tipos/calidad de requisitos).
2. 20–25 min de partida en directo (islas seleccionadas).
3. 15–20 min de comentarios: errores comunes y lecciones aprendidas.

### Estrategia B — Práctica en laboratorio (90 min)

1. Equipos de 2 estudiantes, una partida completa por equipo.
2. Registro de decisiones erróneas y justificación de correcciones.
3. Cierre con miniinforme, un SRS pequeño bien redactado.


### Estrategia C — Actividad individual evaluable

- Juego autónomo fuera de clase + entrega de reflexión corta:
  - 3 ambigüedades detectadas y su reformulación verificable.
  - 1 ejemplo de análisis de impacto.
  - autoevaluación de fortalezas/debilidades

---

## 7) Riesgos de uso en la asignatura

### Riesgos técnicos

- Dependencia de ejecución web y servidor (si no está desplegado, exige configuración local).
- Posibles problemas de red o puertos en laboratorios restringidos.
- Dependencia de navegador y permisos de audio/autoplay.
- Persistencia local en navegador (`localStorage`) susceptible de borrado o bloqueo.

### Riesgos docentes/pedagógicos

- Efecto “juego” por encima del objetivo formativo si no se aprende de los errores.
- Posible simplificación excesiva de conceptos complejos.
- Curva de dificultad desigual entre estudiantes.
- Riesgo de memorización de respuestas, sin aprender, mediante fallo-corrección.

### Mitigación recomendada

- Preparar guía docente y rúbrica de reflexión posterior.
- Integrar el juego en una secuencia didáctica, o como una actividad extra (como en la actividad de la isla).

---

## 8) Otros comentarios

- **¿Es suficiente la información suministrada para abordar el juego?**
  - Para uso práctico básico, **sí** (README + guía + ejecución local + código).
  - Para memoria académica formal, falta completar metadatos de autoría/organismo y versión pública oficial.
---

## 9) Conclusión — Resumen ejecutivo (máx. 1/2 página)

ReqPiece es una propuesta sólida y tremendamente práctica para apoyar la docencia en la asignatura. Su mayor ventaja es que logra adecuar conceptos que suelen resultar bastante abstractos (como la ambigüedad, la verificabilidad, la trazabilidad o la diferencia entre requisitos funcionales y no funcionales), transformándolos en acciones concretas. Al ofrecer una respuesta inmediata, consigue que los alumnos participen de forma activa y se mantengan motivados (el exámen teórico de conducir se aprende de forma parecida). Además, su diseño estructurado por "islas" que se van desbloqueando ayuda a que el aprendizaje siga un orden lógico. Como las partidas duran entre 20 y 45 minutos, resulta ideal para encajarla como actividad complementaria.

Si pensamos en su aplicación directa en la asignatura, el encaje es perfecto. Aunque los ejemplos que utiliza no son excesivamente complejos, esto tiene una gran ventaja: los conceptos clave se captan al vuelo identificando "patrones". ¿Qué es exactamente un requisito funcional? ¿Y uno no funcional? ¿En qué se diferencian? A base de ensayo y error, estas dudas se resuelven rápidamente, sentando las bases para que los estudiantes aprendan a redactar un SRS impecable y con el contenido correcto.

En definitiva, le hemos puesto mucha dedicación para asegurarnos de que la herramienta sea realmente útil. Nuestra intención es que se integre en el aula no solo para practicar conceptos, sino también para generar debates técnicos, pudiendo usarse de forma recurrente o incluso como método de evaluación. Por si fuera poco, los profesores tienen total libertad para modificar los ejemplos propuestos, ya sea para subir el nivel de dificultad o para adaptarlos a un SRS específico que estén trabajando con los alumnos.