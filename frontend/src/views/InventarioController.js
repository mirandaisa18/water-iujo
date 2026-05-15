export default {
    async getStockActual() { return []; },
    async registrarCompraBotellones(compra) {
        if (!compra || typeof compra !== 'object') throw new Error("Datos de compra inválidos");
        if (!compra.cantidad || compra.cantidad <= 0 || !Number.isInteger(compra.cantidad)) throw new Error("La cantidad debe ser un número entero mayor a 0");
        if (!compra.costo || compra.costo < 0) throw new Error("El costo no puede ser negativo");
        return null;
    },
    async verificarAlertasStock() { return []; }
};