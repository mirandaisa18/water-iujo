const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

async function setup() {
    return new Promise((resolve, reject) => {
        db.run(`INSERT OR IGNORE INTO Usuario (Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, "Contraseña", Direccion) 
                VALUES ('V-00000001', 'Cajero', 'Principal', 'cajero@wateriujo.com', 'cajero', 'cajero123', 'Sede Central')`, (err) => {
            if (err) reject(err);
            else {
                console.log('Default cashier user (V-00000001) ensured.');
                resolve();
            }
        });
    });
}

setup().then(() => db.close()).catch(err => { console.error(err); db.close(); });
