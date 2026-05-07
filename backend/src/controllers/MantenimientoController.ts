import { Request, Response } from 'express';
import { sequelize } from '../config/db';

export const getMantenimientos = async (req: Request, res: Response) => {
    try {
        const [mantenimientos]: any = await sequelize.query(`
            SELECT * FROM mantenimientos ORDER BY fecha_cambio DESC
        `);
        res.json(mantenimientos);
    } catch (error) {
        console.error('Error fetching mantenimientos:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const registrarMantenimiento = async (req: Request, res: Response) => {
    try {
        const { tipo_mantenimiento, costo, fecha_proximo, observaciones, realizado_por } = req.body;

        if (!tipo_mantenimiento || costo === undefined || !fecha_proximo) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        const [result]: any = await sequelize.query(`
            INSERT INTO mantenimientos (tipo_mantenimiento, costo, fecha_proximo, observaciones, realizado_por)
            VALUES (?, ?, ?, ?, ?)
        `, {
            replacements: [
                tipo_mantenimiento, 
                costo, 
                fecha_proximo, 
                observaciones || '', 
                realizado_por || ''
            ]
        });

        res.status(201).json({ success: true, message: 'Mantenimiento registrado' });
    } catch (error) {
        console.error('Error registering mantenimiento:', error);
        res.status(500).json({ error: 'Error interno al registrar mantenimiento' });
    }
};
