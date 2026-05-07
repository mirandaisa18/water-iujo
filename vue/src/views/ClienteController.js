/**
 * Controlador para gestionar el registro y consulta de Clientes.
 */
export default {
    async getClientes() { return []; },
    async createCliente(data) {
        if (!data || typeof data !== 'object') throw new Error("Datos de cliente inválidos");
        if (!data.nombre || data.nombre.trim() === '') throw new Error("El nombre es obligatorio");
        if (!data.cedula || data.cedula.trim() === '') throw new Error("La cédula es obligatoria");
        return null;
    },
    async updateCliente(id, data) {
        if (!id) throw new Error("El ID del cliente es requerido para actualizar");
        if (!data || typeof data !== 'object') throw new Error("Datos de actualización inválidos");
        return null;
    },
    async deleteCliente(id) {
        if (!id) throw new Error("El ID del cliente es requerido para eliminar");
        return true;
    }
};