export const MAX_LIVES = 5;

export const WATER7_DIALOGS = [
  {
    id: "w7-1",
    emisor: "Cliente",
    texto:
      "La aplicación de gestión médica debe ser muy rápida al mostrar los resultados y súper segura para que no nos roben datos. ¡Eso es lo principal!",
    opciones: [
      {
        id: "a",
        texto:
          "Lo anotaré en el SRS como: 'Requisito No Funcional: El sistema será amigable, rápido y seguro según los estándares de la industria'.",
      },
      {
        id: "b",
        texto:
          "Detecto ambigüedad. Debemos especificar métricas verificables, como: 'El sistema procesará el 95% de las búsquedas en < 2s' y 'El sistema cifrará los datos según la normativa ENS'.",
      },
      {
        id: "c",
        texto:
          "Usaremos métodos formales y álgebra de procesos (CSP) para modelar matemáticamente qué significa 'muy rápida' y evitar programarlo mal.",
      },
    ],
    correctOptionId: "b",
  },
  {
    id: "w7-2",
    emisor: "Director de Proyecto",
    texto:
      "El problema afecta a varios departamentos y nadie tiene la visión completa. Las entrevistas individuales nos llevan semanas y solo generan requisitos contradictorios. ¿Qué hacemos?",
    opciones: [
      {
        id: "a",
        texto:
          "Propongo organizar sesiones JAD (Joint Application Development) de 2 a 4 días con los actores de todos los departamentos trabajando de igual a igual para consensuar el documento.",
      },
      {
        id: "b",
        texto:
          "Hay que documentar diagramas de Casos de Uso en UML. Al ser un lenguaje gráfico, forzará a los departamentos a estar de acuerdo sin necesidad de reunirlos.",
      },
      {
        id: "c",
        texto:
          "Debemos saltarnos la validación y crear un Prototipo Desechable de las interfaces para que los usuarios vean el software terminado y dejen de discutir.",
      },
    ],
    correctOptionId: "a",
  },
  {
    id: "w7-3",
    emisor: "Analista de Requisitos",
    texto:
      "He redactado estos dos requisitos para el banco: \nR1: 'Si el saldo medio está entre 500 y 1000€, someter el préstamo a aprobación del director.'\nR2: 'Si el saldo está entre 900 y 10000€, conceder automáticamente el préstamo.'",
    opciones: [
      {
        id: "a",
        texto:
          "Es un conjunto de requisitos Asequible y Completo, ya que cubre todos los rangos desde 500€ hasta 10000€.",
      },
      {
        id: "b",
        texto:
          "Esto es una Regla de Negocio válida. Se debe dejar así en la Especificación para que el programador decida qué hacer con las excepciones mediante sentencias if/else.",
      },
      {
        id: "c",
        texto:
          "Existe un defecto de Consistencia. Hay una contradicción evidente en el rango de 900€ a 1000€, donde el sistema exigiría aprobación y concesión automática al mismo tiempo.",
      },
    ],
    correctOptionId: "c",
  },
  {
    id: "w7-4",
    emisor: "Cliente",
    texto:
      "En las pruebas de aceptación el sistema tarda 60 segundos en responder. ¡Es inaceptable! Para no retrasar el proyecto, cambiad el requisito original de '20 seg' a '60 seg' y así pasamos a producción.",
    opciones: [
      {
        id: "a",
        texto:
          "Debemos revisar la trazabilidad hacia atrás (pre-trazabilidad). Si el origen de los 20 seg. es un protocolo clínico vital para emergencias, no se puede cambiar el requisito; hay que rediseñar el software.",
      },
      {
        id: "b",
        texto:
          "Como el cliente solicita el cambio, aplicaremos el 'sign-off' inmediatamente, estableciendo una nueva línea base (baseline) con 60 segundos.",
      },
      {
        id: "c",
        texto:
          "No podemos cambiarlo sin aplicar una técnica formal como Z o B-Method para demostrar matemáticamente que 60 segundos equivale a 20 segundos en tiempo de CPU.",
      },
    ],
    correctOptionId: "a",
  },
  {
    id: "w7-5",
    emisor: "Analista Junior",
    texto:
      "El cliente solo nos dio 10 requisitos iniciales para el problema, pero al trasladarlos al diseño de la solución ya tenemos una lista de más de 300 requisitos nuevos. ¡Creo que estamos haciendo algo mal!",
    opciones: [
      {
        id: "a",
        texto:
          "Debes borrar los nuevos. La regla de oro es mantener una relación estricta 1:1 entre los requisitos del cliente y los de software.",
      },
      {
        id: "b",
        texto:
          "Es normal, se conoce como la explosión de 'requisitos derivados' al pasar del dominio del problema al dominio de la solución, generada por la complejidad del propio diseño.",
      },
      {
        id: "c",
        texto:
          "Eso ocurre porque hemos aplicado mal el modelo de Casos de Uso, que siempre debería reducir el número de requisitos textuales.",
      },
    ],
    correctOptionId: "b",
  },
  {
    id: "w7-6",
    emisor: "Cliente",
    texto:
      "Quiero un requisito que diga: 'Como usuario validado, quiero poder dar de alta anticipos, para poder recibir dinero anticipado para gastos'. ¿Cómo documentamos esto en un enfoque ágil?",
    opciones: [
      {
        id: "a",
        texto:
          "Esa redacción encaja perfectamente en una Historia de Usuario, estructurada con el rol, la acción y el objetivo o valor aportado.",
      },
      {
        id: "b",
        texto:
          "Mediante una Especificación Formal Algebraica, para poder probar matemáticamente qué significa conceder un anticipo.",
      },
      {
        id: "c",
        texto:
          "La mejor forma es plasmarlo únicamente en un Diagrama de Clases UML para que lo entiendan los programadores.",
      },
    ],
    correctOptionId: "a",
  },
  {
    id: "w7-7",
    emisor: "Experto en Seguridad",
    texto:
      "La exposición efectiva a la que se enfrentan nuestros activos frente a un ataque es inaceptable. Necesitamos añadir urgentemente un procedimiento o mecanismo tecnológico que reduzca ese riesgo.",
    opciones: [
      {
        id: "a",
        texto:
          "Según la norma, lo que hay que aplicar e inventariar en el documento es una 'Vulnerabilidad mitigada'.",
      },
      {
        id: "b",
        texto:
          "Ese problema se soluciona simplemente eliminando el requisito de alta disponibilidad en el sistema.",
      },
      {
        id: "c",
        texto:
          "En términos de la metodología MAGERIT, lo que necesitamos definir e implementar es una 'Salvaguarda'.",
      },
    ],
    correctOptionId: "c",
  },
  {
    id: "w7-8",
    emisor: "Programador",
    texto:
      "Implementaré una API RESTful con autenticación JWT, contenedores Docker, microservicios en Node.js y una base de datos MongoDB replicada.",
    opciones: [
      {
        id: "a",
        texto:
          "El sistema usará arquitectura distribuida con autenticación por tokens, virtualización de servicios y almacenamiento NoSQL con alta disponibilidad.",
      },
      {
        id: "b",
        texto:
          "Va a usar muchas tecnologías de moda que harán el proyecto muy caro.",
      },
      {
        id: "c",
        texto:
          "Está describiendo la interfaz gráfica del sistema con lenguajes de programación.",
      },
    ],
    correctOptionId: "a",
  },
  {
    id: "w7-9",
    emisor: "Arquitecto de Software",
    texto:
      "Necesitamos que el sistema tolere fallos de red y caídas de servidores sin perder datos. Debe funcionar 24/7 incluso durante mantenimientos.",
    opciones: [
      {
        id: "a",
        texto:
          "Eso se consigue con buenos programadores que no cometan errores en el código.",
      },
      {
        id: "b",
        texto:
          "Son requisitos no funcionales de disponibilidad (99.99% uptime), tolerancia a fallos y recuperación ante desastres. Requieren arquitectura redundante.",
      },
      {
        id: "c",
        texto: "Hay que contratar un servicio de hosting premium y ya está resuelto.",
      },
    ],
    correctOptionId: "b",
  },
  {
    id: "w7-10",
    emisor: "Cliente",
    texto:
      "El sistema debe cumplir con el RGPD europeo, debe ser escalable para crecer, y la interfaz tiene que ser responsive para móviles.",
    opciones: [
      {
        id: "a",
        texto: "Son tres requisitos funcionales que describen qué hace el sistema.",
      },
      {
        id: "b",
        texto:
          "Solo el RGPD es un requisito, los demás son deseos del cliente sin valor técnico.",
      },
      {
        id: "c",
        texto:
          "Son tres requisitos no funcionales: uno legal/normativo, uno de rendimiento/escalabilidad y uno de usabilidad/adaptabilidad.",
      },
    ],
    correctOptionId: "c",
  },
  {
    id: "w7-11",
    emisor: "Analista de Sistemas",
    texto:
      "Tenemos un sistema legacy en COBOL de los años 80 sin documentación. Necesitamos extraer sus reglas de negocio para migrarlas al nuevo sistema.",
    opciones: [
      {
        id: "a",
        texto:
          "Hay que entrevistar a los usuarios actuales y empezar la elicitación desde cero como si no existiera el sistema antiguo.",
      },
      {
        id: "b",
        texto:
          "Debemos aplicar técnicas de Ingeniería Inversa para extraer requisitos del código fuente y comportamiento del sistema existente.",
      },
      {
        id: "c",
        texto:
          "Lo mejor es crear especificaciones formales en lenguaje Z sin mirar el código antiguo.",
      },
    ],
    correctOptionId: "b",
  },
  {
    id: "w7-12",
    emisor: "Jefe de Calidad",
    texto:
      "He detectado que el requisito R-045 dice 'El sistema permitirá login con usuario/contraseña' pero R-087 dice 'Solo se permitirá acceso mediante certificado digital'. ¿Qué hacemos?",
    opciones: [
      {
        id: "a",
        texto: "Implementar ambos y que el programador decida cuál usar según el contexto.",
      },
      {
        id: "b",
        texto:
          "Es un defecto de Consistencia en la especificación. Hay que resolver la contradicción con los stakeholders antes de continuar.",
      },
      {
        id: "c",
        texto:
          "Aplicar la regla del último requisito: prevalece R-087 por tener numeración mayor.",
      },
    ],
    correctOptionId: "b",
  },
  {
    id: "w7-13",
    emisor: "Product Owner",
    texto:
      "En metodología ágil, ¿cómo priorizamos qué requisitos implementar primero cuando tenemos 200 historias de usuario en el backlog?",
    opciones: [
      {
        id: "a",
        texto:
          "Implementar primero las más fáciles para avanzar rápido y motivar al equipo.",
      },
      {
        id: "b",
        texto:
          "Usar técnicas como MoSCoW (Must/Should/Could/Won't) o Value vs Effort para priorizar por valor de negocio e impacto.",
      },
      {
        id: "c",
        texto:
          "Dejar que cada desarrollador elija la historia que más le guste programar.",
      },
    ],
    correctOptionId: "b",
  },
  {
    id: "w7-14",
    emisor: "Auditor de Seguridad",
    texto:
      "El análisis de riesgos revela que los datos personales están expuestos a intercepción durante la transmisión. ¿Qué debemos especificar?",
    opciones: [
      {
        id: "a",
        texto:
          "Un requisito funcional que indique que los usuarios deben tener cuidado al enviar datos.",
      },
      {
        id: "b",
        texto:
          "Simplemente contratar un mejor proveedor de internet para evitar interceptaciones.",
      },
      {
        id: "c",
        texto:
          "Un requisito de seguridad no funcional que especifique cifrado TLS 1.3 o superior para todas las comunicaciones cliente-servidor.",
      },
    ],
    correctOptionId: "c",
  },
  {
    id: "w7-15",
    emisor: "Responsable de UX",
    texto:
      "Los usuarios se quejan de que la aplicación es confusa y tardan mucho en aprender a usarla. Necesitamos requisitos que mejoren esto.",
    opciones: [
      {
        id: "a",
        texto:
          "Son quejas subjetivas, no se pueden convertir en requisitos técnicos medibles.",
      },
      {
        id: "b",
        texto:
          "Debemos definir requisitos de usabilidad medibles: 'Un usuario nuevo completará el flujo principal en < 5 min sin errores' o 'Satisfacción SUS > 80 puntos'.",
      },
      {
        id: "c",
        texto:
          "Basta con cambiar los colores de la interfaz a tonos más alegres.",
      },
    ],
    correctOptionId: "b",
  },
];
