const Sequelize = require('sequelize');

module.exports = new Sequelize('postgres', 'postgres', 'novasemita', {
    host: 'testdblh.cz2grr6g2ufx.us-east-1.rds.amazonaws.com',
    dialect: 'postgres'
});

