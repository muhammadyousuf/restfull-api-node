
const express = require('express');
const router = express.Router();


const checkAuth = require('../middleware/check-auth');
const Order_Controller = require('../controller/order');



router.get('/', checkAuth, Order_Controller.get_all_order);

router.post('/', checkAuth, Order_Controller.create_order )

router.get('/:orderId', checkAuth, Order_Controller.orders_get_order)

router.delete('/:orderId', checkAuth, Order_Controller.delete_order)

module.exports = router