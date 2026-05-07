export default {
    async solicitarRecuperacion(email) {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Debe proporcionar un correo válido");
        return true;
    },
    async restablecerPassword(token, nuevoPassword) {
        if (!token) throw new Error("Token requerido");
        if (!nuevoPassword || nuevoPassword.length < 6) throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
        return true;
    }
};