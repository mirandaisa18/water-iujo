import { Request, Response, NextFunction } from 'express';

export const checkRole = (rolesPermitidos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // En una app real, el rol vendría del JWT decodificado
        // Para este proyecto, lo leeremos de un header 'x-user-role' enviado por el frontend
        const userRole = req.headers['x-user-role'] as string;

        if (!userRole) {
            return res.status(401).json({ error: 'No se especificó un rol de usuario' });
        }

        if (!rolesPermitidos.includes(userRole)) {
            return res.status(403).json({ 
                error: `Acceso denegado. Tu rol (${userRole}) no tiene permiso para esta acción.` 
            });
        }

        next();
    };
};
