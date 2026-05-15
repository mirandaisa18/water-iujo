/**
 * Controlador para la vista del Panel de Administración.
 * Obtiene métricas clave, alertas de inventario y estado financiero rápido.
 */
export default {
    async getDashboardMetrics() {
        return { ventasDelDia: 0, litrosDespachados: 0, alertasStock: [] };
    }
};