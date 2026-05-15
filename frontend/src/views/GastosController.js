export default {
    async getGastos() { return []; },
    async registrarGasto(gasto) {
        if (!gasto || typeof gasto !== 'object') throw new Error("Datos del gasto inválidos");
        if (!gasto.categoria || !['Electricidad', 'Internet', 'Alquiler', 'Agua', 'Otros'].includes(gasto.categoria)) {
            throw new Error("Categoría de gasto inválida");
        }
        if (!gasto.monto || gasto.monto <= 0) throw new Error("El monto debe ser mayor a 0");
        return null;
    }
};