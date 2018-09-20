const config = require('config');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

exports.connect = () => {
  // Connecting to the database
  mongoose.connect(config.mongodb)
    .then(() => {
      console.log('Successfully connected to the database');
    }).catch((err) => {
      console.log('Could not connect to the database. Exiting now...');
      console.log(err);
      process.exit();
    });
};
