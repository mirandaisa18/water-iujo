const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

async function migrate() {
  try {
    // 1. Agregar Precio_Compra a Producto
    const [colsP] = await sequelize.query("PRAGMA table_info(Producto)");
    if (!colsP.some(c => c.name === 'Precio_Compra')) {
      await sequelize.query('ALTER TABLE Producto ADD COLUMN Precio_Compra REAL DEFAULT 0');
      console.log('Columna Precio_Compra añadida a Producto');
    }

    // 2. Agregar email y direccion a proveedores
    const [colsS] = await sequelize.query("PRAGMA table_info(proveedores)");
    if (!colsS.some(c => c.name === 'email')) {
      await sequelize.query('ALTER TABLE proveedores ADD COLUMN email TEXT');
      console.log('Columna email añadida a proveedores');
    }
    if (!colsS.some(c => c.name === 'direccion')) {
      await sequelize.query('ALTER TABLE proveedores ADD COLUMN direccion TEXT');
      console.log('Columna direccion añadida a proveedores');
    }

    console.log('Migración de campos completada.');

  } catch (err) {
    console.error('Error en migración:', err);
  } finally {
    await sequelize.close();
  }
}
migrate();
