# REQ PIECE - Guia del Juego

> Documento oficial de instrucciones y explicacion de la experiencia de juego.

---

## Vista General

Req Piece es una aventura educativa inspirada en One Piece para aprender Ingenieria de Requisitos a traves de minijuegos por islas.

Cada isla entrena una habilidad distinta:

- Analisis de requisitos.
- Traduccion cliente-programador.
- Diferenciacion entre problema y solucion.
- Clasificacion funcional/no funcional.
- Calidad de requisitos segun IEEE 830.
- Trazabilidad y analisis de impacto.

---

## Objetivo Principal

Completar las 6 islas en orden para desbloquear la ruta final de victoria.

El progreso es secuencial:

- Solo la Isla 1 inicia desbloqueada.
- Al superar una isla, se abre la siguiente.
- El avance se guarda automaticamente en el navegador.

---

## Mapa de Islas

| Isla | Nombre               | Enfoque didactico                                  |
| ---- | -------------------- | -------------------------------------------------- |
| 1    | Loguetown            | Orden del ciclo de vida de requisitos              |
| 2    | Water 7              | Traducir dialogos a requisitos tecnicos            |
| 3    | Archipielago Sabaody | Distinguir QUE (requisito) vs COMO (solucion)      |
| 4    | Whole Cake           | Clasificar requisitos funcionales y no funcionales |
| 5    | Wano                 | Validar calidad y precision (IEEE 830)             |
| 6    | EggHead              | Trazabilidad y analisis de impacto                 |

---

## Flujo de Partida

1. Entra al menu principal.
2. Selecciona una isla desbloqueada.
3. Lee la introduccion narrativa de la isla.
4. Inicia el minijuego.
5. Completa el reto para desbloquear la siguiente isla.
6. Regresa al menu y continua la travesia.

---

## Controles y Experiencia

### Navegacion

- Seleccion de isla desde el menu principal.
- Regreso al menu al finalizar o salir de una fase.
- Soporte de navegacion por ruta (url) con proteccion de islas bloqueadas.

### Audio

- Efectos de sonido para acciones clave (click, error y acierto).
- Musica de fondo en bucle con volumen moderado para no saturar la experiencia.

---

## Reglas del Progreso

El juego protege la coherencia del avance:

- No se puede acceder a islas bloqueadas mediante url directa.
- Si una isla no esta habilitada, la app redirige al menu.
- Se conserva un desbloqueo consecutivo (sin saltos entre islas).

---

## Recomendaciones para Jugar

- Completa cada isla antes de pasar a la siguiente.
- Lee con atencion las consignas: la precision importa.
- En retos de clasificacion, prioriza el criterio conceptual.
- En validacion de requisitos, evita ambiguedades y busca verificabilidad.

## Solucion de Problemas

### No escucho la musica o efectos

- Verifica que el volumen del sistema no este en silencio.
- Interactua con la pagina (clic o teclado) para habilitar audio en navegadores que bloquean autoplay.
- Comprueba que los archivos de audio existan en public/audio.

### El progreso no se guarda

- Revisa si el navegador tiene bloqueado localStorage.
- Evita modo navegacion privada estricto, que puede limpiar datos al cerrar.

### No puedo entrar a una isla por url

- Es normal si la isla aun no esta desbloqueada.
- Completa las islas anteriores desde el menu principal.

---

## Buena travesía, suerte encontrando el One Spec
