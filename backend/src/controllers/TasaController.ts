import { Request, Response } from 'express';
import axios from 'axios';

let cachedTasa = 36.5;
let lastUpdate = 0;
let fuenteActual = 'BCV (Oficial)';

export const getTasa = async (req: Request, res: Response) => { 
    try {
        const now = Date.now();
        // Caché de 30 minutos
        if (now - lastUpdate > 1800000) {
            console.log('DEBUG: Actualizando tasa desde ve.dolarapi.com...');
            const response = await axios.get('https://ve.dolarapi.com/v1/dolares/oficial');
            
            if (response.data && response.data.promedio) {
                cachedTasa = response.data.promedio;
                fuenteActual = 'BCV (Oficial)';
                lastUpdate = now;
            }
        }
        res.json({ tasa: cachedTasa, fuente: fuenteActual, actualizado: new Date(lastUpdate).toISOString() });
    } catch (error: any) {
        console.error('Error fetching exchange rate:', error.message);
        res.json({ tasa: cachedTasa, fuente: 'Caché (Error API)', actualizado: new Date(lastUpdate).toISOString() });
    }
};

export const updateTasa = async (req: Request, res: Response) => {
    res.status(403).json({ error: 'La tasa se actualiza automáticamente.' });
};