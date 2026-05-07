const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

const mergeSchema = `
BEGIN TRANSACTION;

-- 1. Ensure 'clientes' has all necessary columns
-- (It already has: id, nombre, cedula, telefono, email, direccion)

-- 2. Migrate data from 'Cliente' to 'clientes' if not exists
INSERT OR IGNORE INTO clientes (nombre, cedula, direccion)
SELECT Nombre, "Cedúla_Cliente", Direcccion FROM Cliente;

-- 3. Update Venta table to reference 'clientes(cedula)'
ALTER TABLE Venta RENAME TO Venta_old;
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
    FOREIGN KEY (Cedula_Cliente) REFERENCES clientes(cedula) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (Vendedor_ID) REFERENCES Usuario(Cedula_Usuario) ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO Venta SELECT * FROM Venta_old;
DROP TABLE Venta_old;

-- 4. Update Telefono and Direccion to reference 'clientes(cedula)'
ALTER TABLE Telefono RENAME TO Telefono_old;
CREATE TABLE Telefono (
	Id_Telefono integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
	Numero varchar(255) NOT NULL,
	Cedula_Cliente varchar(255) NOT NULL,
	Cedula_Usuario varchar(255),
	FOREIGN KEY (Cedula_Cliente) REFERENCES clientes(cedula) ON DELETE NO ACTION ON UPDATE NO ACTION,
	FOREIGN KEY (Cedula_Usuario) REFERENCES Usuario(Cedula_Usuario) ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO Telefono SELECT * FROM Telefono_old;
DROP TABLE Telefono_old;

-- 5. Drop the old 'Cliente' table
DROP TABLE Cliente;

COMMIT;
`;

db.exec(mergeSchema, (err) => {
    if (err) {
        console.error('Error merging tables:', err);
        db.run('ROLLBACK');
    } else {
        console.log('Client tables consolidated into "clientes" successfully!');
    }
    db.close();
});
