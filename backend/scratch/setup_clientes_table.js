const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

async function check() {
  try {
    const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='clientes'");
    console.log('Result:', results);
    
    if (results.length === 0) {
      console.log('--- CREANDO TABLA CLIENTES ---');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre VARCHAR(100) NOT NULL,
            cedula VARCHAR(20) UNIQUE NOT NULL,
            telefono VARCHAR(20),
            email VARCHAR(100),
            direccion TEXT,
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla "clientes" creada exitosamente.');
    } else {
      console.log('✅ La tabla "clientes" ya existe.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

check();
