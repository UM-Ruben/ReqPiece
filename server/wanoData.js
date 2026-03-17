export const WANO_TOTAL_TIME = 45;
export const WANO_MAX_LIVES = 2;

export const WANO_REQUIREMENTS = [
  {
    id: "r1",
    text: "El sistema de alerta debe responder de forma rapida cuando el capataz active una emergencia.",
    targetWord: "rapida",
    replacement: "en menos de 2 segundos",
    reason: "Es verificable midiendo tiempo de respuesta maximo.",
  },
  {
    id: "r2",
    text: "La consola central de Onigashima debe ser intuitiva para nuevos operarios.",
    targetWord: "intuitiva",
    replacement: "aprendible en menos de 15 minutos con 0 errores criticos",
    reason: "Permite pruebas de usabilidad con un criterio cuantificable.",
  },
  {
    id: "r3",
    text: "El blindaje del arsenal debe ser indestructible ante ataques externos.",
    targetWord: "indestructible",
    replacement: "capaz de soportar impactos de mas de 50 toneladas sin ruptura",
    reason: "Define umbral de resistencia comprobable en laboratorio.",
  },
  {
    id: "r4",
    text: "La red de comunicacion del castillo debe ser robusta durante operaciones nocturnas.",
    targetWord: "robusta",
    replacement: "disponible al 99.95% mensual y tolerar 1 nodo caido",
    reason: "Es medible con metricas de disponibilidad y tolerancia a fallos.",
  },
  {
    id: "r5",
    text: "El registro de armamento debe ser seguro para evitar sabotajes de infiltrados.",
    targetWord: "seguro",
    replacement: "protegido con cifrado AES-256 y MFA obligatoria",
    reason: "Es auditable mediante controles tecnicos concretos.",
  },
  {
    id: "r6",
    text: "El sistema de vigilancia debe funcionar de manera eficiente durante todo el dia.",
    targetWord: "eficiente",
    replacement: "consumiendo menos de 500W y procesando 30 fps minimo",
    reason: "Define consumo energetico y rendimiento medibles.",
  },
  {
    id: "r7",
    text: "La plataforma de logistica debe tener una interfaz amigable para los soldados rasos.",
    targetWord: "amigable",
    replacement: "con indice SUS superior a 75 puntos en tests de usuario",
    reason: "Usa metrica estandar de usabilidad verificable.",
  },
  {
    id: "r8",
    text: "El tiempo de respaldo de datos debe ser aceptable para no interrumpir operaciones.",
    targetWord: "aceptable",
    replacement: "completado en menos de 4 horas en ventana nocturna",
    reason: "Establece limite temporal concreto y verificable.",
  },
];
