const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');



router.get('/', (req, res, next) => {
  Product
    .find()
    .select('name price _id')  // control which field to fetch or can add -(minus) field  to exclude that field
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    });
});

router.post('/', (req, res, next) => {
  const product = new Product({   // accept an object contain data for the model
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  })
  // save() it in the db. exect() turn this into a promise(because otherwise have to pass a callback into save((err,res) => ))
  product.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created successfully',
        product: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      });
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      if (doc)  // product is not exist => null
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + doc._id
          }
        })
      else
        res.status(404).json({ message: 'No valid entry found for this id' })
    })
    .catch(err => {
      res.status(500).json({ error: err })
    });
});

router.patch('/:id', (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      })
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Product
    .remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            name: "String",
            price: 'Number'
          }
        }
      })
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
}
);

module.exports = router;
