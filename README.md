# ReqPiece - En Busca del One Spec

Juego educativo desarrollado en React utilizando Tailwind CSS y Framer Motion. El jugador recorre islas donde se enfrentan minijuegos relacionados con conceptos de Ingeniería de Requisitos (GPDS).

## Estructura del proyecto

```
index.html
package.json
postcss.config.js
tailwind.config.js
vite.config.js
src/
  App.jsx                   # flujo principal y navegación entre islas
  index.css
  main.jsx
  components/
    Isla1Loguetown.jsx      # minijuego activo
    Isla2Water7.jsx         # minijuego activo
    Isla3EniesLobby.jsx     # en construcción
    Isla4Sabaody.jsx        # en construcción
    Isla5ImpelDown.jsx      # en construcción
    Isla6LaughTale.jsx      # pantalla final
  hooks/
    usePirateAudio.js       # efectos de sonido (click, error, éxito)
  image/
    isla1Acierto.png
    isla1Fallo.png
    isla2Acierto.png
    isla2Fallo.png
```

## Instalación y ejecución

```bash
npm install
npm run dev          # arranca el servidor de desarrollo
npm run build        # genera la versión de producción
npm run preview      # sirve la build localmente
```

## Cómo jugar

1. Desde el menú principal, selecciona una isla desbloqueada.
2. Completa el minijuego. Dispones de **3 vidas** por isla.
3. Al ganar se muestra una imagen de acierto y se desbloquea la siguiente isla.  
   Al perder todas las vidas se muestra una imagen de fallo con opción de reintentar.

### Isla 1 — Loguetown: *Ordena los mapas*

Arrastra las tarjetas para ordenar las **4 fases del ciclo de vida de requisitos**:  
`Obtención → Análisis → Especificación → Validación`

- Pulsa **¡Zarpar!** para comprobar el orden.
- Cada intento incorrecto resta 1 vida.
- Al agotar las 3 vidas se muestra la imagen `isla1Fallo.png`.
- Al ordenarlas correctamente se muestra `isla1Acierto.png` y se desbloquea la Isla 2.

### Isla 2 — Water 7: *Traduce el diálogo*

Se muestran frases de un cliente o programador y debes elegir la **traducción técnica correcta** entre 3 opciones.

- Hay **3 preguntas** que deben responderse en orden.
- **No se avanza a la siguiente pregunta hasta acertar la actual.**
- Cada respuesta incorrecta resta 1 vida; las opciones se vuelven a barajar.
- Al agotar las 3 vidas se muestra la imagen `isla2Fallo.png`.
- Al superar las 3 preguntas se muestra `isla2Acierto.png` y se desbloquea la Isla 3.

### Islas 3–6

Actualmente en construcción. Permiten avanzar directamente al siguiente desafío.
