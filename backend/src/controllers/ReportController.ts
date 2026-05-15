import { Request, Response } from 'express';
import { sequelize } from '../config/db';

export const getBalanceReport = async (req: Request, res: Response) => {
    try {
        const [ventasData]: any = await sequelize.query(`SELECT SUM(total_usd) as suma_ventas FROM ventas`);
        const sumaVentas = ventasData[0]?.suma_ventas || 0;

        const [inventarioData]: any = await sequelize.query(`
            SELECT SUM(
                COALESCE(
                    (SELECT s.Cantidad FROM Stock s WHERE s.ID_Producto = p.ID_Producto ORDER BY s.Fecha_Movimiento DESC LIMIT 1),
                    0
                ) * COALESCE(p.Precio_Producto, 0)
            ) as valor_inventario
            FROM Producto p
        `);
        const valorInventario = inventarioData[0]?.valor_inventario || 0;

        const activos = sumaVentas + valorInventario;

        const [comprasData]: any = await sequelize.query(`SELECT SUM(total) as suma_compras FROM compras`);
        const pasivos = comprasData[0]?.suma_compras || 0;

        const patrimonio = activos - pasivos;

        const [ingresosRecargas]: any = await sequelize.query(`
            SELECT SUM(total_usd) as ingresos FROM ventas WHERE tipo_venta = 'solo_recarga'
        `);
        const [ingresosBotellones]: any = await sequelize.query(`
            SELECT SUM(total_usd) as ingresos FROM ventas WHERE tipo_venta IN ('botellon_nuevo', 'combo')
        `);
        const totalIngresos = (ingresosRecargas[0]?.ingresos || 0) + (ingresosBotellones[0]?.ingresos || 0);

        const [gastosData]: any = await sequelize.query(`SELECT SUM(Monto) as suma_gastos FROM Gasto`);
        const totalGastos = gastosData[0]?.suma_gastos || 0;

        const utilidadNeta = totalIngresos - totalGastos;

        res.json({
            activos,
            pasivos,
            patrimonio,
            estado_resultados: {
                ingresos_recargas: ingresosRecargas[0]?.ingresos || 0,
                ingresos_botellones: ingresosBotellones[0]?.ingresos || 0,
                total_ingresos: totalIngresos,
                total_gastos: totalGastos,
                utilidad_neta: utilidadNeta
            }
        });
    } catch (e) {
        console.error('Error in getBalanceReport:', e);
        res.status(500).json({ error: 'Error calculando reportes' });
    }
};

export const getVolumeReport = async (req: Request, res: Response) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        if (fechaInicio && fechaFin && new Date(fechaInicio as string) > new Date(fechaFin as string)) {
            return res.status(400).json({ error: 'Rango de fechas inválido' });
        }

        let query = `
            SELECT SUM(dv.cantidad * dv.tamanio_litros) as total_litros
            FROM detalle_ventas dv
            JOIN ventas v ON dv.venta_id = v.id
        `;
        const replacements: any[] = [];

        if (fechaInicio && fechaFin) {
            query += ` WHERE v.fecha BETWEEN ? AND ?`;
            replacements.push(fechaInicio, `${fechaFin} 23:59:59`);
        }

        const [volumenData]: any = await sequelize.query(query, { replacements });
        let total_litros = volumenData[0]?.total_litros || 0;

        if (!total_litros) {
            const [fallbackData]: any = await sequelize.query(`
                SELECT SUM(dv.cantidad * 
                    COALESCE(dv.tamanio_litros,
                        CAST(REPLACE(REPLACE(p.Nombre_Prodcuto, 'L', ''), ' ', '') AS REAL)
                    )
                ) as litros
                FROM detalle_ventas dv
                LEFT JOIN Producto p ON dv.producto_id = p.ID_Producto
                JOIN ventas v ON dv.venta_id = v.id
                ${fechaInicio && fechaFin ? 'WHERE v.fecha BETWEEN ? AND ?' : ''}
            `, { replacements: fechaInicio && fechaFin ? replacements : [] });
            total_litros = fallbackData[0]?.litros || 0;
        }

        const tendencia_semanal = [
            { fecha: 'Lun', litros: total_litros * 0.1 },
            { fecha: 'Mar', litros: total_litros * 0.15 },
            { fecha: 'Mie', litros: total_litros * 0.2 },
            { fecha: 'Jue', litros: total_litros * 0.1 },
            { fecha: 'Vie', litros: total_litros * 0.25 },
            { fecha: 'Sab', litros: total_litros * 0.15 },
            { fecha: 'Dom', litros: total_litros * 0.05 }
        ];

        res.json({
            total_litros_mes: total_litros,
            tendencia_semanal
        });
    } catch (e) {
        console.error('Error in getVolumeReport:', e);
        res.status(500).json({ error: 'Error calculando volumen' });
    }
};

export const getProductsReport = async (req: Request, res: Response) => {
    try {
        const [reportData]: any = await sequelize.query(`
            SELECT dv.producto_id as id,
                   p.Nombre_Prodcuto as nombre,
                   SUM(dv.cantidad) as cantidad_vendida,
                   SUM(dv.subtotal) as total_ventas
            FROM detalle_ventas dv
            LEFT JOIN Producto p ON dv.producto_id = p.ID_Producto
            GROUP BY dv.producto_id
            ORDER BY total_ventas DESC
            LIMIT 20
        `);

        res.json(reportData);
    } catch (e) {
        console.error('Error in getProductsReport:', e);
        res.status(500).json({ error: 'Error calculando reporte de productos' });
    }
};

export const getPaymentsReport = async (req: Request, res: Response) => {
    try {
        const [reportData]: any = await sequelize.query(`
            SELECT metodo_pago as metodo,
                   COUNT(*) as numero_ventas,
                   SUM(total_usd) as total_usd
            FROM ventas
            GROUP BY metodo_pago
            ORDER BY total_usd DESC
        `);

        res.json(reportData);
    } catch (e) {
        console.error('Error in getPaymentsReport:', e);
        res.status(500).json({ error: 'Error calculando reporte de pagos' });
    }
};

export const getUsersActivityReport = async (req: Request, res: Response) => {
    try {
        const [activityData]: any = await sequelize.query(`
            SELECT v.vendedor_id as vendedor,
                   COUNT(*) as ventas_realizadas,
                   SUM(v.total_usd) as total_usd,
                   MAX(v.fecha) as ultima_venta
            FROM ventas v
            GROUP BY v.vendedor_id
            ORDER BY ventas_realizadas DESC
        `);

        res.json(activityData);
    } catch (e) {
        console.error('Error in getUsersActivityReport:', e);
        res.status(500).json({ error: 'Error calculando actividad de usuarios' });
    }
};