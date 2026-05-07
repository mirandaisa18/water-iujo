import { Request, Response } from 'express';
export const getDashboardMetrics = async (req: Request, res: Response) => {
    try { res.json({ ventasDelDia: 0, litrosDespachados: 0, alertasStock: [] }); }
    catch (e) { res.status(500).json({ error: 'Error del servidor' }); }
};