const mongoose = require('mongoose');
const schemas = require('../schemas/schemas.js');

const UserSchema = mongoose.Schema(schemas.user);

module.exports = mongoose.model('User', UserSchema);
