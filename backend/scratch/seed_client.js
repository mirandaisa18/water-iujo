const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

async function seed() {
  try {
    console.log('--- INSERTANDO CLIENTE POR DEFECTO ---');

    const c = {
      cedula: 'V-00000000',
      nombre: 'Consumidor',
      apellido: 'Final',
      correo: 'consumidor@final.com',
      direccion: 'Ventas por mostrador'
    };

    // Eliminar si ya existe
    await sequelize.query(`DELETE FROM Cliente WHERE Cedúla_Cliente = ?`, { replacements: [c.cedula] });

    await sequelize.query(`
      INSERT INTO Cliente (Cedúla_Cliente, Nombre, Apellido, Correo, Direcccion)
      VALUES (?, ?, ?, ?, ?)
    `, { 
      replacements: [c.cedula, c.nombre, c.apellido, c.correo, c.direccion] 
    });
    
    console.log(`✅ Cliente insertado: ${c.nombre} ${c.apellido}`);
    console.log('\n--- BASE DE DATOS ACTUALIZADA ---');
  } catch (error) {
    console.error('❌ Error insertando cliente:', error);
  } finally {
    process.exit();
  }
}

seed();
