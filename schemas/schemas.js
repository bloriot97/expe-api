// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const schemas = {
  user: {
    username: { type: String, required: true },
    password: { type: String, required: true },
    creditential: { type: String, default: 'user' },
    email: String,
  },
  experiment: {
    name: { type: String, required: true },
    user: {
      username: String,
      email: String,
    },
    results: { type: Object, default: {} },
    started_at: {
      type: Date,
      default: Date.now,
    },
    finished_at: Date,
    status: String,
  },
};

module.exports = schemas;
