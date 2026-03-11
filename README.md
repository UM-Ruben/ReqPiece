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
    Isla3Sabaody.jsx        # minijuego activo
    Isla4BigMom.jsx         # minijuego activo
    Isla5Wano.jsx           # minijuego activo
    Isla6EggHead.jsx        # minijuego activo
    Isla7LaughTale.jsx      # pantalla final
  hooks/
    usePirateAudio.js       # efectos de sonido (click, error, éxito)
  image/
    isla1Acierto.png
    isla1Fallo.png
    isla2Acierto.png
    isla2Fallo.png
    isla3Acierto.png
    isla3Fallo.png
    isla4BigMomAcierto.png
    isla4BigMomFallo.png
    isla5KaidoAcierto.png
    isla5KaidoFallo.png
    isla6VegapunkAcierto.png
    isla6VegapunkFallo.png
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
2. Las 7 islas aparecen listadas con estado `Desbloqueada` o `Bloqueada`.
3. El progreso es secuencial: cada isla desbloquea la siguiente al completarse.
4. Al ganar una isla se muestra su imagen de acierto y el botón **Siguiente isla**.
5. Al pulsar **Siguiente isla**, vuelves al inicio (menú) para elegir manualmente la siguiente isla ya desbloqueada.
6. Si fallas una isla, se muestra su imagen de fallo y opción de reintentar.
7. La Isla 7 actúa como cierre del recorrido y conduce a la pantalla final de victoria.

## Flujo de progresión

- `Isla 1` desbloquea `Isla 2`
- `Isla 2` desbloquea `Isla 3`
- `Isla 3` desbloquea `Isla 4`
- `Isla 4` desbloquea `Isla 5`
- `Isla 5` desbloquea `Isla 6`
- `Isla 6` desbloquea `Isla 7`

### Isla 1 — Loguetown

Arrastra las tarjetas para ordenar las **4 fases del ciclo de vida de requisitos**:`Obtención → Análisis → Especificación → Validación`

- Pulsa **¡Zarpar!** para comprobar el orden.
- Cada intento incorrecto resta 1 vida.
- Al agotar las 3 vidas se muestra la imagen `isla1Fallo.png`.
- Al ordenarlas correctamente se muestra `isla1Acierto.png` y se desbloquea la Isla 2.
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 2 — Water 7

Se muestran frases de un cliente o programador y debes elegir la **traducción técnica correcta** entre 3 opciones.

- Hay **3 preguntas** que deben responderse en orden.
- **No se avanza a la siguiente pregunta hasta acertar la actual.**
- Cada respuesta incorrecta resta 1 vida; las opciones se vuelven a barajar.
- Al agotar las 3 vidas se muestra la imagen `isla2Fallo.png`.
- Al superar las 3 preguntas se muestra `isla2Acierto.png` y se desbloquea la Isla 3.
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 3 — Archipielago Sabaody

- Destruye barriles de **solución** y deja caer barriles de **problema**.
- Puntaje y temporizador de 60s.
- Condición de victoria accesible: alcanzar el puntaje mínimo antes de terminar el tiempo.
- Al terminar, muestra imagen de acierto (`isla3Acierto.png`) o fallo (`isla3Fallo.png`).
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 4 — Whole Cake

- Arrastra cada tarjeta al caldero izquierdo (**Funcional**) o derecho (**No Funcional**).
- Soporte de drag con ratón y táctil.
- Acierto: +10 puntos y recuperación de tiempo.
- Error: penalización de tiempo.
- Termina al quedarse sin tiempo o al clasificar todas las tarjetas.
- Muestra `isla4BigMomAcierto.png` o `isla4BigMomFallo.png` según resultado.
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 5 — Wano

- Objetivo educativo: validar requisitos según IEEE 830 (no ambiguos, verificables y consistentes).
- Mecánica de "Haki de Observación": inspecciona un pergamino y encuentra términos ambiguos.
- Al hacer clic sobre el término correcto, se ejecuta un "tajo" visual y se reemplaza por una métrica técnica comprobable.
- Incluye diálogo introductorio con Queen y King en tono autoritario pirata.
- Temporizador de incursión, puntaje por corrección y progreso de términos corregidos.
- Usa imágenes `isla5KaidoAcierto.png` y `isla5KaidoFallo.png`.
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 6 — EggHead

- Objetivo educativo: identificar qué artefactos del sistema se ven afectados por un cambio de requisito.
- Mecánica principal: activa el `REQ-04` modificado y selecciona únicamente los artefactos impactados.
- Hay **3 artefactos correctos** y un máximo de **3 strikes** antes del game over.
- Los artefactos erróneos producen feedback visual con sacudida y resaltado rojo.
- Al completar correctamente la trazabilidad se muestra `isla6VegapunkAcierto.png`.
- Al agotar los intentos se muestra `isla6VegapunkFallo.png` con opción de reintentar o salir al menú.
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 7 — Laugh Tale

- Pantalla final previa a la victoria absoluta del juego.
- Funciona como cierre narrativo de la travesía tras completar EggHead.
- Desde aquí se accede a la pantalla final donde se reclama el **One Spec**.
