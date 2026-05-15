export default {
    async registrar(datos) {
        if (!datos || typeof datos !== 'object') throw new Error("Datos de registro inválidos");
        if (!datos.nombre || datos.nombre.trim() === '') throw new Error("El nombre es obligatorio");
        if (!datos.email || !/^\S+@\S+\.\S+$/.test(datos.email)) throw new Error("Correo inválido");
        if (!datos.password || datos.password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");
        return null;
    }
};