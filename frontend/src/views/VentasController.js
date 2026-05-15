export default {
    async registrarVenta(venta) {
        if (!venta || typeof venta !== 'object') throw new Error("Datos de venta inválidos");
        if (!venta.items || !Array.isArray(venta.items) || venta.items.length === 0) throw new Error("El pedido debe contener al menos un producto o recarga");
        
        // Validar método de pago (algunos pedidos web pueden decir 'No especificado' pero validaremos locales)
        if (!venta.metodo) throw new Error("Método de pago no especificado");

        // Validar items
        let requiereBotellonFisico = false;
        venta.items.forEach(item => {
            if (item.cantidad <= 0 || !Number.isInteger(item.cantidad)) throw new Error("Cantidad de item inválida");
            if (!item.esServicio && item.tipo === 'botellon') requiereBotellonFisico = true;
        });

        if (requiereBotellonFisico) {
            const hayStock = await this.validarStockFisico();
            if (!hayStock) throw new Error("No hay stock suficiente de botellones físicos para completar la venta integral");
        }
        
        return null;
    },
    async validarStockFisico() { return true; },
    async getHistorialVentas() { return []; }
};