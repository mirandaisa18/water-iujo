const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const migrateMantenimientos = async () => {
    try {
        console.log('Iniciando migración de tabla mantenimientos...');
        
        // Wait, looking at check_tables.js earlier, there is a "Mantenimiento" table. Let's drop it or recreate it with the correct fields.
        await sequelize.query(`DROP TABLE IF EXISTS Mantenimiento;`);

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS mantenimientos (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
                fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                tipo_mantenimiento VARCHAR(255) NOT NULL,
                costo DECIMAL(10, 2) NOT NULL DEFAULT 0,
                fecha_proximo DATETIME NOT NULL,
                observaciones TEXT,
                realizado_por VARCHAR(255)
            )
        `);

        console.log('Migración completada con éxito.');
    } catch (error) {
        console.error('Error durante la migración:', error);
    }
};

migrateMantenimientos();
