// =============================================================================
// DATOS DEMO - MÓDULO DE REPORTES (Panel Analítico Avanzado)
// =============================================================================
// Estos datos son TEMPORALES y se usan cuando el backend no está disponible.
// Fueron creados para mantener la estética y funcionalidad del panel sin BD.
//
// PARA REMOVER: Simplemente elimina este archivo y quita el fallback en
// ReportesDashboard.vue (busca el comentario "DEMO FALLBACK").
// =============================================================================

/**
 * Simula la respuesta de GET /api/reports/balance
 * Muestra ingresos positivos, gastos menores e igual utilidad neta positiva.
 */
export const MOCK_BALANCE = {
  estado_resultados: {
    total_ingresos: 4850.00,
    total_gastos:   1200.00,
    utilidad_neta:  3650.00  // Siempre positivo: total_ingresos - total_gastos
  }
};

/**
 * Simula la respuesta de GET /api/reports/volume
 * Muestra la tendencia de litros despachados en los últimos días.
 */
export const MOCK_VOLUMEN = {
  total_litros_mes: 12800,
  tendencia_semanal: [
    { fecha: '2026-04-08', litros: 1200 },
    { fecha: '2026-04-09', litros: 850 },
    { fecha: '2026-04-10', litros: 1400 },
    { fecha: '2026-04-11', litros: 600 },
    { fecha: '2026-04-12', litros: 1050 },
    { fecha: '2026-04-13', litros: 1300 },
    { fecha: '2026-04-14', litros: 920 }
  ]
};

/**
 * Simula la respuesta de GET /api/reports/products
 * Top ventas por producto con ranking, operaciones y montos.
 */
export const MOCK_PRODUCTOS = {
  ranking: [
    { id: 1, nombre: 'Recarga Válvula 20L',       tipo: 'Servicio Llenado',  cantidad: 45, monto_total: 67.50 },
    { id: 2, nombre: 'Botellón Nuevo + Recarga 20L', tipo: 'Físico',         cantidad: 3,  monto_total: 45.00 },
    { id: 3, nombre: 'Recarga Válvula 10L',       tipo: 'Servicio Llenado',  cantidad: 10, monto_total: 8.00  },
    { id: 4, nombre: 'Combo Familiar',            tipo: 'Combo',             cantidad: 6,  monto_total: 108.00 },
    { id: 5, nombre: 'Filtro de Carbón Activado', tipo: 'Insumo',            cantidad: 2,  monto_total: 60.00 }
  ]
};

/**
 * Simula la respuesta de GET /api/reports/payments
 * Distribución por método de pago con porcentajes calculados.
 */
export const MOCK_PAGOS = {
  distribucion: [
    { metodo: 'Divisas',       transacciones: 2,  monto: 60.00, porcentaje: 50.0 },
    { metodo: 'Efectivo',      transacciones: 1,  monto: 10.00, porcentaje: 8.3  },
    { metodo: 'Pago Móvil',    transacciones: 1,  monto: 5.00,  porcentaje: 4.2  },
    { metodo: 'Punto de Venta',transacciones: 1,  monto: 20.00, porcentaje: 16.7 },
    { metodo: 'Transferencia', transacciones: 1,  monto: 25.00, porcentaje: 20.8 }
  ]
};

/**
 * Simula la respuesta de GET /api/reports/activity
 * Rendimiento operativo del personal registrado.
 */
export const MOCK_USUARIOS = {
  usuarios: [
    { nombre: 'Administrador', rol: 'Administrador', tickets_procesados: 3,  litros_despachados: 600, monto_recaudado: 75.00  },
    { nombre: 'Cajero Finde',  rol: 'Cajero',        tickets_procesados: 2,  litros_despachados: 400, monto_recaudado: 45.00  },
    { nombre: 'Repartidor 1',  rol: 'Delivery',      tickets_procesados: 5,  litros_despachados: 800, monto_recaudado: 0.00   }
  ]
};
