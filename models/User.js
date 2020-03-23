const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.define('users', {
    name: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.STRING,
        lowercase: true
    }
});

module.exports = User;