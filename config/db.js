const Sequelize = require('sequelize');

module.exports = new Sequelize('database', 'username', 'password', {
    host: '',
    dialect: 'postgres'
});

