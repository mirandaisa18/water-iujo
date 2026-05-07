import { Request, Response } from 'express';
import { sequelize } from '../config/db';

export const getInventario = async (req: Request, res: Response) => {
    try {
        const [productos]: any = await sequelize.query(`
            SELECT 
                ID_Producto as id, 
                Nombre_Prodcuto as nombre, 
                Descripcion_Producto as tipo, 
                Precio_Producto as precio, 
                Precio_Producto as precioVenta,
                Precio_Compra as precioCompra,
                Stock_Actual as stock, 
                Stock_Minimo as minimo,
                Para_Venta as paraVenta,
                Para_Venta as para_venta
            FROM Producto
        `);
        res.json(productos);
    } catch (error) {
        console.error('Error fetching inventario:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const createInventarioItem = async (req: Request, res: Response) => {
    try {
        console.log('DEBUG: Creating inventory item:', req.body);
        const { id, nombre, tipo, precio, precioCompra, stock, minimo, paraVenta } = req.body;
        
        if (!id || !nombre) {
            return res.status(400).json({ error: 'ID y Nombre son obligatorios' });
        }

        // Verificar si el ID ya existe
        const [existing]: any = await sequelize.query(`SELECT ID_Producto FROM Producto WHERE ID_Producto = ?`, { replacements: [id] });
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Ya existe un producto con este Código/ID.' });
        }

        const valPrecio = parseFloat(precio) || 0;
        const valPrecioCompra = parseFloat(precioCompra) || 0;
        const valStock = parseInt(stock) || 0;
        const valMinimo = parseInt(minimo) || 0;
        const valParaVenta = paraVenta !== undefined ? (paraVenta ? 1 : 0) : 1;

        await sequelize.query(`
            INSERT INTO Producto (ID_Producto, Nombre_Prodcuto, Descripcion_Producto, Precio_Producto, Precio_Compra, Stock_Actual, Stock_Minimo, Para_Venta)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, { replacements: [id, nombre, tipo || 'Producto', valPrecio, valPrecioCompra, valStock, valMinimo, valParaVenta] });
        
        console.log('✅ Inventario item creado con éxito:', id);
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('❌ Error creating inventario item:', error);
        res.status(500).json({ error: 'Error interno al crear producto' });
    }
};

export const updateInventarioItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, precio, precioCompra, stock, minimo, paraVenta } = req.body;
        console.log(`DEBUG: Updating inventory item ${id}:`, req.body);

        const valPrecio = parseFloat(precio) || 0;
        const valPrecioCompra = parseFloat(precioCompra) || 0;
        const valStock = parseInt(stock) || 0;
        const valMinimo = parseInt(minimo) || 0;
        const valParaVenta = paraVenta !== undefined ? (paraVenta ? 1 : 0) : 1;
        
        await sequelize.query(`
            UPDATE Producto 
            SET Nombre_Prodcuto = ?, Descripcion_Producto = ?, Precio_Producto = ?, Precio_Compra = ?, Stock_Actual = ?, Stock_Minimo = ?, Para_Venta = ?
            WHERE ID_Producto = ?
        `, { replacements: [nombre, tipo, valPrecio, valPrecioCompra, valStock, valMinimo, valParaVenta, id] });
        
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error updating inventario:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const deleteInventarioItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await sequelize.query(`DELETE FROM Producto WHERE ID_Producto = ?`, { replacements: [id] });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting inventario:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};