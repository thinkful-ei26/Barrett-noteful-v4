'use strict';
// creates hashed passwords to assign to users in database 
// for test and dev purposes

const bcrypt = require('bcryptjs');
const password = 'super-secret-password';

/* Hash a password with cost-factor 10, then run compare to verify */
bcrypt.hash(password, 10)
  .then(digest => {
    console.log('digest = ', digest);
    return digest;
  })
  .catch(err => {
    console.error('error', err);
  });