import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key_change_in_production';

export const checkRole = (rolesPermitidos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token de autenticación requerido' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            (req as any).user = decoded; // Adjuntar info del usuario al request

            if (!rolesPermitidos.includes(decoded.rol)) {
                return res.status(403).json({
                    error: `Acceso denegado. Tu rol (${decoded.rol}) no tiene permiso para esta acción.`
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
    };
};
