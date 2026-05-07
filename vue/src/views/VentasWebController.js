export default {
    async getPedidosPendientes() { return []; },
    async confirmarPedido(id) {
        if (!id) throw new Error("ID de pedido requerido");
        return true;
    }
};