'use strict';
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Restrics response body from database
userSchema.set('toJson', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
  }
});

userSchema.set('timestamps', true);

module.exports = mongoose.model('User', userSchema);

