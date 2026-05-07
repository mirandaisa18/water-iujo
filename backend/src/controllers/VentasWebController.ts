import { Request, Response } from 'express';
export const getPedidosPendientes = async (req: Request, res: Response) => { res.json([]); };
export const confirmarPedido = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID de pedido requerido' });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Error interno' }); }
};