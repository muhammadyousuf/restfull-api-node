
const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_all_order = (req, res, next) => {
    Order.find()
        .select("quantity product _id")
        .populate('product','name price')
        .exec()
        .then(docs => {
            console.log("Get all Documents ", docs);

            if (docs.length >= 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            product: doc.product,
                            quantity: doc.quantity,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:5000/order/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'no entries found'
                });
            }

        })
        .catch(err => {
            console.log('error ', err);
            res.status(500).json({
                error: err
            });
        })
}

exports.create_order =  (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Not found Product"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            console.log('order', order)
            return order.save()

        })
        .then(result => {
            res.status(201).json({
                message: 'Add Order Suucessfully',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/order/' + result._id
                }
            })

        }).catch(err => {
            console.log('error', err);
            res.status(500).json({
                error: err
            })
        })
}

exports.orders_get_order =  (req, res, next) => {
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
}

exports.delete_order =  (req, res, next) => {
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
}