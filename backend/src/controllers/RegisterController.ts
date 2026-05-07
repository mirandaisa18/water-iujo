import { Request, Response } from 'express';
export const registrar = async (req: Request, res: Response) => {
    try {
        const datos = req.body;
        if (!datos || typeof datos !== 'object') return res.status(400).json({ error: 'Datos de registro inválidos' });
        if (!datos.nombre || datos.nombre.trim() === '') return res.status(400).json({ error: 'El nombre es obligatorio' });
        if (!datos.email || !/^\S+@\S+\.\S+$/.test(datos.email)) return res.status(400).json({ error: 'Correo inválido' });
        if (!datos.password || datos.password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        res.status(201).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Error interno' }); }
};