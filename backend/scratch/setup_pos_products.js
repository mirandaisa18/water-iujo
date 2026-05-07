const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

async function setup() {
  try {
    // 1. Asegurar columna Para_Venta
    const [columns] = await sequelize.query("PRAGMA table_info(Producto)");
    const hasParaVenta = columns.some(c => c.name === 'Para_Venta');
    
    if (!hasParaVenta) {
      await sequelize.query('ALTER TABLE Producto ADD COLUMN Para_Venta INTEGER DEFAULT 1');
      console.log('Columna Para_Venta añadida');
    }

    // 2. Marcar productos que NO son para venta
    await sequelize.query(`
      UPDATE Producto 
      SET Para_Venta = 0 
      WHERE Nombre_Prodcuto LIKE '%Filtro%' 
         OR Nombre_Prodcuto LIKE '%Lámpara%' 
         OR Nombre_Prodcuto LIKE '%Arena%' 
         OR Nombre_Prodcuto LIKE '%Tapa%' 
         OR Nombre_Prodcuto LIKE '%Sello%' 
         OR Nombre_Prodcuto LIKE '%Precinto%'
    `);
    console.log('Productos internos ocultados');

    // 3. Insertar productos de venta esenciales
    const items = [
      ['R01', 'Recarga de 19L', 'Servicio', 1.5, 0, 9999, 1],
      ['R02', 'Recarga de 5L', 'Servicio', 0.5, 0, 9999, 1],
      ['V01', 'Venta Integral (Botellón + Recarga)', 'Combo', 6.5, 0, 10, 1]
    ];

    for (const item of items) {
      await sequelize.query(`
        INSERT OR REPLACE INTO Producto (ID_Producto, Nombre_Prodcuto, Descripcion_Producto, Precio_Producto, Stock_Minimo, Stock_Actual, Para_Venta)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, { replacements: item });
    }
    
    console.log('Productos de venta (Recargas y Combos) listos.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

setup();
