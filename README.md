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
    IslandIntro.jsx         # pantalla de introducción narrativa
    Isla1Loguetown.jsx      # minijuego activo
    Isla2Water7.jsx         # minijuego activo
    Isla3Sabaody.jsx        # minijuego activo
    Isla4BigMom.jsx         # minijuego activo
    Isla5Wano.jsx           # minijuego activo
    Isla6EggHead.jsx        # minijuego activo
    Isla7LaughTale.jsx      # pantalla final
  data/
    islandIntroData.js      # textos narrativos de cada isla
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
npm install prop-types
npm run dev          # arranca el servidor de desarrollo
npm run build        # genera la versión de producción
npm run preview      # sirve la build localmente
```

### Dependencias principales

- **React** - Librería de UI
- **Framer Motion** - Animaciones fluidas
- **Lucide React** - Iconos
- **Tailwind CSS** - Estilos
- **Vite** - Build tool
- **prop-types** - Validación de props (necesario para IslandIntro.jsx)

Si instalas el proyecto desde cero, todas las dependencias se instalarán automáticamente con `npm install`, exceptuando las de prop-types, por ello también has de ejecutar `npm install prop-types`.

## Cómo jugar

1. Desde el menú principal, selecciona una isla desbloqueada.
2. **Nueva funcionalidad**: Al entrar a una isla, primero verás una pantalla de introducción narrativa que fusiona la historia de One Piece con el concepto de Ingeniería de Requisitos que aprenderás.
3. Tras leer la introducción, pulsa el botón CTA (Call-To-Action) para iniciar el minijuego.
4. Las 7 islas aparecen listadas con estado `Desbloqueada` o `Bloqueada`.
5. El progreso es secuencial: cada isla desbloquea la siguiente al completarse.
6. Al ganar una isla se muestra su imagen de acierto y el botón **Siguiente isla**.
7. Al pulsar **Siguiente isla**, vuelves al inicio (menú) para elegir manualmente la siguiente isla ya desbloqueada.
8. Si fallas una isla, se muestra su imagen de fallo y opción de reintentar.
9. La Isla 7 actúa como cierre del recorrido y conduce a la pantalla final de victoria.

## Flujo de progresión

- `Isla 1` desbloquea `Isla 2`
- `Isla 2` desbloquea `Isla 3`
- `Isla 3` desbloquea `Isla 4`
- `Isla 4` desbloquea `Isla 5`
- `Isla 5` desbloquea `Isla 6`
- `Isla 6` desbloquea `Isla 7`

## Pantallas de introducción narrativa

Cada isla cuenta con una pantalla de introducción épica que aparece antes del minijuego. Estas pantallas fusionan la narrativa de One Piece con conceptos específicos de Ingeniería de Requisitos (SRS):

### 🏴‍☠️ Isla 1: Loguetown - "LA CIUDAD DEL PRINCIPIO Y EL FIN"
**Enfoque SRS**: Recolección inicial de requisitos, visión del cliente y definición del alcance del proyecto.  
**Narrativa**: El inicio de la gran aventura donde Gold Roger pronunció sus últimas palabras. Aquí aprendes a trazar tu ruta con el Log Pose del SRS.

### 🔧 Isla 2: Water 7 - "LOS MAESTROS CARPINTEROS DE GALLEY-LA"
**Enfoque SRS**: Requisitos no funcionales (rendimiento, seguridad, resistencia) y especificaciones técnicas.  
**Narrativa**: Los carpinteros de Galley-La necesitan especificaciones precisas, no sueños. Debes traducir anhelos en requisitos técnicos concretos.

### ⚡ Isla 3: Archipiélago Sabaody - "EL ENCUENTRO DE LAS SUPERNOVAS"
**Enfoque SRS**: Casos de uso complejos, priorización de requisitos (MoSCoW) y gestión de múltiples stakeholders.  
**Narrativa**: Once Supernovas con ambiciones diferentes. Aprenderás a distinguir entre requisitos (QUÉ) y soluciones técnicas (CÓMO).

### 🍰 Isla 4: Whole Cake - "LA IRA DE BIG MOM"
**Enfoque SRS**: Gestión de requisitos volátiles y manejo de cambios de última hora.  
**Narrativa**: Big Mom y su hambre insaciable. Los clientes son como Yonkos: poderosos e impredecibles. Clasifica requisitos funcionales y no funcionales antes de que sea tarde.

### ⚔️ Isla 5: Wano - "LA FORTALEZA DE ONIGASHIMA"
**Enfoque SRS**: Restricciones del sistema, trazabilidad bajo condiciones extremas y validación según IEEE 830.  
**Narrativa**: Para derrocar a Kaido y su sistema legacy, necesitas requisitos verificables, no ambiguos, completos y consistentes. La trazabilidad es tu katana.

### 🔬 Isla 6: Egghead - "EL LABORATORIO DEL FUTURO CORROMPIDO"
**Enfoque SRS**: Documentación de sistemas complejos, requisitos de interfaces externas (APIs) y detección de ambigüedades.  
**Narrativa**: La tecnología de Vegapunk corrompida. Sistemas cuánticos, APIs engañosas y trampas lógicas. Un requisito mal interpretado explota instantáneamente.

### 👑 Isla 7: Laugh Tale - "EL TESORO FINAL: EL ONE SPEC"
**Enfoque SRS**: Consolidación del Documento SRS perfecto. Proyecto finalizado, validado y listo para ser leyenda.  
**Narrativa**: El lugar donde Gold Roger dejó su legado. Aquí reclamarás el One Spec y serás coronado como el Rey de los Analistas.

---

## Descripción detallada de minijuegos

### Isla 1 — Loguetown: *Ordena los mapas*

Arrastra las tarjetas para ordenar las **4 fases del ciclo de vida de requisitos**:`Obtención → Análisis → Especificación → Validación`

- Pulsa **¡Zarpar!** para comprobar el orden.
- Cada intento incorrecto resta 1 vida.
- Al agotar las 3 vidas se muestra la imagen `isla1Fallo.png`.
- Al ordenarlas correctamente se muestra `isla1Acierto.png` y se desbloquea la Isla 2.
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 2 — Water 7: *Traduce el diálogo*

Se muestran frases de un cliente o programador y debes elegir la **traducción técnica correcta** entre 3 opciones.

- Hay **3 preguntas** que deben responderse en orden.
- **No se avanza a la siguiente pregunta hasta acertar la actual.**
- Cada respuesta incorrecta resta 1 vida; las opciones se vuelven a barajar.
- Al agotar las 3 vidas se muestra la imagen `isla2Fallo.png`.
- Al superar las 3 preguntas se muestra `isla2Acierto.png` y se desbloquea la Isla 3.
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 3 — Archipielago Sabaody: *Shooter QUE vs COMO*

- Destruye barriles de **solución** y deja caer barriles de **problema**.
- Puntaje y temporizador de 60s.
- Condición de victoria accesible: alcanzar el puntaje mínimo antes de terminar el tiempo.
- Al terminar, muestra imagen de acierto (`isla3Acierto.png`) o fallo (`isla3Fallo.png`).
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 4 — Whole Cake: *Swipe Funcional vs No Funcional*

- Arrastra cada tarjeta al caldero izquierdo (**Funcional**) o derecho (**No Funcional**).
- Soporte de drag con ratón y táctil.
- Acierto: +10 puntos y recuperación de tiempo.
- Error: penalización de tiempo.
- Termina al quedarse sin tiempo o al clasificar todas las tarjetas.
- Muestra `isla4BigMomAcierto.png` o `isla4BigMomFallo.png` según resultado.
- Al ganar, aparece el botón **Siguiente isla**.

### Isla 5 — Wano (Onigashima): *El corte de la precision (IEEE 830)*

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

---

## Componente IslandIntro (Pantallas de Introducción)

### Descripción técnica

El componente `IslandIntro.jsx` es una pantalla narrativa épica que aparece antes de cada minijuego. Utiliza **Framer Motion** para animaciones suaves y **Lucide React** para iconos decorativos.

### Características del componente:

- **Animaciones de entrada**: Scale y opacity con delays escalonados para crear un efecto de "revelación" épico
- **Diseño temático**: Estilo pergamino pirata con bordes dorados, gradientes cálidos y tipografía bold uppercase
- **Estructura narrativa**:
  - Subtítulo (nombre de la isla)
  - Título épico principal
  - Separador decorativo con iconos
  - 2 párrafos de descripción narrativa
  - Botón CTA personalizado por isla
  - Decoración inferior

### Props del componente:

```jsx
<IslandIntro 
  islandKey="isla1"      // 'isla1' hasta 'isla7'
  onStart={handleStart}  // función que se ejecuta al pulsar el CTA
  playClick={playClick}  // opcional: audio feedback
