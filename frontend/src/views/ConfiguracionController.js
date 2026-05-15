/**
 * Controlador para las variables y parámetros del sistema.
 */
export default {
    async getConfig() { return {}; },
    async updateConfig(configuracion) {
        if (!configuracion || typeof configuracion !== 'object') throw new Error("Configuración inválida");
        if (configuracion.precio_5L !== undefined && configuracion.precio_5L < 0) throw new Error("El precio no puede ser negativo");
        return true;
    }
};