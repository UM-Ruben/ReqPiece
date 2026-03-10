# ReqPiece - En Busca del One Spec

Juego educativo desarrollado en React utilizando Tailwind CSS y Framer Motion. El jugador recorre islas donde se enfrentan minijuegos relacionados con conceptos de Ingeniería de Requisitos (GPDS).

## Estructura del proyecto

- `src/` contiene los archivos de aplicación y componente.
  - `App.jsx` controla el flujo principal y la navegación entre islas.
  - `components/` alberga los minijuegos (`Isla1Loguetown.jsx`, `Isla2Water7.jsx`, etc.).
  - `hooks/` incluye utilidades como `usePirateAudio.js` para efectos de sonido.
- `index.html`, configuración de Vite, Tailwind y PostCSS.

## Instalación y ejecución

```bash
npm install
npm run dev          # arranca el servidor de desarrollo
npm run build        # genera la versión de producción
npm run preview      # sirve la build localmente
```

## Cómo jugar

1. Elige una isla desde el menú principal.
2. Completa el minijuego correspondiente:
   - **Isla 1 (Loguetown):** ordena fases del ciclo de requisitos.
   - **Isla 2 (Water 7):** traduce frases entre cliente y programador, con temporizador.
3. Al ganar, se desbloquea la siguiente isla. Si se pierde, se ofrece reintento.
