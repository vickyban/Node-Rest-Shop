const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);

// Scheme is the layerout , the sign out the object
// Model is the actual object or a constructor to build such objects basic on the schema