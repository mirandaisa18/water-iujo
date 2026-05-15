import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db';
import { initDB } from './config/initDB';
import apiRoutes from './routes/api';

// Configurar Dotenv
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json()); // body-parser incluido
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', apiRoutes);

// Sincronizar Base de Datos (Sin Seedings duros, operamos en SQLite directo)
sequelize.sync({ force: false }).then(async () => {
  console.log('Database connected & synced via Raw SQL');
  await initDB();
  
  // Iniciar Servidor
  app.listen(port, () => {
    console.log(`Backend Server running on port ${port}`);
  });
}).catch((error) => {
  console.error('Initial DB Error', error);
});
