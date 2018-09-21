const mongoose = require('mongoose');
const schemas = require('../schemas/schemas.js');

const ExperimentSchema = mongoose.Schema(schemas.experiment);

module.exports = mongoose.model('Experiment', ExperimentSchema);
