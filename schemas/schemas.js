const mongoose = require('mongoose');

const { Schema } = mongoose;

const Parameter = new Schema({
  value: Object,
  locked: { type: Boolean, default: false },
});

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
    parameters: {
      type: Map,
      of: Parameter,
    },
    started_at: {
      type: Date,
      default: Date.now,
    },
    finished_at: Date,
    status: String,
  },
};

module.exports = schemas;
