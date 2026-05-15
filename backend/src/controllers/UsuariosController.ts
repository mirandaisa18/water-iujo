import { Request, Response } from 'express';
import { sequelize } from '../config/db';
import bcrypt from 'bcryptjs';

export const getEmpleados = async (req: Request, res: Response) => {
    try {
        const [usuarios]: any = await sequelize.query(`
            SELECT Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, Direccion 
            FROM Usuario
        `);
        res.json(usuarios);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const registrarEmpleado = async (req: Request, res: Response) => {
    try {
        const { cedula, nombre, apellido, correo, rol, password, direccion } = req.body;
        
        if (!correo || !nombre || !rol || !password) {
            return res.status(400).json({ error: 'Datos de empleado incompletos (correo, nombre, rol, password son obligatorios)' });
        }
        
        if (!['admin', 'cajero', 'delivery'].includes(rol)) {
            return res.status(400).json({ error: 'Rol inválido. Debe ser admin, cajero o delivery.' });
        }

        const cedulaFinal = cedula || `V-${Date.now()}`;
        const hash = bcrypt.hashSync(password, 10);

        await sequelize.query(`
            INSERT INTO Usuario (Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, Contraseña, Direccion)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, {
            replacements: [cedulaFinal, nombre, apellido || '', correo, rol, hash, direccion || '']
        });

        res.status(201).json({ success: true, message: 'Usuario creado exitosamente' });
    } catch (error: any) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error.message || 'Error interno al crear usuario' });
    }
};

export const actualizarEmpleado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Cédula_Usuario
        const { nombre, apellido, correo, rol, password, direccion } = req.body;

        if (!id) return res.status(400).json({ error: 'Cédula de empleado requerida' });

        let query = `UPDATE Usuario SET Nombre = ?, Apellido = ?, Correo = ?, ID_Rol = ?, Direccion = ?`;
        const replacements: any[] = [nombre, apellido || '', correo, rol, direccion || ''];

        if (password) {
            query += `, Contraseña = ?`;
            replacements.push(bcrypt.hashSync(password, 10));
        }

        query += ` WHERE Cedula_Usuario = ?`;
        replacements.push(id);

        await sequelize.query(query, { replacements });
        res.status(200).json({ success: true, message: 'Usuario actualizado' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

export const eliminarEmpleado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID de empleado requerido' });
        
        if (id === 'V-00000001') {
            return res.status(403).json({ error: 'No se puede eliminar el superadministrador principal' });
        }

        await sequelize.query(`DELETE FROM Usuario WHERE Cedula_Usuario = ?`, { replacements: [id] });
        res.status(200).json({ success: true, message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};