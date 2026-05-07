const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

async function seed() {
  try {
    console.log('--- INSERTANDO PRODUCTOS BASE ---');

    const productos = [
      { id: 'B20N', nombre: 'Botellón 20L Nuevo', tipo: 'botellon', precioVenta: 80, precioCompra: 40, stock: 50, minimo: 5, paraVenta: 1 },
      { id: 'R05L', nombre: 'Recarga 5L', tipo: 'servicio', precioVenta: 0.50, precioCompra: 0, stock: 9999, minimo: 0, paraVenta: 1 },
      { id: 'R10L', nombre: 'Recarga 10L', tipo: 'servicio', precioVenta: 1.00, precioCompra: 0, stock: 9999, minimo: 0, paraVenta: 1 },
      { id: 'R20L', nombre: 'Recarga 20L', tipo: 'servicio', precioVenta: 1.50, precioCompra: 0, stock: 9999, minimo: 0, paraVenta: 1 },
      { id: 'VINT20', nombre: 'Venta Integral 20L', tipo: 'combo', precioVenta: 81.50, precioCompra: 41.50, stock: 50, minimo: 5, paraVenta: 1 }
    ];

    for (const p of productos) {
      // Eliminar si ya existe para evitar errores de UNIQUE
      await sequelize.query(`DELETE FROM Producto WHERE ID_Producto = ?`, { replacements: [p.id] });

      await sequelize.query(`
        INSERT INTO Producto (ID_Producto, Nombre_Prodcuto, Descripcion_Producto, Precio_Producto, Precio_Compra, Stock_Actual, Stock_Minimo, Para_Venta)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, { 
        replacements: [p.id, p.nombre, p.tipo, p.precioVenta, p.precioCompra, p.stock, p.minimo, p.paraVenta] 
      });
      console.log(`✅ Producto insertado: ${p.nombre}`);
    }

    console.log('\n--- BASE DE DATOS ACTUALIZADA ---');
  } catch (error) {
    console.error('❌ Error insertando productos:', error);
  } finally {
    process.exit();
  }
}

seed();
