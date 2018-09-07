const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// only req url start with /products path, will then be handled by the specific routers
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

module.exports = app;
