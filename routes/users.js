'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user');

router.post('/', (req, res, next) => {
    
  const { fullname, username, password } = req.body;

  // --- VALIDATION --- \\

  // Validate username and password were provided
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  // Validate that everything is coming in as a String
  const stringFields = ['username', 'password', 'fuulname'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string');

  if (nonStringField) {
    const err = new Error(`'${nonStringField}' must be strings`);
    err.status = 422;
    return next(err);
  }

  // Validate username and password have no whitespace
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error(`'${nonTrimmedField} cannot have white space.'`);
    err.status = 422;
    return next(err);
  }

  // Validate lengths of username and password
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 71
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(field => 
    'min' in sizedFields[field] && 
    req.body[field].trim().length < sizedFields[field].min);

  const tooLargeField = Object.keys(sizedFields).find(field => 
    'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields);

  if (tooSmallField || tooLargeField) {
    const err = new Error(`user name must be at least 1 character long and 
    password must be at least 8 characters and no more than 71 characters.`);
    err.status = 422;
    return next(err);
  }

  
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });

  // Unprotected endpoint
  // User.create(newUser)
  //   .then(result => {
  //     res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
});

module.exports = router;