const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'database.sqlite' });
async function run() {
    try {
        const prod = await sequelize.query('SELECT Nombre_Prodcuto, Descripcion_Producto, Precio_Producto FROM Producto');
        console.log('PRODUCTOS:', prod[0]);
        const tbls = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%tamanio%'");
        console.log('TABLAS TAMANIO:', tbls[0]);
        if(tbls[0].length > 0) {
            const tam = await sequelize.query('PRAGMA table_info(' + tbls[0][0].name + ')');
            console.log('TAMANIO COLS:', tam[0]);
            const data = await sequelize.query('SELECT * FROM ' + tbls[0][0].name);
            console.log('TAMANIO DATA:', data[0]);
        }
    } catch(e) { console.error(e); }
}
run();
