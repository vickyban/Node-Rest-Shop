const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');   // parse other data that body-parser can't do

// sending detail options of how the file or type should be accepted or storaged
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true);    // accept a file
  else
    cb(new Error('invalid image file'), false);    // reject a file
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});   // location that multer will store the data

const Product = require('../models/product');



router.get('/', (req, res, next) => {
  Product
    .find()
    .select('name price _id productImage')  // control which field to fetch or can add -(minus) field  to exclude that field
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
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

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file); // file is about available due to upload.single() parse the image file
  const product = new Product({   // accept an object contain data for the model
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path  //image url
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
          productImage: result.productImage,
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
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      if (doc)  // product is not exist => null
        res.status(200).json({
          product: doc,
          productImage: doc.productImage,
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
