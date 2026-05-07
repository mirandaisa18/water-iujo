export default {
    async getEntregasPendientes() { return []; },
    async actualizarEstadoEntrega(id, estado) {
        if (!id) throw new Error("ID de entrega requerido");
        if (!['Pendiente', 'En Ruta', 'Entregado', 'Cancelado'].includes(estado)) throw new Error("Estado de entrega inválido");
        return true;
    }
};