import { Request, Response } from 'express';
export const getConfig = async (req: Request, res: Response) => { res.json({}); };
export const updateConfig = async (req: Request, res: Response) => {
    try {
        const { configuracion } = req.body;
        if (!configuracion || typeof configuracion !== 'object') return res.status(400).json({ error: 'Configuración inválida' });
        if (configuracion.precio_5L !== undefined && configuracion.precio_5L < 0) return res.status(400).json({ error: 'El precio no puede ser negativo' });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Error interno' }); }
};