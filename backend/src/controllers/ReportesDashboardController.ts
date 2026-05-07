import { Request, Response } from 'express';
export const getBalanceGeneral = async (req: Request, res: Response) => { res.json({}); };
export const getEstadoResultados = async (req: Request, res: Response) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        if (fechaInicio && fechaFin) {
            if (new Date(fechaInicio as string) > new Date(fechaFin as string)) {
                return res.status(400).json({ error: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
            }
        }
        res.json({});
    } catch (error) { res.status(500).json({ error: 'Error interno' }); }
};