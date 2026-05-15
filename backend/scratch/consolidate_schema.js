const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: console.log,
});

async function migrate() {
  try {
    console.log('Starting schema consolidation...');

    // 1. clientes
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cedula VARCHAR(255) UNIQUE NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(255),
        email VARCHAR(255),
        direccion TEXT,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Usuario
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Usuario (
        Cedula_Usuario VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        Nombre VARCHAR(255),
        Apellido VARCHAR(255),
        Correo VARCHAR(255),
        ID_Rol VARCHAR(255),
        Contraseña VARCHAR(255),
        Direccion VARCHAR(255)
      )
    `);

    // 3. Producto
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Producto (
        ID_Producto VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        Nombre_Prodcuto VARCHAR(255),
        Descripcion_Producto VARCHAR(255),
        Tipo_Producto INTEGER,
        Precio_Producto DOUBLE,
        Stock_Actual INTEGER DEFAULT 0,
        Stock_Minimo INTEGER DEFAULT 0,
        Para_Venta INTEGER DEFAULT 1
      )
    `);

    // 4. ventas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_usd DECIMAL(10, 2) DEFAULT 0,
        total_bs DECIMAL(10, 2) DEFAULT 0,
        metodo_pago VARCHAR(50),
        cliente_id INTEGER,
        tasa_bcv DECIMAL(10, 2) DEFAULT 0,
        delivery_costo DECIMAL(10, 2) DEFAULT 0,
        vendedor_id VARCHAR(255),
        referencia_pago VARCHAR(255),
        nombre_pagador VARCHAR(255),
        telefono_pagador VARCHAR(255),
        subtotal DECIMAL(10, 2) DEFAULT 0,
        iva DECIMAL(10, 2) DEFAULT 0,
        tipo_venta VARCHAR(255) DEFAULT 'solo_recarga',
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (vendedor_id) REFERENCES Usuario(Cedula_Usuario)
      )
    `);

    // 5. detalle_ventas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS detalle_ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venta_id INTEGER,
        producto_id VARCHAR(255),
        cantidad INTEGER,
        precio_unitario DECIMAL(10, 2),
        subtotal DECIMAL(10, 2),
        tipo_item VARCHAR(100),
        tamanio_litros DECIMAL(10, 2) DEFAULT 0,
        FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES Producto(ID_Producto)
      )
    `);

    // 6. Gasto
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Gasto (
        ID_Gasto INTEGER PRIMARY KEY AUTOINCREMENT,
        Concepto VARCHAR(255) NOT NULL,
        Categoria VARCHAR(255) NOT NULL,
        Monto DECIMAL(10, 2) NOT NULL,
        Metodo VARCHAR(255) NOT NULL,
        Fecha DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. proveedores
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS proveedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(255) NOT NULL,
        contacto VARCHAR(255),
        telefono VARCHAR(255),
        email VARCHAR(255),
        direccion TEXT
      )
    `);

    // 8. compras
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS compras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        proveedor_id INTEGER,
        producto_id VARCHAR(255),
        cantidad INTEGER,
        precio_unitario DECIMAL(10, 2),
        total DECIMAL(10, 2),
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
        FOREIGN KEY (producto_id) REFERENCES Producto(ID_Producto)
      )
    `);

    // 9. Stock (Historical movements)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Stock (
        ID_Stock INTEGER PRIMARY KEY AUTOINCREMENT,
        ID_Producto VARCHAR(255),
        Cantidad INTEGER,
        Fecha_Movimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
        Tipo_Movimiento VARCHAR(255),
        FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto)
      )
    `);

    console.log('Schema consolidation completed successfully.');

    // Seed basic data if needed
    const [existingProds] = await sequelize.query("SELECT COUNT(*) as count FROM Producto");
    if (existingProds[0].count === 0) {
      console.log('Seeding basic products...');
      await sequelize.query(`
        INSERT INTO Producto (ID_Producto, Nombre_Prodcuto, Descripcion_Producto, Precio_Producto, Stock_Actual, Stock_Minimo, Para_Venta)
        VALUES 
        ('B20N', 'Botellón Nuevo 20L', 'botellon', 5.0, 10, 5, 1),
        ('R20L', 'Recarga 20L', 'recarga', 1.5, 999, 0, 1),
        ('C20L', 'Combo (Botellón + Recarga)', 'combo', 6.5, 10, 0, 1)
      `);
    }

    const [existingUsers] = await sequelize.query("SELECT COUNT(*) as count FROM Usuario");
    if (existingUsers[0].count === 0) {
        console.log('Seeding admin user...');
        await sequelize.query(`
            INSERT INTO Usuario (Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, Contraseña)
            VALUES ('V-00000001', 'Admin', 'Sistema', 'admin@water.com', 'admin', '$2a$10$X.J6fBwW0Y/Q1yX0Y/Q1yO')
        `); // password: password
    }

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await sequelize.close();
  }
}

migrate();
