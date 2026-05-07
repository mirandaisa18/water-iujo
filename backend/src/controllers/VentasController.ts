import { Request, Response } from 'express';
import { sequelize } from '../config/db';

export const registrarVenta = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const venta = req.body;
        if (!venta || typeof venta !== 'object') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Datos de venta inválidos' });
        }
        
        const { cliente, items, metodo, totalUSD, totalBS, tasa, delivery } = venta;
        console.log('DEBUG: Registering sale for client:', cliente?.id || cliente?.cedulaRif || 'N/A');
        console.log('DEBUG: Items in sale:', items?.length);

        if (!items || !Array.isArray(items) || items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'El pedido debe contener al menos un producto o recarga' });
        }

        let cantidadBotellonesFisicos = 0;
        
        // 1. Identificar cuántos botellones físicos se requieren
        for (const item of items) {
            const tipo = item.tipo ? item.tipo.toLowerCase() : '';
            // Si el item es un combo o botellón nuevo, requiere descontar inventario físico
            if (tipo.includes('botellon') || tipo.includes('botellón') || tipo.includes('integral') || tipo.includes('combo')) {
                // Solo si el item representa el envase físico
                if (!item.esServicio || tipo.includes('integral') || tipo.includes('combo')) {
                    cantidadBotellonesFisicos += item.cantidad;
                }
            }
        }

        // 2. Validar Stock (Regla 3: No permitir si stock = 0)
        if (cantidadBotellonesFisicos > 0) {
            // Buscamos el producto que represente el Botellón Nuevo de 20L
            const [stockData]: any = await sequelize.query(`
                SELECT ID_Producto, Stock_Actual FROM Producto 
                WHERE (ID_Producto = 'B20N' OR Nombre_Prodcuto LIKE '%Botellón%Nuevo%' OR Descripcion_Producto = 'botellon')
                AND Stock_Actual > 0
                LIMIT 1
            `, { transaction });
            
            const productoFisico = stockData.length > 0 ? stockData[0] : null;
            
            if (!productoFisico || productoFisico.Stock_Actual < cantidadBotellonesFisicos) {
                await transaction.rollback();
                const actual = productoFisico ? productoFisico.Stock_Actual : 0;
                return res.status(400).json({ 
                    error: `No hay stock suficiente de botellones físicos. Disponible: ${actual}, Requerido: ${cantidadBotellonesFisicos}` 
                });
            }

            // 3. Descontar Stock (Regla 2: Descontar botellones físicos)
            await sequelize.query(`
                UPDATE Producto 
                SET Stock_Actual = Stock_Actual - ? 
                WHERE ID_Producto = ?
            `, { 
                replacements: [cantidadBotellonesFisicos || 0, productoFisico?.ID_Producto || 'N/A'],
                transaction 
            });
            console.log(`DEBUG: Descontados ${cantidadBotellonesFisicos} botellones del producto ${productoFisico.ID_Producto}`);
        }

        // 4. Validar existencia de Cliente y Vendedor
        const { vendedor_id, referencia, pagador_nombre, pagador_telefono } = venta;
        const cedulaCliente = cliente?.cedula || cliente?.rif || cliente?.cedulaRif || (typeof cliente === 'string' ? cliente : null) || 'V-00000000';

        const [clientExists]: any = await sequelize.query(
            'SELECT cedula FROM clientes WHERE cedula = ?', 
            { replacements: [cedulaCliente], transaction }
        );
        if (clientExists.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: `El cliente con Cédula/RIF ${cedulaCliente} no existe en la base de datos.` });
        }

        const [vendedorExists]: any = await sequelize.query(
            'SELECT Cedula_Usuario FROM Usuario WHERE Cedula_Usuario = ?', 
            { replacements: [vendedor_id || 'V-00000001'], transaction }
        );
        if (vendedorExists.length === 0 && vendedor_id) {
            await transaction.rollback();
            return res.status(400).json({ error: `El vendedor con ID ${vendedor_id} no existe en la base de datos.` });
        }

        // 5. Obtener el ID numérico del cliente
        const [clientData]: any = await sequelize.query(
            'SELECT id FROM clientes WHERE cedula = ?', 
            { replacements: [cedulaCliente], transaction }
        );
        const clienteIdFinal = clientData.length > 0 ? clientData[0].id : null;

        // 6. Registrar la Venta en la tabla 'ventas'
        const ventaResult: any = await sequelize.query(`
            INSERT INTO ventas (fecha, total_usd, total_bs, metodo_pago, cliente_id, tasa_bcv, delivery_costo, vendedor_id, referencia_pago, nombre_pagador, telefono_pagador, subtotal, iva)
            VALUES (CURRENT_TIMESTAMP, :total, :totalBS, :metodo, :cliente, :tasa, :delivery, :vendedor, :ref, :pagador, :tel, :sub, :iva)
        `, {
            replacements: {
                total: totalUSD || venta.monto || 0, 
                totalBS: totalBS || 0,
                metodo: metodo || 'Efectivo', 
                cliente: clienteIdFinal, 
                tasa: tasa || 0, 
                delivery: delivery?.costo || 0,
                vendedor: vendedor_id || null,
                ref: referencia || null,
                pagador: pagador_nombre || null,
                tel: pagador_telefono || null,
                sub: venta.subtotalUSD || 0,
                iva: venta.ivaUSD || 0
            },
            type: 'INSERT',
            transaction
        });

        const idVenta = Array.isArray(ventaResult) ? ventaResult[0] : ventaResult;

        // 7. Registrar el Detalle de la Venta en 'detalle_ventas'
        for (const item of items) {
            const precioUnitario = item.precioVenta || item.precio || 0;
            const subtotal = item.cantidad * precioUnitario;
            
            // Validar que el producto existe
            const [prodExists]: any = await sequelize.query(
                'SELECT ID_Producto FROM Producto WHERE ID_Producto = ?',
                { replacements: [item.id || item.ID_Producto || 'N/A'], transaction }
            );
            if (prodExists.length === 0) {
                await transaction.rollback();
                return res.status(400).json({ error: `El producto con ID ${item.id} (${item.nombre}) no existe.` });
            }

            await sequelize.query(`
                INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal, tipo_item, tamanio_litros)
                VALUES (:idVenta, :idProd, :qty, :precio, :sub, :tipo, :litros)
            `, {
                replacements: {
                    idVenta: idVenta, 
                    idProd: item.id || item.ID_Producto || 'N/A', 
                    qty: item.cantidad || 0, 
                    precio: precioUnitario || 0, 
                    sub: subtotal || 0,
                    tipo: item.tipo || 'Producto',
                    litros: item.litros || (item.nombre && item.nombre.includes('L') ? (parseInt(item.nombre.match(/\d+/)?.[0]) || 0) : 0)
                },
                type: 'INSERT',
                transaction
            });
        }

        await transaction.commit();
        res.status(201).json({ 
            success: true, 
            message: 'Venta registrada y stock actualizado correctamente',
            idVenta: idVenta
        });
    } catch (error: any) { 
        await transaction.rollback();
        console.error('❌ Error al registrar la venta:', error);
        res.status(500).json({ error: 'Error interno: ' + error.message }); 
    }
};
export const validarStockFisico = async (req: Request, res: Response) => { res.json({ hayStock: true }); };
export const getHistorialVentas = async (req: Request, res: Response) => { try { const userRole = req.headers['x-user-role'] as string; const userId = req.headers['x-user-id'] as string; let query = `SELECT v.id, v.fecha as timestamp, v.total_usd as monto, v.total_bs, v.metodo_pago as metodo, v.cliente_id, v.tasa_bcv as tasa, v.referencia_pago as referencia, v.vendedor_id, c.nombre as cliente_nombre, c.cedula as cliente_cedula FROM ventas v LEFT JOIN clientes c ON v.cliente_id = c.id`; const replacements: any = {}; if (userRole === 'cajero' && userId) { query += ` WHERE v.vendedor_id = :userId`; replacements.userId = userId; } query += ` ORDER BY v.fecha DESC`; const [ventas]: any = await sequelize.query(query, { replacements }); const salesWithDetails = await Promise.all(ventas.map(async (v: any) => { const [details]: any = await sequelize.query(`SELECT dv.producto_id as id, dv.cantidad as cant, dv.precio_unitario as precio, dv.subtotal, p.Nombre_Prodcuto as nombre, dv.tipo_item as tipo FROM detalle_ventas dv LEFT JOIN Producto p ON dv.producto_id = p.ID_Producto WHERE dv.venta_id = ?`, { replacements: [v.id] }); return { ...v, cliente: v.cliente_nombre || 'Consumidor Final', items: details }; })); res.json(salesWithDetails); } catch (error: any) { console.error(' Error al obtener historial de ventas:', error); res.status(500).json({ error: 'Error interno: ' + error.message }); } };

