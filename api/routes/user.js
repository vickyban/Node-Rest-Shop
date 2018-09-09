const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

// because REST is stateless it doesn't have session so can't log out the user
// DO NOT store RAW Password
// each text has clear distinctive hash value
// Salting string: act of adding random text to the raw password before encrypt it to make the hash are to guess the raw password value

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1)  // check if the user will the same email exist
        return res.status(409).json({ mesage: "Email has been registered" })
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err)
          return res.status(500).json({ error: err });
        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        user.save()
          .then(result => {
            console.log(result)
            res.status(201).json({ message: 'User created' })
          })
          .catch(err => res.status(500).json({ error: err }));
      })
    })
})

router.delete('/id', (req, res, next) => {
  User.remove({ _id: req.params.id })
    .exec()
    .then(result => res.status(200).json({ message: "User deleted" }))
    .catch(err => res.status(500).json({ error: err }))
})

module.exports = router;