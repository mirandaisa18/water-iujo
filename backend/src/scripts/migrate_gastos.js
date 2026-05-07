const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const migrateGastos = async () => {
    try {
        console.log('Iniciando migración de la tabla Gasto...');
        
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Gasto (
                ID_Gasto INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
                Concepto VARCHAR(255) NOT NULL,
                Categoria VARCHAR(255) NOT NULL,
                Monto DECIMAL(10, 2) NOT NULL,
                Metodo VARCHAR(255) NOT NULL,
                Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Migración completada con éxito.');
    } catch (error) {
        console.error('Error durante la migración:', error);
    }
};

migrateGastos();
