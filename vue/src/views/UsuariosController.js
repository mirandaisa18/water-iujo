export default {
    async getEmpleados() { return []; },
    async registrarEmpleado(datos) {
        if (!datos || !datos.nombre || !datos.rol) throw new Error("Datos de empleado incompletos");
        if (!['Administrador', 'Despachador'].includes(datos.rol)) throw new Error("Rol inválido");
        return null;
    },
    async cambiarRolEmpleado(id, nuevoRol) {
        if (!id) throw new Error("ID de empleado requerido");
        if (!['Administrador', 'Despachador'].includes(nuevoRol)) throw new Error("Rol inválido");
        return true;
    },
    async eliminarEmpleado(id) {
        if (!id) throw new Error("ID de empleado requerido");
        return true;
    }
};