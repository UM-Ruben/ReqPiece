# ReqPiece

Aplicacion educativa interactiva inspirada en One Piece para aprender Ingenieria de Requisitos mediante minijuegos narrativos.

## Resumen

ReqPiece propone un recorrido por 7 islas, cada una asociada a un concepto clave de analisis y especificacion de requisitos (SRS, IEEE 830, trazabilidad y validacion).

Objetivos del proyecto:
- Convertir teoria de requisitos en practica guiada.
- Reforzar aprendizaje mediante mecanicas de juego.
- Mantener progreso secuencial con persistencia local.
- Proteger la logica sensible de validacion en backend.

## Caracteristicas principales

- Experiencia por islas con narrativa previa en cada fase.
- Minijuegos variados con temporizador, vidas y feedback inmediato.
- Desbloqueo secuencial de progreso entre islas.
- Persistencia de estado en localStorage con validacion de integridad.
- Rutas protegidas para evitar acceso a islas bloqueadas.
- Validacion server-side en islas migradas para ocultar respuestas.

## Arquitectura

Frontend:
- React 18 + Vite 7
- Tailwind CSS + Framer Motion
- Navegacion SPA con rutas por isla

Backend:
- Express 5
- express-session para estado de partida por sesion
- Endpoints por isla para validacion de reglas y respuestas

## Estructura del repositorio

```text
.
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vite.config.js
|-- public/
|   -- audio/
|-- server/
|   |-- index.js
|   |-- loguetownData.js
|   |-- sabaodyData.js
|   |-- water7Dialogs.js
|   |-- wholeCakeData.js
|   |-- eggheadData.js
|   -- wanoData.js
-- src/
    |-- App.jsx
    |-- main.jsx
    |-- index.css
    |-- components/
    |   |-- IslandIntro.jsx
    |   |-- Isla1Loguetown.jsx
    |   |-- Isla2Water7.jsx
    |   |-- Isla3Sabaody.jsx
    |   |-- Isla4BigMom.jsx
    |   |-- Isla5Wano.jsx
    |   |-- Isla6EggHead.jsx
    |   -- Isla7LaughTale.jsx
    |-- data/
    |   -- islandIntroData.js
    |-- hooks/
    |   -- usePirateAudio.js
    -- image/
```

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalacion

```bash
npm install
```

## Ejecucion en desarrollo

1. Frontend (Vite):

```bash
npm run dev
```

2. Backend API (Express, con watch):

```bash
npm run dev:api
```

3. Abrir aplicacion en navegador:

- Frontend: http://localhost:5173
- API: http://localhost:3001 (segun configuracion de server)

## Scripts disponibles

| Script | Descripcion |
|---|---|
| npm run dev | Inicia frontend en modo desarrollo |
| npm run dev:api | Inicia backend con recarga automatica |
| npm run build | Genera build de produccion |
| npm run preview | Sirve localmente la build de produccion |
| npm run start:api | Inicia backend en modo normal |

## Flujo de juego

1. El jugador entra al menu principal.
2. Selecciona una isla desbloqueada.
3. Visualiza la introduccion narrativa.
4. Completa el minijuego asociado.
5. Si supera la isla, desbloquea la siguiente.
6. El progreso queda guardado localmente.

## Islas y enfoque didactico

| Isla | Tema |
|---|---|
| Isla 1 - Loguetown | Orden del ciclo de vida de requisitos |
| Isla 2 - Water 7 | Traduccion de necesidades a requisitos tecnicos |
| Isla 3 - Sabaody | Diferenciar QUE (requisito) vs COMO (solucion) |
| Isla 4 - Whole Cake | Clasificacion funcional vs no funcional |
| Isla 5 - Wano | Ambiguedad y verificabilidad (IEEE 830) |
| Isla 6 - EggHead | Trazabilidad y analisis de impacto |
| Isla 7 - Laugh Tale | Cierre narrativo y consolidacion |

## Seguridad y proteccion de respuestas

Se aplica una estrategia mixta:
- Endurecimiento de build en frontend (sin sourcemaps en produccion, minificacion, limpieza de debug).
- Validacion en backend para evitar exponer respuestas en cliente.
- Estado de sesion en servidor para controlar partidas.

Nota tecnica:
- En una SPA, cualquier logica puramente cliente puede inspeccionarse.
- Para contenido sensible, la validacion debe residir en backend.
