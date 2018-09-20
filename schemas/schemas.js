// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const schemas = {
  user: {
    username: { type: String, required: true },
    password: { type: String, required: true },
    creditential: { type: String, default: 'user' },
    email: String,
  },
};

module.exports = schemas;
