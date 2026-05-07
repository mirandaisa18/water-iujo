import { Request, Response } from 'express';
import { sequelize } from '../config/db';

export const getGastos = async (req: Request, res: Response) => {
    try {
        const [gastos]: any = await sequelize.query(`
            SELECT * FROM Gasto ORDER BY Fecha DESC
        `);
        // Map keys to lowercase for frontend compatibility if needed, or frontend handles it
        const mappedGastos = gastos.map((g: any) => ({
            id: g.ID_Gasto,
            concepto: g.Concepto,
            categoria: g.Categoria,
            monto: g.Monto,
            metodo: g.Metodo,
            fecha: new Date(g.Fecha).toISOString(),
            fechaSolo: new Date(g.Fecha).toLocaleDateString('en-GB')
        }));
        res.json(mappedGastos);
    } catch (error) {
        console.error('Error fetching gastos:', error);
        res.status(500).json({ error: 'Error al obtener los gastos' });
    }
};

export const registrarGasto = async (req: Request, res: Response) => {
    try {
        const { concepto, categoria, monto, metodo } = req.body;

        if (!concepto || !categoria || monto === undefined || monto === null || !metodo) {
            return res.status(400).json({ error: 'Faltan datos obligatorios para el gasto' });
        }

        if (monto <= 0) {
            return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
        }

        const [result]: any = await sequelize.query(`
            INSERT INTO Gasto (Concepto, Categoria, Monto, Metodo) 
            VALUES (?, ?, ?, ?)
        `, {
            replacements: [concepto, categoria, monto, metodo]
        });

        res.status(201).json({ success: true, message: 'Gasto registrado correctamente', id: result });
    } catch (error) {
        console.error('Error registering gasto:', error);
        res.status(500).json({ error: 'Error al registrar el gasto' });
    }
};