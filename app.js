const express = require('express');
const app = express();
const morgan = require('morgan');  // log infor of req

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

// only req url start with /products path, will then be handled by the specific routers
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// if not req path match the above route
app.use((req, res, next) => {
  const error = new Error("No found");
  error.status = 404;
  next(error);  // forward the error obj to the next middlewares
});

// catch all types of error that could be from the above or throw by database or other applications
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


module.exports = app;
