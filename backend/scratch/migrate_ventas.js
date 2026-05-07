const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

async function migrate() {
  try {
    console.log('--- MIGRANDO TABLA VENTA ---');

    // Intentar añadir columnas una por una (ignorar si ya existen)
    const columns = [
      'ALTER TABLE Venta ADD COLUMN Vendedor_ID VARCHAR(255)',
      'ALTER TABLE Venta ADD COLUMN Tasa_BCV DECIMAL(10, 2)',
      'ALTER TABLE Venta ADD COLUMN Delivery_Costo DECIMAL(10, 2)',
      'ALTER TABLE Venta ADD COLUMN ID_Cliente VARCHAR(255)',
      'ALTER TABLE Venta ADD COLUMN Referencia_Pago VARCHAR(255)',
      'ALTER TABLE Venta ADD COLUMN Nombre_Pagador VARCHAR(255)',
      'ALTER TABLE Venta ADD COLUMN Telefono_Pagador VARCHAR(255)'
    ];

    for (const sql of columns) {
      try {
        await sequelize.query(sql);
        console.log(`✅ Ejecutado: ${sql}`);
      } catch (e) {
        console.log(`⚠️  Omitido (ya existe o error): ${sql}`);
      }
    }

    console.log('\n--- MIGRACIÓN COMPLETADA ---');
  } catch (error) {
    console.error('❌ Error migrando tabla:', error);
  } finally {
    process.exit();
  }
}

migrate();
