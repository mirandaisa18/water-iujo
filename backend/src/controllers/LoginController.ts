import { Request, Response } from 'express';
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Correo inválido' });
        if (!password || password.trim() === '') return res.status(400).json({ error: 'Contraseña requerida' });
        res.status(200).json({ token: 'dummy_token' });
    } catch (error) { res.status(500).json({ error: 'Error interno' }); }
};
export const logout = async (req: Request, res: Response) => { res.json({ success: true }); };