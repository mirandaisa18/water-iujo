const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function getRows(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function fix() {
    try {
        await runQuery(`INSERT OR IGNORE INTO Cliente (Cedúla_Cliente, Nombre, Apellido, Correo, Direcccion) 
                        VALUES ('V-00000000', 'Consumidor', 'Final', 'consumidor@final.com', 'N/A')`);
        console.log('Consumidor Final checked/inserted.');

        const rows = await getRows("SELECT COUNT(*) as count FROM Usuario");
        if (rows[0].count === 0) {
            await runQuery(`INSERT INTO Usuario (Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, Contraseña, Direccion) 
                            VALUES ('V-12345678', 'Admin', 'Global', 'admin@wateriujo.com', 'admin', 'admin123', 'Sede Principal')`);
            console.log('Admin user inserted.');
        } else {
            console.log('Usuario table already has data.');
        }
    } catch (err) {
        console.error('Error during fix:', err);
    } finally {
        db.close();
    }
}

fix();
