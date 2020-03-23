const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoute = require('./routes/users');
const db = require('./config/db');

db.authenticate()
    .then(() => console.log('Db connected...'))
    .catch(err => console.log('Error: ' + err));

app.use(express.json());
app.use(bodyParser.json());

app.use('/users', userRoute);

module.exports = app;