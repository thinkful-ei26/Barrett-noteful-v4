'use strict';
// Libraries
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport'); 

// Security
const localStrategy = require('./passport/local');
passport.use(localStrategy);
const jwtStrategy = require('./passport/jwt');
passport.use(jwtStrategy);

// Config
const { PORT, MONGODB_URI } = require('./config');

// Require routers
const notesRouter = require('./routes/notes');
const foldersRouter = require('./routes/folders');
const tagsRouter = require('./routes/tags');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Create an Express application
const app = express();

// Log all requests. Skip logging during
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// Create a static webserver
app.use(express.static('public'));

// Parse request body, enables req.body
app.use(express.json());

// Mount routers
app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/notes', notesRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/tags', tagsRouter);


// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
    console.log(err.name === 'FakeError' ? '' : err);
  }
});

// Listen for incoming connections
if (require.main === module) {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(MONGODB_URI)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app; // Export for testing
