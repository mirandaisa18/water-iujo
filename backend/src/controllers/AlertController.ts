import { Request, Response } from 'express';
import { sequelize } from '../config/db';

export const getAlertas = async (req: Request, res: Response) => {
    try {
        const alertas: any[] = [];

        // 1. Alertas de Stock Bajo
        // Buscamos productos donde la cantidad actual en Stock es menor al Stock_Minimo
        // Nota: La tabla Stock tiene el campo Cantidad. 
        // Usamos la última entrada de stock para cada producto o sumamos (depende de la lógica del sistema)
        // Viendo el schema, Stock parece ser un historial. Pero tomaremos el valor más reciente.
        const [lowStockProducts]: any = await sequelize.query(`
            SELECT p.Nombre_Prodcuto, s.Cantidad, p.Stock_Minimo 
            FROM Producto p
            JOIN Stock s ON p.ID_Producto = s.ID_Producto
            WHERE s.Cantidad < p.Stock_Minimo
            GROUP BY p.ID_Producto
            HAVING s.Fecha_Movimiento = MAX(s.Fecha_Movimiento)
        `);

        lowStockProducts.forEach((p: any) => {
            alertas.push({
                tipo: 'stock',
                prioridad: 'alta',
                mensaje: `Stock bajo en ${p.Nombre_Prodcuto}: ${p.Cantidad} (Mínimo: ${p.Stock_Minimo})`
            });
        });

        // 2. Alertas de Mantenimiento
        // Próximos 7 días
        const hoy = new Date().toISOString();
        const enSieteDias = new Date();
        enSieteDias.setDate(enSieteDias.getDate() + 7);
        const fechaLimite = enSieteDias.toISOString();

        const [mantenimientos]: any = await sequelize.query(`
            SELECT * FROM mantenimientos 
            WHERE fecha_proximo <= ? AND fecha_proximo >= ?
        `, { replacements: [fechaLimite, hoy] });

        mantenimientos.forEach((m: any) => {
            alertas.push({
                tipo: 'mantenimiento',
                prioridad: 'media',
                mensaje: `Mantenimiento próximo: ${m.tipo_mantenimiento} el ${new Date(m.fecha_proximo).toLocaleDateString()}`
            });
        });

        res.json(alertas);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
};
