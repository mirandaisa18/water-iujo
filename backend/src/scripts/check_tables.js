const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });
sequelize.query("SELECT name FROM sqlite_master WHERE type='table';").then(res => {
    console.log(res[0]);
});
