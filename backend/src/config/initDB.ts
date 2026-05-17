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

    // 1.5. Rol
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Rol (
        ID_Rol VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        Nombre_Rol VARCHAR(255)
      )
    `);

    // Insertar roles base si no existen
    const roles = [
      { id: 'admin', nombre: 'Administrador' },
      { id: 'cajero', nombre: 'Cajero' },
      { id: 'delivery', nombre: 'Repartidor' },
      { id: 'cliente', nombre: 'Cliente' }
    ];
    for (const r of roles) {
      await sequelize.query(`
        INSERT OR IGNORE INTO Rol (ID_Rol, Nombre_Rol) VALUES (?, ?)
      `, { replacements: [r.id, r.nombre] });
    }

    // 2. Usuario
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Usuario (
        Cedula_Usuario VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        Nombre VARCHAR(255),
        Apellido VARCHAR(255),
        Correo VARCHAR(255),
        ID_Rol VARCHAR(255),
        Contraseña VARCHAR(255),
        Direccion VARCHAR(255),
        FOREIGN KEY (ID_Rol) REFERENCES Rol(ID_Rol)
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

    // Asegurar los 4 usuarios de roles estándar según la especificación del sistema
    const defaultUsers = [
        { cedula: 'V-00000000', nombre: 'Admin Master', apellido: 'Sistema', correo: 'admin@wateriujo.com', rol: 'admin', pass: '123', direccion: 'Sede Principal' },
        { cedula: 'V-11111111', nombre: 'Cajero Principal', apellido: 'Caja', correo: 'caja@wateriujo.com', rol: 'cajero', pass: '1234', direccion: 'Sede Principal' },
        { cedula: 'V-22222222', nombre: 'Repartidor 1', apellido: 'Delivery', correo: 'delivery@wateriujo.com', rol: 'delivery', pass: '123456', direccion: 'Zona Este' },
        { cedula: 'V-33333333', nombre: 'Cliente General', apellido: 'Cliente', correo: 'cliente@wateriujo.com', rol: 'cliente', pass: '12345', direccion: 'Zona Centro' }
    ];

    console.log('Verificando y asegurando usuarios de roles estándar...');
    for (const u of defaultUsers) {
        const [exist]: any = await sequelize.query('SELECT Correo FROM Usuario WHERE Correo = ? OR Cedula_Usuario = ?', { replacements: [u.correo, u.cedula] });
        const hash = bcrypt.hashSync(u.pass, 10);
        if (exist.length === 0) {
            console.log(`Creando usuario ${u.rol}: ${u.correo}...`);
            await sequelize.query(`
                INSERT INTO Usuario (Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, Contraseña, Direccion)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, { replacements: [u.cedula, u.nombre, u.apellido, u.correo, u.rol, hash, u.direccion] });
        } else {
            // Asegurar que la contraseña y datos estén actualizados
            await sequelize.query(`
                UPDATE Usuario SET Nombre = ?, Contraseña = ?, ID_Rol = ?, Direccion = ? WHERE Correo = ? OR Cedula_Usuario = ?
            `, { replacements: [u.nombre, hash, u.rol, u.direccion, u.correo, u.cedula] });
        }
    }

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};