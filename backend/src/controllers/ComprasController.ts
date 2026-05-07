import { Request, Response } from 'express';
import { sequelize } from '../config/db';

export const getProveedores = async (req: Request, res: Response) => {
    try {
        const [proveedores]: any = await sequelize.query(`SELECT * FROM proveedores ORDER BY nombre ASC`);
        res.json(proveedores);
    } catch (error) {
        console.error('Error fetching proveedores:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const crearProveedor = async (req: Request, res: Response) => {
    try {
        const { nombre, contacto, telefono, email, direccion } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

        const [result]: any = await sequelize.query(`
            INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) 
            VALUES (?, ?, ?, ?, ?)
        `, { replacements: [nombre, contacto || '', telefono || '', email || '', direccion || ''] });

        res.status(201).json({ success: true, id: result });
    } catch (error) {
        console.error('Error creating proveedor:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const updateProveedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, contacto, telefono, email, direccion } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

        await sequelize.query(`
            UPDATE proveedores 
            SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ?
            WHERE id = ?
        `, { replacements: [nombre, contacto || '', telefono || '', email || '', direccion || '', id] });

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating proveedor:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const deleteProveedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Verificar si tiene compras asociadas
        const [compras]: any = await sequelize.query(`
            SELECT COUNT(*) as count FROM compras WHERE proveedor_id = ?
        `, { replacements: [id] });
        
        if (compras.length > 0 && compras[0].count > 0) {
            return res.status(400).json({ error: 'No se puede eliminar este proveedor porque tiene compras registradas en el historial.' });
        }

        await sequelize.query(`DELETE FROM proveedores WHERE id = ?`, { replacements: [id] });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting proveedor:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const getCompras = async (req: Request, res: Response) => {
    try {
        const [compras]: any = await sequelize.query(`
            SELECT c.*, p.nombre as proveedor_nombre 
            FROM compras c
            LEFT JOIN proveedores p ON c.proveedor_id = p.id
            ORDER BY c.fecha DESC
        `);
        res.json(compras);
    } catch (error) {
        console.error('Error fetching compras:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const registrarCompra = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { proveedor_id, producto_id, cantidad, precio_unitario } = req.body;

        if (!proveedor_id || !producto_id || !cantidad || !precio_unitario) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Faltan datos de la compra' });
        }

        const total = cantidad * precio_unitario;

        // Registrar la compra
        await sequelize.query(`
            INSERT INTO compras (proveedor_id, producto_id, cantidad, precio_unitario, total)
            VALUES (?, ?, ?, ?, ?)
        `, {
            replacements: [proveedor_id, producto_id, cantidad, precio_unitario, total],
            transaction
        });

        // Incrementar stock del producto
        await sequelize.query(`
            UPDATE Producto 
            SET Stock_Actual = Stock_Actual + ? 
            WHERE ID_Producto = ?
        `, {
            replacements: [cantidad, producto_id],
            transaction
        });

        await transaction.commit();
        res.status(201).json({ success: true, message: 'Compra registrada y stock actualizado' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error registering compra:', error);
        res.status(500).json({ error: 'Error interno al registrar la compra' });
    }
};
