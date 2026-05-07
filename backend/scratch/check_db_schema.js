const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:/Users/Yanina/Downloads/proyecto/vue/backend/database.sqlite');

const queries = [
    "SELECT name, sql FROM sqlite_master WHERE type='table' AND name IN ('Venta', 'Detalle_Venta', 'Cliente', 'Producto', 'Usuario')",
    "SELECT COUNT(*) as count FROM Cliente WHERE ID_Cliente = 'V-00000000' OR rif = 'V-00000000'",
    "SELECT COUNT(*) as count FROM Usuario LIMIT 1"
];

async function run() {
    for (const q of queries) {
        console.log(`\nQuery: ${q}`);
        await new Promise((resolve) => {
            db.all(q, [], (err, rows) => {
                if (err) console.error(err);
                else console.log(JSON.stringify(rows, null, 2));
                resolve();
            });
        });
    }
    db.close();
}

run();
