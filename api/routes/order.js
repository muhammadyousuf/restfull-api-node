const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get all order'
    })
})

router.post('/', (req, res, next) => {
    const orders = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });
    orders.save().then(result =>{
        console.log("Add Order", result);
        res.status(201).json({
            message: 'Add Order Suucessfully',
            orders : result
        })
        
    }).catch(err => {
        console.log('error', err);
        res.status(500).json({
            error:err
        })
    })
    
})

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'get single order by ID',
        orderID:req.params.orderId
    })
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Delete Order Specific ID'
    })
})

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Update Order Specific ID'
    })
})
module.exports = router