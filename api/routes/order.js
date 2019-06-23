const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const Order_Controller = require('../controller/order');



router.get('/', checkAuth, Order_Controller.get_all_order);

router.post('/', checkAuth, Order_Controller.create_order )

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
        .select("quantity product _id")
        .populate('product','name price')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/order'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
               message:"Order Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:5000/order',
                    body:{productId:"ID", quantity:"Number"}
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router