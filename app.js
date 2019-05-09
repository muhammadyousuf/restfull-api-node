const express = require('express');
const app = express();
const morgan = require('morgan');
const product = require('./api/routes/product');
const order = require('./api/routes/order');


app.use(morgan('dev'))
app.use('/product', product)
app.use('/order', order)

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    })
})

module.exports = app;