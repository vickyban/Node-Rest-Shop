const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


router.get('/', (req, res, next) => {
  Order.find()
    .select('-__v')
    .populate('product', '-__v -price')         //make query to fields that ref to other tables [with list of field to include or exclude]
    .exec()
    .then(docs => {
      if (docs.length == 0) {
        return res.status(200).json({ message: 'no orders' })
      }
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,   // will fetch the all detail about the product
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
});

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)  // look if the product exist
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
      })
      return order.save() // return the promist


    })
    .then(result => {
      res.status(201).json({
        message: 'Order was created',
        order: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Order.findById(id)
    .select('-__v')
    .populate('product')
    .exec()
    .then(doc => {
      if (doc)
        res.status(200).json({
          id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + doc._id
          }
        });
      else
        res.status(404).json({ message: 'Order not found' })
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Order.remove({ _id: id })
    .exec()
    .then(res => {
      res.status(200).json({
        message: 'Order deleted',
        id: req.params.id
      });
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
});

module.exports = router;
