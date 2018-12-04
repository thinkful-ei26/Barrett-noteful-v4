'use strict';
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);

// Login
router.post('/login', localAuth, function(req, res) {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', options);

//refresh
router.post('/refresh', jwtAuth, function(req, res) {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;