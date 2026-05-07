const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

const migrateSchema = `
BEGIN TRANSACTION;

-- 1. Create the new 'ventas' table as requested by the user
CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    vendedor_id TEXT, -- Keep as TEXT if referencing Cedula_Usuario, or map to integer if needed
    subtotal REAL,
    iva REAL,
    total_usd REAL,
    total_bs REAL,
    tasa_bcv REAL,
    delivery_costo REAL,
    metodo_pago VARCHAR(50),
    referencia_pago VARCHAR(100),
    nombre_pagador VARCHAR(100),
    telefono_pagador VARCHAR(20),
    cambio REAL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_venta VARCHAR(255) DEFAULT 'solo_recarga',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES Usuario(Cedula_Usuario)
);

-- 2. Migrate data from old 'Venta' to 'ventas'
INSERT INTO ventas (id, fecha, total_usd, metodo_pago, tasa_bcv, delivery_costo, vendedor_id, referencia_pago, nombre_pagador, telefono_pagador, tipo_venta, cliente_id)
SELECT 
    v.ID_Venta, 
    v.Fecha_hora, 
    v.Total, 
    v.Metodo_Pago, 
    v.Tasa_BCV, 
    v.Delivery_Costo, 
    v.Vendedor_ID, 
    v.Referencia_Pago, 
    v.Nombre_Pagador, 
    v.Telefono_Pagador, 
    v.tipo_venta,
    c.id -- Mapping Cedula_Cliente to integer ID
FROM Venta v
LEFT JOIN clientes c ON v.Cedula_Cliente = c.cedula;

-- 3. Create 'detalle_ventas' (plural/lowercase) to match
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id INTEGER,
    producto_id VARCHAR(255),
    cantidad INTEGER,
    precio_unitario REAL,
    subtotal REAL,
    tipo_item VARCHAR(100),
    tamanio_litros REAL DEFAULT 0,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES Producto(ID_Producto)
);

-- 4. Migrate detail data
INSERT INTO detalle_ventas (id, venta_id, producto_id, cantidad, precio_unitario, subtotal, tipo_item, tamanio_litros)
SELECT 
    ID_Detalle_Venta, 
    ID_Venta, 
    ID_Producto, 
    cantidad, 
    Precio_Producto, 
    subtotal, 
    tipo_item, 
    tamanio_litros
FROM Detalle_Venta;

-- 5. Cleanup old tables
DROP TABLE Detalle_Venta;
DROP TABLE Venta;

COMMIT;
`;

db.exec(migrateSchema, (err) => {
    if (err) {
        console.error('Error during migration:', err);
        db.run('ROLLBACK');
    } else {
        console.log('Database migrated to plural/lowercase "ventas" and "detalle_ventas" successfully!');
    }
    db.close();
});
