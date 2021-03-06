'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


userSchema.set('timestamps', true);

// Creates validatePassword method
userSchema.methods.validatePassword = function(incomingPassword) {
  return bcrypt.compare(incomingPassword, this.password);
};

userSchema.statics.hashPassword = function(incomingPassword) {
  const digest = bcrypt.hash(incomingPassword, 10);
  return digest;
};

// Restrics response body from database
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
  }
});

module.exports = mongoose.model('User', userSchema);