/>
```

### Integración en App.jsx:

Se añadió un estado `showingIntro` que controla la visibilidad de la introducción:

```jsx
const [showingIntro, setShowingIntro] = useState(false);

// Al hacer clic en una isla desde el menú
const goToIsland = (islandKey) => {
  setCurrentScreen(islandKey);
  setShowingIntro(true);  // Muestra la intro primero
};

// Al pulsar el CTA de la introducción
const startIsland = () => {
  setShowingIntro(false);  // Oculta intro y muestra minijuego
};
```

### Flujo de navegación actualizado:

1. **Menú** → Clic en isla desbloqueada
2. **Intro narrativa** → Lectura de la historia + contexto SRS
3. **CTA** → Botón "¡ZARPAR!" / "¡ASALTAR!" / etc.
4. **Minijuego** → Desafío interactivo
5. **Resultado** → Victoria/Derrota
6. **Menú** → Regreso al inicio

### Comandos de consola para desarrollo:

En modo desarrollo (`npm run dev`), puedes usar los siguientes comandos en la consola del navegador:

```javascript
reqpiece.help                 // Muestra ayuda de comandos
reqpiece.resolveIsland(1)     // Marca Isla 1 como completada y desbloquea Isla 2
reqpiece.resolveIsland(6)     // Desbloquea todas las islas hasta la 7
```

**Nota**: Los comandos de consola solo funcionan en modo desarrollo, no en producción.
