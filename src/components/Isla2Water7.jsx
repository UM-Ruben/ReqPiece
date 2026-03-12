import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Cpu, Heart, User } from "lucide-react";
import imageFail from "../image/isla2Fallo.png";
import imageSuccess from "../image/isla2Acierto.png";

const dialogos = [
  {
    emisor: "Cliente",
    texto: "La aplicación de gestión médica debe ser muy rápida al mostrar los resultados y súper segura para que no nos roben datos. ¡Eso es lo principal!",
    opciones: [
      { 
        texto: "Lo anotaré en el SRS como: 'Requisito No Funcional: El sistema será amigable, rápido y seguro según los estándares de la industria'.", 
        correcta: false 
      },
      {
        texto: "Detecto ambigüedad. Debemos especificar métricas verificables, como: 'El sistema procesará el 95% de las búsquedas en < 2s' y 'El sistema cifrará los datos según la normativa ENS'.",
        correcta: true,
      },
      { 
        texto: "Usaremos métodos formales y álgebra de procesos (CSP) para modelar matemáticamente qué significa 'muy rápida' y evitar programarlo mal.", 
        correcta: false 
      },
    ],
  },
  {
    emisor: "Director de Proyecto",
    texto: "El problema afecta a varios departamentos y nadie tiene la visión completa. Las entrevistas individuales nos llevan semanas y solo generan requisitos contradictorios. ¿Qué hacemos?",
    opciones: [
      {
        texto: "Propongo organizar sesiones JAD (Joint Application Development) de 2 a 4 días con los actores de todos los departamentos trabajando de igual a igual para consensuar el documento.",
        correcta: true,
      },
      { 
        texto: "Hay que documentar diagramas de Casos de Uso en UML. Al ser un lenguaje gráfico, forzará a los departamentos a estar de acuerdo sin necesidad de reunirlos.", 
        correcta: false 
      },
      { 
        texto: "Debemos saltarnos la validación y crear un Prototipo Desechable de las interfaces para que los usuarios vean el software terminado y dejen de discutir.", 
        correcta: false 
      },
    ],
  },
  {
    emisor: "Analista de Requisitos",
    texto: "He redactado estos dos requisitos para el banco: \nR1: 'Si el saldo medio está entre 500 y 1000€, someter el préstamo a aprobación del director.'\nR2: 'Si el saldo está entre 900 y 10000€, conceder automáticamente el préstamo.'",
    opciones: [
      { 
        texto: "Es un conjunto de requisitos Asequible y Completo, ya que cubre todos los rangos desde 500€ hasta 10000€.", 
        correcta: false 
      },
      { 
        texto: "Esto es una Regla de Negocio válida. Se debe dejar así en la Especificación para que el programador decida qué hacer con las excepciones mediante sentencias if/else.", 
        correcta: false 
      },
      {
        texto: "Existe un defecto de Consistencia. Hay una contradicción evidente en el rango de 900€ a 1000€, donde el sistema exigiría aprobación y concesión automática al mismo tiempo.",
        correcta: true,
      },
    ],
  },
  {
    emisor: "Cliente",
    texto: "En las pruebas de aceptación el sistema tarda 60 segundos en responder. ¡Es inaceptable! Para no retrasar el proyecto, cambiad el requisito original de '20 seg' a '60 seg' y así pasamos a producción.",
    opciones: [
      {
        texto: "Debemos revisar la trazabilidad hacia atrás (pre-trazabilidad). Si el origen de los 20 seg. es un protocolo clínico vital para emergencias, no se puede cambiar el requisito; hay que rediseñar el software.",
        correcta: true,
      },
      { 
        texto: "Como el cliente solicita el cambio, aplicaremos el 'sign-off' inmediatamente, estableciendo una nueva línea base (baseline) con 60 segundos.", 
        correcta: false 
      },
      { 
        texto: "No podemos cambiarlo sin aplicar una técnica formal como Z o B-Method para demostrar matemáticamente que 60 segundos equivale a 20 segundos en tiempo de CPU.", 
        correcta: false 
      },
    ],
  },
  {
    emisor: "Analista Junior",
    texto: "El cliente solo nos dio 10 requisitos iniciales para el problema, pero al trasladarlos al diseño de la solución ya tenemos una lista de más de 300 requisitos nuevos. ¡Creo que estamos haciendo algo mal!",
    opciones: [
      { texto: "Debes borrar los nuevos. La regla de oro es mantener una relación estricta 1:1 entre los requisitos del cliente y los de software.", correcta: false },
      {
        texto: "Es normal, se conoce como la explosión de 'requisitos derivados' al pasar del dominio del problema al dominio de la solución, generada por la complejidad del propio diseño.",
        correcta: true,
      },
      { texto: "Eso ocurre porque hemos aplicado mal el modelo de Casos de Uso, que siempre debería reducir el número de requisitos textuales.", correcta: false },
    ],
  },
  {
    emisor: "Cliente",
    texto: "Quiero un requisito que diga: 'Como usuario validado, quiero poder dar de alta anticipos, para poder recibir dinero anticipado para gastos'. ¿Cómo documentamos esto en un enfoque ágil?",
    opciones: [
      {
        texto: "Esa redacción encaja perfectamente en una Historia de Usuario, estructurada con el rol, la acción y el objetivo o valor aportado.",
        correcta: true,
      },
      { texto: "Mediante una Especificación Formal Algebraica, para poder probar matemáticamente qué significa conceder un anticipo.", correcta: false },
      { texto: "La mejor forma es plasmarlo únicamente en un Diagrama de Clases UML para que lo entiendan los programadores.", correcta: false },
    ],
  },
  {
    emisor: "Experto en Seguridad",
    texto: "La exposición efectiva a la que se enfrentan nuestros activos frente a un ataque es inaceptable. Necesitamos añadir urgentemente un procedimiento o mecanismo tecnológico que reduzca ese riesgo.",
    opciones: [
      { texto: "Según la norma, lo que hay que aplicar e inventariar en el documento es una 'Vulnerabilidad mitigada'.", correcta: false },
      { texto: "Ese problema se soluciona simplemente eliminando el requisito de alta disponibilidad en el sistema.", correcta: false },
      {
        texto: "En términos de la metodología MAGERIT, lo que necesitamos definir e implementar es una 'Salvaguarda'.",
        correcta: true,
      },
    ],
  },
  {
    emisor: "Programador",
    texto: "Implementaré una API RESTful con autenticación JWT, contenedores Docker, microservicios en Node.js y una base de datos MongoDB replicada.",
    opciones: [
      {
        texto: "El sistema usará arquitectura distribuida con autenticación por tokens, virtualización de servicios y almacenamiento NoSQL con alta disponibilidad.",
        correcta: true,
      },
      { texto: "Va a usar muchas tecnologías de moda que harán el proyecto muy caro.", correcta: false },
      { texto: "Está describiendo la interfaz gráfica del sistema con lenguajes de programación.", correcta: false },
    ],
  },
  {
    emisor: "Arquitecto de Software",
    texto: "Necesitamos que el sistema tolere fallos de red y caídas de servidores sin perder datos. Debe funcionar 24/7 incluso durante mantenimientos.",
    opciones: [
      { texto: "Eso se consigue con buenos programadores que no cometan errores en el código.", correcta: false },
      {
        texto: "Son requisitos no funcionales de disponibilidad (99.99% uptime), tolerancia a fallos y recuperación ante desastres. Requieren arquitectura redundante.",
        correcta: true,
      },
      { texto: "Hay que contratar un servicio de hosting premium y ya está resuelto.", correcta: false },
    ],
  },
  {
    emisor: "Cliente",
    texto: "El sistema debe cumplir con el RGPD europeo, debe ser escalable para crecer, y la interfaz tiene que ser responsive para móviles.",
    opciones: [
      { texto: "Son tres requisitos funcionales que describen qué hace el sistema.", correcta: false },
      { texto: "Solo el RGPD es un requisito, los demás son deseos del cliente sin valor técnico.", correcta: false },
      {
        texto: "Son tres requisitos no funcionales: uno legal/normativo, uno de rendimiento/escalabilidad y uno de usabilidad/adaptabilidad.",
        correcta: true,
      },
    ],
  },
  {
    emisor: "Analista de Sistemas",
    texto: "Tenemos un sistema legacy en COBOL de los años 80 sin documentación. Necesitamos extraer sus reglas de negocio para migrarlas al nuevo sistema.",
    opciones: [
      { texto: "Hay que entrevistar a los usuarios actuales y empezar la elicitación desde cero como si no existiera el sistema antiguo.", correcta: false },
      {
        texto: "Debemos aplicar técnicas de Ingeniería Inversa para extraer requisitos del código fuente y comportamiento del sistema existente.",
        correcta: true,
      },
      { texto: "Lo mejor es crear especificaciones formales en lenguaje Z sin mirar el código antiguo.", correcta: false },
    ],
  },
  {
    emisor: "Jefe de Calidad",
    texto: "He detectado que el requisito R-045 dice 'El sistema permitirá login con usuario/contraseña' pero R-087 dice 'Solo se permitirá acceso mediante certificado digital'. ¿Qué hacemos?",
    opciones: [
      { texto: "Implementar ambos y que el programador decida cuál usar según el contexto.", correcta: false },
      {
        texto: "Es un defecto de Consistencia en la especificación. Hay que resolver la contradicción con los stakeholders antes de continuar.",
        correcta: true,
      },
      { texto: "Aplicar la regla del último requisito: prevalece R-087 por tener numeración mayor.", correcta: false },
    ],
  },
  {
    emisor: "Product Owner",
    texto: "En metodología ágil, ¿cómo priorizamos qué requisitos implementar primero cuando tenemos 200 historias de usuario en el backlog?",
    opciones: [
      { texto: "Implementar primero las más fáciles para avanzar rápido y motivar al equipo.", correcta: false },
      {
        texto: "Usar técnicas como MoSCoW (Must/Should/Could/Won't) o Value vs Effort para priorizar por valor de negocio e impacto.",
        correcta: true,
      },
      { texto: "Dejar que cada desarrollador elija la historia que más le guste programar.", correcta: false },
    ],
  },
  {
    emisor: "Auditor de Seguridad",
    texto: "El análisis de riesgos revela que los datos personales están expuestos a intercepción durante la transmisión. ¿Qué debemos especificar?",
    opciones: [
      { texto: "Un requisito funcional que indique que los usuarios deben tener cuidado al enviar datos.", correcta: false },
      { texto: "Simplemente contratar un mejor proveedor de internet para evitar interceptaciones.", correcta: false },
      {
        texto: "Un requisito de seguridad no funcional que especifique cifrado TLS 1.3 o superior para todas las comunicaciones cliente-servidor.",
        correcta: true,
      },
    ],
  },
  {
    emisor: "Responsable de UX",
    texto: "Los usuarios se quejan de que la aplicación es confusa y tardan mucho en aprender a usarla. Necesitamos requisitos que mejoren esto.",
    opciones: [
      { texto: "Son quejas subjetivas, no se pueden convertir en requisitos técnicos medibles.", correcta: false },
      {
        texto: "Debemos definir requisitos de usabilidad medibles: 'Un usuario nuevo completará el flujo principal en < 5 min sin errores' o 'Satisfacción SUS > 80 puntos'.",
        correcta: true,
      },
      { texto: "Basta con cambiar los colores de la interfaz a tonos más alegres.", correcta: false },
    ],
  },
];

