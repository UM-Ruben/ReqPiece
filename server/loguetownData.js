export const LOGUETOWN_PHASES = [
  { id: "Obtencion",      label: "Obtención",      description: "Recopilar necesidades del cliente" },
  { id: "Analisis",       label: "Análisis",        description: "Estudiar viabilidad y conflictos" },
  { id: "Especificacion", label: "Especificación",  description: "Documentar requisitos formalmente" },
  { id: "Validacion",     label: "Validación",      description: "Confirmar que los requisitos son correctos" },
];

export const LOGUETOWN_CORRECT_ORDER = LOGUETOWN_PHASES.map((p) => p.id);
export const LOGUETOWN_MAX_LIVES = 3;
