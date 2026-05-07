const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

async function run() {
  try {
    const [tables] = await sequelize.query(`SELECT name FROM sqlite_master WHERE type='table'`);
    console.log("Tables:", tables.map(t => t.name));

    const [proveedores] = await sequelize.query(`PRAGMA table_info(proveedores)`);
    console.log("proveedores columns:", proveedores);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
