const express = require('express');
const app = express();

// use() set up middleware(aka function) that incpming request has to go through
//  middleware can accept req, res, next  that move the req to the next middleware in line
app.use((req, res, next) => {
  res.status(200).json({
    message: 'It works'
  });
});

module.exports = app;
