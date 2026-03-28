export const WHOLECAKE_GAME_TIME_SECONDS = 40;
export const WHOLECAKE_MAX_TIME_SECONDS = 60;
export const WHOLECAKE_TIME_GAIN_ON_HIT = 2;
export const WHOLECAKE_TIME_PENALTY_ON_FAIL = 7;
export const WHOLECAKE_MAX_LIVES = 3;

export const WHOLECAKE_REQUIREMENTS_POOL = [
  {  id: "wc-1",
     texto: "El usuario debe poder registrar una cuenta nueva.", 
     tipo: "funcional"
     },
  { id: "wc-2",
     texto: "El sistema debe permitir recuperar la contraseña por correo.", 
     tipo: "funcional"
     },
  { id: "wc-3",
     texto: "La app debe generar reportes PDF de ventas.", 
     tipo: "funcional"
     },
  { id: "wc-4",
     texto: "El cliente puede filtrar pedidos por fecha y estado.", 
     tipo: "funcional"
     },
  { id: "wc-5",
     texto: "El administrador puede eliminar usuarios inactivos.", 
     tipo: "funcional"
     },
  

  { id: "wc-6",
     texto: "El sistema debe enviar notificaciones push al móvil.", 
     tipo: "funcional"
     },
  { id: "wc-7",
     texto: "El sistema se diseñará para ofrecer disponibilidad continua 24/7.", 
     tipo: "no-funcional"
     },
  { id: "wc-8",
     texto: "Se empleará Maven como sistema de construcción.", 
     tipo: "no-funcional"
     },
  { id: "wc-9",
     texto: "Se empleará JPA para la persistencia de datos.", 
     tipo: "no-funcional"
     },
  { id: "wc-10",
     texto: "La arquitectura deberá seguir un enfoque hexagonal alineado con DDD.", 
     tipo: "no-funcional"
     },
  { id: "wc-11",
     texto: "El tiempo de carga de la página principal debe ser menor a 3 segundos.", 
     tipo: "no-funcional"
     },
  { id: "wc-12",
     texto: "El sistema debe cumplir con el estándar ISO 27001 de seguridad.", 
     tipo: "no-funcional"
     },
  {
    id: "wc-13",
      texto: "La interfaz de usuario deberá ofrecer un Modo Oscuro para reducir el consumo energético en los dispositivos de los usuarios.",
    tipo: "sostenibilidad",
  },
  {
    id: "wc-14",
      texto: "El sistema deberá incluir una opción de desconexión digital que pause las notificaciones fuera del horario de trabajo para proteger el descanso y la salud mental del trabajador.",
    tipo: "sostenibilidad",
  },
  {
    id: "wc-15",
      texto: "La aplicación cliente deberá ser lo suficientemente ligera para funcionar fluidamente en dispositivos y navegadores antiguos, evitando forzar a los usuarios a renovar su hardware prematuramente.",
    tipo: "sostenibilidad",
  },
  {
    id: "wc-16",
      texto: "El servidor del backend deberá optimizar el uso de sus recursos, reduciendo la capacidad de cómputo activa durante los períodos nocturnos o de baja demanda.",
    tipo: "sostenibilidad",
  },
  {
    id: "wc-17",
      texto: "El sistema implementará una herramienta para detectar y sugerir la eliminación definitiva de datos adjuntos huérfanos y tableros inactivos por más de un año, minimizando el almacenamiento innecesario en la nube.",
    tipo: "sostenibilidad",
  },
];
