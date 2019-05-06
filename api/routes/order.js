const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get all order'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Add Order Suucessfully'
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