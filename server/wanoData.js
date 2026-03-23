export const WANO_TOTAL_TIME = 90;
export const WANO_MAX_LIVES = 2;

export const WANO_REQUIREMENTS = [
  {
    id: "r1",
    text: "El sistema de alerta debe responder de forma rápida cuando el capataz active una emergencia.",
    targetWord: "rápida",
    replacement: "en menos de 2 segundos",
    reason: "Es verificable midiendo tiempo de respuesta máximo.",
  },
  {
    id: "r2",
    text: "La consola central de Onigashima debe ser intuitiva para nuevos operarios.",
    targetWord: "intuitiva",
    replacement: "aprendible en menos de 15 minutos con 0 errores críticos",
    reason: "Permite pruebas de usabilidad con un criterio cuantificable.",
  },
  {
    id: "r3",
    text: "El blindaje del arsenal debe ser indestructible ante ataques externos.",
    targetWord: "indestructible",
    replacement: "capaz de soportar impactos de más de 50 toneladas sin ruptura",
    reason: "Define umbral de resistencia comprobable en laboratorio.",
  },
  {
    id: "r4",
    text: "La red de comunicación del castillo debe ser robusta durante operaciones nocturnas.",
    targetWord: "robusta",
    replacement: "disponible al 99.95% mensual y tolerar 1 nodo caído",
    reason: "Es medible con métricas de disponibilidad y tolerancia a fallos.",
  },
  {
    id: "r5",
    text: "El registro de armamento debe ser seguro para evitar sabotajes de infiltrados.",
    targetWord: "seguro",
    replacement: "protegido con cifrado AES-256 y MFA obligatoria",
    reason: "Es auditable mediante controles técnicos concretos.",
  },
  {
    id: "r6",
    text: "El sistema de vigilancia debe funcionar de manera eficiente durante todo el día.",
    targetWord: "eficiente",
    replacement: "consumiendo menos de 500W y procesando 30 fps mínimo",
    reason: "Define consumo energético y rendimiento medibles.",
  },
  {
    id: "r7",
    text: "La plataforma de logística debe tener una interfaz amigable para los soldados rasos.",
    targetWord: "amigable",
    replacement: "con índice SUS superior a 75 puntos en tests de usuario",
    reason: "Usa métrica estándar de usabilidad verificable.",
  },
  {
    id: "r8",
    text: "El tiempo de respaldo de datos debe ser aceptable para no interrumpir operaciones.",
    targetWord: "aceptable",
    replacement: "completado en menos de 4 horas en ventana nocturna",
    reason: "Establece límite temporal concreto y verificable.",
  },
  {
    id: "r9",
    text: "El módulo de monitoreo debe mostrar resultados precisos en todo momento.",
    targetWord: "precisos",
    replacement: "con un error máximo de 1% en comparación con la referencia calibrada",
    reason: "Permite verificar exactitud con tolerancia cuantificada.",
  },
  {
    id: "r10",
    text: "El sistema de acceso debe autenticar usuarios de forma inmediata al ingresar al portal.",
    targetWord: "inmediata",
    replacement: "en menos de 1 segundo para el 95% de inicios de sesión",
    reason: "Convierte la ambigüedad en métrica temporal comprobable.",
  },
  {
    id: "r11",
    text: "La bitácora de eventos debe conservarse por un período adecuado para auditorías.",
    targetWord: "adecuado",
    replacement: "por al menos 24 meses con integridad verificable por checksum",
    reason: "Define umbral de retención y control técnico de integridad.",
  },
];
