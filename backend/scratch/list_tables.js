const { sequelize } = require('./backend/dist/config/db');
async function run() {
    try {
        const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'");
        console.log(JSON.stringify(results, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