function shuffleOptions(options) {
  const copied = [...options];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

const MAX_LIVES = 5;

export default function Isla2Water7({ onBackToMenu, onIslandCompleted, playError, playSuccess }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [outcome, setOutcome] = useState(null);
  const [victory, setVictory] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "info",
    message: "Selecciona la mejor traducción.",
  });
  const [displayedOptions, setDisplayedOptions] = useState(() =>
    shuffleOptions(dialogos[0].opciones),
  );

  const lockRef = useRef(false);
  const livesRef = useRef(MAX_LIVES);

  const loseLife = () => {
    const newLives = livesRef.current - 1;
    livesRef.current = newLives;
    setLives(newLives);
    return newLives;
  };

  const handleOption = (option) => {
    if (victory || outcome === "failure" || lockRef.current) return;

    lockRef.current = true;
    setIsLocked(true);

    if (option.correcta) {
      playSuccess();
      const nextIndex = currentIndex + 1;
      if (nextIndex >= dialogos.length) {
        setVictory(true);
        lockRef.current = false;
        setIsLocked(false);
        return;
      }
      setFeedback({
        type: "success",
        message: `¡Correcto! Pregunta ${nextIndex + 1}/${dialogos.length}.`,
      });
      setCurrentIndex(nextIndex);
      setDisplayedOptions(shuffleOptions(dialogos[nextIndex].opciones));
    } else {
      playError();
      const newLives = loseLife();

      if (newLives <= 0) {
        setOutcome("failure");
        return;
      }

      setFeedback({
        type: "error",
        message: `¡Respuesta incorrecta! Te quedan ${newLives} vidas. Inténtalo de nuevo.`,
      });
      setDisplayedOptions(shuffleOptions(dialogos[currentIndex].opciones));
    }

    lockRef.current = false;
    setIsLocked(false);
  };

  const reset = () => {
    livesRef.current = MAX_LIVES;
    setCurrentIndex(0);
    setLives(MAX_LIVES);
    setOutcome(null);
    setVictory(false);
    setFeedback({ type: "info", message: "Selecciona la mejor traducción." });
    setDisplayedOptions(shuffleOptions(dialogos[0].opciones));
    lockRef.current = false;
    setIsLocked(false);
  };

  return (
    <section className="relative mx-auto max-w-3xl rounded-3xl bg-stone-900 p-6 text-amber-50">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-900/30 bg-amber-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
            <Compass className="h-4 w-4" />
            Isla 2: Water 7
          </p>
          <h2 className="text-3xl font-black uppercase tracking-wide text-amber-50 md:text-4xl">
            Traduce al lenguaje técnico
          </h2>
        </div>

        <button
          type="button"
          onClick={onBackToMenu}
          className="rounded-lg border border-amber-500/60 bg-amber-200/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-50 transition hover:bg-amber-200/40"
        >
          Volver al menú
        </button>
      </div>

      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: MAX_LIVES }).map((_, index) => (
          <Heart
            key={`life-${index + 1}`}
            className={`h-5 w-5 ${index < lives ? "fill-red-500 text-red-600" : "text-slate-500"}`}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 items-center">
        <div className="flex flex-col items-center gap-2">
          <User className="h-8 w-8 text-amber-300" />
          <span className="text-sm uppercase text-amber-200">Cliente</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Cpu className="h-8 w-8 text-amber-300" />
          <span className="text-sm uppercase text-amber-200">Programador</span>
        </div>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 rounded-lg bg-amber-100/20 p-4 text-center text-amber-100"
      >
        <p className="italic">"{dialogos[currentIndex].texto}"</p>
        <p className="mt-2 text-sm font-semibold">- {dialogos[currentIndex].emisor}</p>
      </motion.div>

      <div
        className={`mt-4 rounded-lg border px-4 py-2 text-center text-sm font-bold ${
          feedback.type === "success"
            ? "border-emerald-300 bg-emerald-100/20 text-emerald-200"
            : feedback.type === "error"
              ? "border-red-300 bg-red-100/20 text-red-200"
              : "border-amber-300 bg-amber-100/10 text-amber-100"
        }`}
      >
        {feedback.message}
      </div>

      <div className="mt-6 grid gap-4">
        {displayedOptions.map((option, idx) => (
          <button
            key={`${option.texto}-${idx}`}
            onClick={() => handleOption(option)}
            disabled={victory || outcome === "failure" || isLocked}
            className="w-full rounded-xl bg-amber-100 px-4 py-3 font-bold text-blue-950 hover:bg-amber-200 disabled:opacity-50"
          >
            {option.texto}
          </button>
        ))}
      </div>

      {outcome === "failure" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/75 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-red-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <img src={imageFail} alt="Derrota en Water 7" className="w-full max-h-[60vh] object-contain" />
            <div className="space-y-4 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wide text-red-300">Derrota en Water 7</h3>
              <p className="font-semibold text-amber-100/90">
                Te has quedado sin vidas. Reorganiza la estrategia y vuelve a intentarlo.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={reset}
                  className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-blue-950 transition hover:brightness-105"
                >
                  Reintentar Isla 2
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {victory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/75 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-emerald-400/90 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <img src={imageSuccess} alt="Victoria en Water 7" className="w-full max-h-[60vh] object-contain" />
            <div className="space-y-3 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wide text-emerald-300">¡Isla 2 completada!</h3>
              <p className="font-semibold text-amber-100/90">
                ¡Has traducido todo! Has desbloqueado la Isla 3.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={onIslandCompleted}
                  className="rounded-xl border-2 border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-blue-950 transition hover:brightness-105"
                >
                  Siguiente isla
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
