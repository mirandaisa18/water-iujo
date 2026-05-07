const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

async function testVenta() {
  try {
    // 1. Preparar stock de prueba
    await sequelize.query("UPDATE Producto SET Stock_Actual = 10 WHERE ID_Producto = 'B01'");
    
    const [inicial] = await sequelize.query("SELECT ID_Producto, Nombre_Prodcuto, Stock_Actual FROM Producto WHERE ID_Producto = 'B01'");
    console.log('--- ESTADO INICIAL ---');
    console.log(`Producto: ${inicial[0].Nombre_Prodcuto}`);
    console.log(`Stock Físico Inicial: ${inicial[0].Stock_Actual}`);

    // 2. Simular Venta Integral (1 unidad)
    console.log('\n--- SIMULANDO VENTA INTEGRAL (Botellón + Recarga) ---');
    
    // Simulamos lo que haría el controlador
    const itemVenta = {
        id: 'V01',
        nombre: 'Venta Integral (Botellón + Recarga)',
        tipo: 'Combo',
        cantidad: 1,
        precioVenta: 6.5,
        esServicio: false
    };

    // Lógica del controlador VentasController.ts
    const tipo = itemVenta.tipo.toLowerCase();
    let cantidadBotellonesFisicos = 0;
    if (tipo.includes('botellon') || tipo.includes('botellón') || tipo.includes('integral') || tipo.includes('combo')) {
        cantidadBotellonesFisicos = itemVenta.cantidad;
    }

    if (cantidadBotellonesFisicos > 0) {
        // Buscar el producto físico
        const [stockData] = await sequelize.query(`
            SELECT ID_Producto, Stock_Actual FROM Producto 
            WHERE (Nombre_Prodcuto LIKE '%Botellón%' OR Descripcion_Producto LIKE '%Botellón%')
            AND Descripcion_Producto != 'Servicio'
            LIMIT 1
        `);
        
        const productoFisico = stockData[0];
        console.log(`Identificado Producto Físico: ${productoFisico.ID_Producto} (Stock: ${productoFisico.Stock_Actual})`);

        // Descontar
        await sequelize.query(`
            UPDATE Producto 
            SET Stock_Actual = Stock_Actual - ? 
            WHERE ID_Producto = ?
        `, { replacements: [cantidadBotellonesFisicos, productoFisico.ID_Producto] });
        
        console.log(`✅ Stock descontado: -${cantidadBotellonesFisicos}`);
    }

    // 3. Verificar Resultado
    const [final] = await sequelize.query("SELECT ID_Producto, Nombre_Prodcuto, Stock_Actual FROM Producto WHERE ID_Producto = 'B01'");
    console.log('\n--- ESTADO FINAL ---');
    console.log(`Stock Físico Final: ${final[0].Stock_Actual}`);

    if (final[0].Stock_Actual === 9) {
        console.log('\n✨ ¡PRUEBA EXITOSA! El stock bajó de 10 a 9.');
    } else {
        console.log('\n❌ Falló la prueba.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

testVenta();
