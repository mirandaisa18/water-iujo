import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key_change_in_production';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Buscar usuario en la tabla Usuario
        const [userData]: any = await sequelize.query(
            'SELECT Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, "Contraseña" FROM Usuario WHERE Correo = ?',
            { replacements: [email] }
        );

        if (userData.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = userData[0];
        const isPasswordValid = await bcrypt.compare(password, user['Contraseña']);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar JWT
        const token = jwt.sign(
            {
                id: user.Cedula_Usuario,
                email: user.Correo,
                rol: user.ID_Rol,
                nombre: `${user.Nombre} ${user.Apellido}`
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.Cedula_Usuario,
                nombre: `${user.Nombre} ${user.Apellido}`,
                email: user.Correo,
                rol: user.ID_Rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const logout = async (req: Request, res: Response) => {
    // En JWT, el logout se maneja en el cliente eliminando el token
    res.json({ success: true, message: 'Logout exitoso' });
};

export const verifyToken = async (req: Request, res: Response) => {
    // Endpoint opcional para verificar token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};