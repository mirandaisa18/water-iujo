const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../backend/database.sqlite'),
  logging: false
});

async function check() {
  try {
    const [ventasCols] = await sequelize.query("PRAGMA table_info(ventas)");
    console.log('ventas columns:', ventasCols.map(c => c.name));
    
    const [usuarioCols] = await sequelize.query("PRAGMA table_info(Usuario)");
    console.log('Usuario columns:', usuarioCols.map(c => c.name));
    
    await sequelize.close();
  } catch (err) {
    console.error(err);
  }
}

check();
