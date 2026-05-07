const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const migrateReportes = async () => {
    try {
        console.log('Iniciando migración de tablas para reportes...');
        
        try {
            await sequelize.query(`ALTER TABLE Venta ADD COLUMN tipo_venta VARCHAR(255) DEFAULT 'solo_recarga'`);
            console.log('Columna tipo_venta añadida a Venta');
        } catch (e) {
            console.log('Columna tipo_venta posiblemente ya existe:', e.message);
        }

        try {
            await sequelize.query(`ALTER TABLE Venta ADD COLUMN total DECIMAL(10, 2) DEFAULT 0`);
            console.log('Columna total añadida a Venta');
        } catch (e) {
            console.log('Columna total posiblemente ya existe:', e.message);
        }

        try {
            await sequelize.query(`ALTER TABLE Detalle_Venta ADD COLUMN tamanio_litros DECIMAL(10, 2) DEFAULT 0`);
            console.log('Columna tamanio_litros añadida a Detalle_Venta');
        } catch (e) {
            console.log('Columna tamanio_litros posiblemente ya existe:', e.message);
        }

        console.log('Migración completada con éxito.');
    } catch (error) {
        console.error('Error durante la migración:', error);
    }
};

migrateReportes();
