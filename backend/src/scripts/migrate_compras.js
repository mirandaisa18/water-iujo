const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const migrateCompras = async () => {
    try {
        console.log('Iniciando migración de tablas Proveedores y Compras...');
        
        await sequelize.query(`DROP TABLE IF EXISTS Proveedor;`); // Eliminamos la vieja que estaba vacía/incompleta

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS proveedores (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
                nombre VARCHAR(255) NOT NULL,
                contacto VARCHAR(255),
                telefono VARCHAR(50)
            )
        `);

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS compras (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
                fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                proveedor_id INTEGER NOT NULL,
                producto_id VARCHAR(255) NOT NULL,
                cantidad INTEGER NOT NULL,
                precio_unitario DECIMAL(10, 2) NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
                FOREIGN KEY (producto_id) REFERENCES productos(id)
            )
        `);

        console.log('Migración completada con éxito.');
    } catch (error) {
        console.error('Error durante la migración:', error);
    }
};

migrateCompras();
