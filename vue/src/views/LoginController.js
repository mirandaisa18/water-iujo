export default {
    async login(email, password) {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Correo inválido");
        if (!password || password.trim() === '') throw new Error("Contraseña requerida");
        return null;
    },
    async logout() { return true; }
};