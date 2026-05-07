const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

db.all("SELECT sql FROM sqlite_master WHERE name='Usuario'", [], (err, rows) => {
    if (err) console.error(err);
    else if (rows.length > 0) console.log(rows[0].sql);
    else console.log('Table Usuario not found');
    db.close();
});
