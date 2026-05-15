import { sequelize } from './db';
import bcrypt from 'bcryptjs';

export const initDB = async () => {
  try {
    console.log('Verificando/Creando esquema de base de datos...');

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
        Precio_Compra DECIMAL(10, 2) DEFAULT 0,
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

    // 9. Stock
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

    // 10. Mantenimientos
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS mantenimientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_mantenimiento VARCHAR(255) NOT NULL,
        costo DECIMAL(10, 2) NOT NULL,
        fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_proximo DATETIME NOT NULL,
        observaciones TEXT,
        realizado_por VARCHAR(255)
      )
    `);

    console.log('Tablas validadas correctamente.');

    // Validar si existe administrador, si no crearlo
    const [existingUsers]: any = await sequelize.query("SELECT COUNT(*) as count FROM Usuario");
    if (existingUsers[0].count === 0) {
        console.log('Seeding admin user...');
        const hash = bcrypt.hashSync('password', 10);
        await sequelize.query(`
            INSERT INTO Usuario (Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, Contraseña)
            VALUES ('V-00000001', 'Admin', 'Sistema', 'admin@water.com', 'admin', ?)
        `, { replacements: [hash] });
    }

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};