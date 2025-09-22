const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // keep logs clean
});

module.exports = sequelize;
