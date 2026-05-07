const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

const fixSchema = `
BEGIN TRANSACTION;

-- 1. Rename old tables
ALTER TABLE Venta RENAME TO Venta_old;
ALTER TABLE Detalle_Venta RENAME TO Detalle_Venta_old;

-- 2. Create Venta with correct FKs
CREATE TABLE Venta (
    ID_Venta INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    Fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    Total DECIMAL(10, 2) DEFAULT 0,
    Metodo_Pago VARCHAR(50),
    Cedula_Cliente VARCHAR(255),
    Vendedor_ID VARCHAR(255),
    Tasa_BCV DECIMAL(10, 2),
    Delivery_Costo DECIMAL(10, 2),
    Referencia_Pago VARCHAR(255),
    Nombre_Pagador VARCHAR(255),
    Telefono_Pagador VARCHAR(255),
    tipo_venta VARCHAR(255) DEFAULT 'solo_recarga',
    FOREIGN KEY (Cedula_Cliente) REFERENCES Cliente(Cedúla_Cliente) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (Vendedor_ID) REFERENCES Usuario(Cedula_Usuario) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- 3. Create Detalle_Venta with correct FKs
CREATE TABLE Detalle_Venta (
    ID_Detalle_Venta INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    ID_Venta INTEGER,
    ID_Producto VARCHAR(255),
    cantidad INTEGER,
    Precio_Producto DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    tipo_item VARCHAR(100),
    tamanio_litros DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (ID_Venta) REFERENCES Venta(ID_Venta) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- 4. Copy data if any (optional, but good practice)
-- INSERT INTO Venta SELECT ... FROM Venta_old;
-- INSERT INTO Detalle_Venta SELECT ... FROM Detalle_Venta_old;

-- 5. Drop old tables
DROP TABLE Venta_old;
DROP TABLE Detalle_Venta_old;

COMMIT;
`;

db.exec(fixSchema, (err) => {
    if (err) {
        console.error('Error fixing schema:', err);
        db.run('ROLLBACK');
    } else {
        console.log('Schema fixed successfully!');
    }
    db.close();
});
