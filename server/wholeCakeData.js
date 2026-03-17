export const WHOLECAKE_GAME_TIME_SECONDS = 40;
export const WHOLECAKE_MAX_TIME_SECONDS = 60;
export const WHOLECAKE_TIME_GAIN_ON_HIT = 2;
export const WHOLECAKE_TIME_PENALTY_ON_FAIL = 7;

export const WHOLECAKE_REQUIREMENTS_POOL = [
  { id: "wc-1", texto: "El usuario debe poder registrar una cuenta nueva.", tipo: "funcional" },
  { id: "wc-2", texto: "El sistema debe permitir recuperar la contrasena por correo.", tipo: "funcional" },
  { id: "wc-3", texto: "La app debe generar reportes PDF de ventas.", tipo: "funcional" },
  { id: "wc-4", texto: "El cliente puede filtrar pedidos por fecha y estado.", tipo: "funcional" },
  { id: "wc-5", texto: "El administrador puede eliminar usuarios inactivos.", tipo: "funcional" },
  { id: "wc-6", texto: "El sistema debe enviar notificaciones push al móvil.", tipo: "funcional" },
  { id: "wc-7", texto: "La respuesta de búsqueda debe tardar menos de 2 segundos.", tipo: "no-funcional" },
  { id: "wc-8", texto: "El sistema debe tener disponibilidad mínima del 99.9%.", tipo: "no-funcional" },
  { id: "wc-9", texto: "Las contraseñas deben almacenarse cifradas con hash seguro.", tipo: "no-funcional" },
  { id: "wc-10", texto: "La interfaz debe ser usable desde móviles y tablets.", tipo: "no-funcional" },
  { id: "wc-11", texto: "El tiempo de carga de la página principal debe ser menor a 3 segundos.", tipo: "no-funcional" },
  { id: "wc-12", texto: "El sistema debe cumplir con el estándar ISO 27001 de seguridad.", tipo: "no-funcional" },
];
