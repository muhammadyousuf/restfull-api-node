const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const product = require('./api/routes/product');
const order = require('./api/routes/order');
const user = require('./api/routes/user');



dotenv.config({ path: './nodemon.env' });



mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true })

mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/image', express.static('image'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
})

app.use('/product', product);
app.use('/order', order);
app.use('/user', user);

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