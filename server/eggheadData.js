export const EGGHEAD_MAX_ERRORS = 3;

export const EGGHEAD_REQUIREMENTS = [
  {
    id: "req-01",
    code: "REQ-01",
    name: "Login de usuarios",
    status: "estable",
    brief: "Los usuarios deben autenticarse y el sistema debe registrar correctamente los accesos.",
    affectedArtifacts: ["art-2", "art-4"],
  },
  {
    id: "req-02",
    code: "REQ-02",
    name: "Gestión de catálogo",
    status: "estable",
    brief: "El catálogo debe poder consultarse y mantenerse desde la capa funcional del sistema.",
    affectedArtifacts: ["art-6", "art-7", "art-8"],
  },
  {
    id: "req-03",
    code: "REQ-03",
    name: "Checkout seguro",
    status: "estable",
    brief: "La compra debe validarse, persistirse y ejecutarse de forma segura de extremo a extremo.",
    affectedArtifacts: ["art-1", "art-3", "art-5"],
  },
  {
    id: "req-04",
    code: "REQ-04",
    name: "Añadir pasarela de pago",
    status: "modificado",
    brief: "Se incorpora pago externo, por lo que hay que localizar qué partes del sistema cambian realmente.",
    affectedArtifacts: ["art-1", "art-3", "art-5"],
  },
];

export const EGGHEAD_ARTIFACTS = [
  {
    id: "art-1",
    name: "Componente ShoppingCart.jsx",
    description: "Gestiona carrito, resumen del pedido y arranque del flujo de compra.",
  },
  {
    id: "art-2",
    name: "Test de Integración Auth",
    description: "Valida autenticación, sesiones y permisos de acceso.",
  },
  {
    id: "art-3",
    name: "Tabla DB: Transacciones",
    description: "Persiste cobros, estados de pago y evidencias de operación.",
  },
  {
    id: "art-4",
    name: "Módulo de Perfil de Usuario",
    description: "Centraliza datos de cuenta, preferencias y datos visibles del usuario.",
  },
  {
    id: "art-5",
    name: "API: Checkout & Gateway",
    description: "Orquesta checkout, comunicación con servicios externos y confirmación final.",
  },
  {
    id: "art-6",
    name: "Tabla DB: Productos",
    description: "Persiste la información del catálogo, precios, stock y detalles de cada producto.",
  },
  {
    id: "art-7",
    name: "API: Catalog & Inventory",
    description: "Permite consultar el catálogo desde el frontend y ofrece endpoints para el mantenimiento (CRUD) de productos.",
  },
  {
    id: "art-8",
    name: "Componente ProductManager.jsx",
    description: "Interfaz gráfica (Backoffice/Admin) donde se mantiene y consulta el catálogo de productos.",
  },
];
