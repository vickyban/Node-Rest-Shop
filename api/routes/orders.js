const express = require('express');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');

const OrdersController = require('../controllers/order');

router.get('/', OrdersController.order_get_all);

router.post('/', OrdersController.order_create_order);

router.get('/:id', OrdersController.order_get_order);

router.delete('/:id', OrdersController.order_delete_order);

module.exports = router;
