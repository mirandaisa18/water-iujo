const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

db.run(`INSERT OR IGNORE INTO Usuario (Cedula_Usuario, Nombre, Apellido, Correo, ID_Rol, "Contraseña", Direccion) 
        VALUES ('2', 'Cajero Auxiliar', 'Sistema', 'cajero2@wateriujo.com', 'cajero', '123', 'Sede Central')`, (err) => {
    if (err) console.error(err);
    else console.log('Alias user with ID 2 ensured.');
    db.close();
});
