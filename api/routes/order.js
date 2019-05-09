const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get all order'
    })
})

router.post('/', (req, res, next) => {
    const orders = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(200).json({
        message: 'Add Order Suucessfully',
        orders : orders
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