const express = require('express');
const app = express();
const product = require('./api/routes/product');

app.use('/product', product)


module.exports = app;