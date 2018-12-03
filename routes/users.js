'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user');

router.post('/', (req, res, next) => {
    
  const { fullname, username, password } = req.body;
  const newUser = {fullname, username, password};
    
});

module.exports = router;