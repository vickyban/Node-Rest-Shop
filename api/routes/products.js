const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');



router.get('/', (req, res, next) => {
  // where()  add condition or limit() to limit number of db fetch at one
  Product
    .find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs)
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
        message: 'Handling POST requests to /products',
        product: result
      });
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log("from the db", doc);
      if (doc)  // product is not exist => null
        res.status(200).json(doc)
      else
        res.status(404).json({ message: 'No valid entry found for this id' })
    })
    .catch(err => {
      console.log(err);
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
      console.log(result)
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err })
    })
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Product
    .remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err })
    })
}
);

module.exports = router;
