const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

db.all("SELECT name, sql FROM sqlite_master WHERE type='table' AND (name LIKE '%client%' OR name LIKE '%venta%')", [], (err, rows) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(rows, null, 2));
    db.close();
});
