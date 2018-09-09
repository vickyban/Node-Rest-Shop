const express = require('express');
const app = express();
const morgan = require('morgan');  // log infor of req
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Connect to db
const atlas_uri = require('./config').DB_URI;

mongoose.connect(atlas_uri, { dbName: 'productdb' });
mongoose.Promise = global.Promise;  // node.js promist instead of mongoose promise implementation
const connection = mongoose.connection;
connection.on('connected', () => {
  console.log('Connected to mongodb')
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); //make the folder publicly available

// body-parser is now part of express 4.16.*
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// handle CORS
app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*'); // can restrict who can access the server
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') { // browser always send OPTION request before sending any POST or PUT req to see if the user is allowed to make those req
    res.header('Access-Control-Allow-Methods', 'PUT, POST,PATCH,DELETE,GET');
    return res.status(200).json({});
  }
  next();
});

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
