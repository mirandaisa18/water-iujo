import { Request, Response } from 'express';
export const solicitarRecuperacion = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Debe proporcionar un correo válido' });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Error interno' }); }
};
export const restablecerPassword = async (req: Request, res: Response) => {
    try {
        const { token, nuevoPassword } = req.body;
        if (!token) return res.status(400).json({ error: 'Token requerido' });
        if (!nuevoPassword || nuevoPassword.length < 6) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Error interno' }); }
};