const express = require('express');
const app = express();
const product = require('./api/routes/product');
const order = require('./api/routes/order');

app.use('/product', product)
app.use('/order', order)

module.exports = app;