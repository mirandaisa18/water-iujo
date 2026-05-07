import { Request, Response } from 'express';
import { sequelize } from '../config/db';
import path from 'path';
import fs from 'fs';

export const descargarRespaldo = async (req: Request, res: Response) => {
    try {
        const dbPath = path.join(__dirname, '../../database.sqlite');
        if (fs.existsSync(dbPath)) {
            res.download(dbPath, `respaldo_wateriujo_${new Date().toISOString().split('T')[0]}.sqlite`);
        } else {
            res.status(404).json({ error: 'Base de datos no encontrada' });
        }
    } catch (error) {
        console.error('Error en descarga de respaldo:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const formatearSistema = async (req: Request, res: Response) => {
    try {
        const transaction = await sequelize.transaction();
        try {
            // Limpiar tablas transaccionales
            await sequelize.query('DELETE FROM detalle_ventas', { transaction });
            await sequelize.query('DELETE FROM ventas', { transaction });
            await sequelize.query('DELETE FROM Gasto', { transaction });
            await sequelize.query('DELETE FROM compras', { transaction });
            
            // Opcional: Reiniciar contadores (SQLite autoincrement)
            await sequelize.query("DELETE FROM sqlite_sequence WHERE name IN ('ventas', 'detalle_ventas', 'Gasto', 'compras')", { transaction });

            await transaction.commit();
            res.json({ success: true, message: 'Sistema formateado exitosamente (Ventas, Gastos y Compras borrados)' });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error: any) {
        console.error('Error en formateo:', error);
        res.status(500).json({ error: error.message || 'Error al formatear' });
    }
};

export const reiniciarCatalogo = async (req: Request, res: Response) => {
    try {
        const transaction = await sequelize.transaction();
        try {
            // Limpiar productos
            await sequelize.query('DELETE FROM Producto', { transaction });
            await transaction.commit();
            res.json({ success: true, message: 'Catálogo de productos reiniciado' });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error: any) {
        console.error('Error en reinicio de catálogo:', error);
        res.status(500).json({ error: 'Error al reiniciar catálogo' });
    }
};
