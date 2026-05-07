const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

async function seed() {
  try {
    console.log('--- SEEDING CONSUMIDOR FINAL ---');
    const [exists] = await sequelize.query("SELECT id FROM clientes WHERE cedula = 'V-00000000'");
    
    if (exists.length === 0) {
      await sequelize.query(`
        INSERT INTO clientes (nombre, cedula, telefono, direccion) 
        VALUES ('Consumidor Final', 'V-00000000', '0000-0000000', 'Ventas de Mostrador')
      `);
      console.log('✅ Consumidor Final creado.');
    } else {
      console.log('✅ Consumidor Final ya existe.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

seed();
