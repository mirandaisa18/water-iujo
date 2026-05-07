import { Request, Response } from 'express';
import { sequelize } from '../config/db';

export const buscarClientes = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);
        
        const search = `%${q}%`;
        const [clients]: any = await sequelize.query(`
            SELECT 
                id,
                cedula,
                cedula as rif,
                cedula as cedulaRif,
                nombre,
                telefono,
                email,
                direccion
            FROM clientes
            WHERE cedula LIKE ? OR nombre LIKE ? OR telefono LIKE ?
            LIMIT 10
        `, { replacements: [search, search, search] });
        
        res.json(clients);
    } catch (error) { 
        console.error('Error searching clients:', error);
        res.status(500).json({ error: 'Failed to search clients' }); 
    }
};

export const getClients = async (req: Request, res: Response) => {
    try {
        const [clients]: any = await sequelize.query(`
            SELECT 
                id,
                cedula,
                cedula as rif,
                cedula as cedulaRif,
                nombre,
                telefono,
                email,
                direccion
            FROM clientes
            ORDER BY fecha_registro DESC
        `);
        res.json(clients);
    } catch (error) { 
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' }); 
    }
};

export const registrarCliente = async (req: Request, res: Response) => {
    try {
        console.log('DEBUG: Datos recibidos en registrarCliente:', req.body);
        const { nombre, cedula, telefono, email, direccion } = req.body;
        
        if (!nombre || !cedula) {
            return res.status(400).json({ error: 'Nombre y cédula son obligatorios' });
        }

        // Verificar si ya existe
        const [existe]: any = await sequelize.query(
            'SELECT id FROM clientes WHERE cedula = ?', 
            { replacements: [cedula] }
        );
        
        if (existe.length > 0) {
            return res.status(400).json({ error: 'Ya existe un cliente con esta cédula' });
        }

        // Insertar cliente
        const [result]: any = await sequelize.query(`
            INSERT INTO clientes (nombre, cedula, telefono, email, direccion)
            VALUES (?, ?, ?, ?, ?)
        `, { 
            replacements: [nombre, cedula, telefono || '', email || '', direccion || '']
        });
        
        console.log('DEBUG: Cliente insertado con éxito, result:', result);

        // El id en SQLite suele ser el result
        const idGenerado = result;

        res.json({ 
            success: true, 
            id: idGenerado,
            client: { id: idGenerado, nombre, cedula, telefono, email, direccion }
        });
        
    } catch (error: any) {
        console.error('Error en registrarCliente:', error);
        res.status(500).json({ error: error.message || 'Error interno al registrar cliente' });
    }
};

// Mantener alias para compatibilidad si es necesario
export const createClient = registrarCliente;

export const updateClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, email, direccion } = req.body;
        await sequelize.query(`
            UPDATE clientes 
            SET nombre = ?, telefono = ?, email = ?, direccion = ?
            WHERE id = ?
        `, { replacements: [nombre, telefono, email, direccion, id] });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Failed to update client' }); }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await sequelize.query(`DELETE FROM clientes WHERE id = ?`, { replacements: [id] });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Failed to delete client' }); }
};