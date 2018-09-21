const Experiment = require('../models/experiment.model.js');

exports.create = (req, res) => {
  if (req.body === undefined) {
    res.status(400).send({
      message: 'There is no content',
    });
  }
  req.body.user = {};
  req.body.user.username = req.user.username;
  req.body.user.email = req.user.email;
  const experiment = new Experiment(req.body);

  experiment.save()
    .then((data) => {
      res.send({ message: 'Experiment successfully added!', data });
    }).catch((err) => {
      res.status(400).send(err);
    });
};

exports.findMine = (req, res) => {
  Experiment.find({ user: { username: req.user.username } }, { __v: 0 })
    .then((experiments) => {
      res.send(experiments);
    }).catch((err) => {
      res.status(400).send({
        message: err.message || 'Some error occurred while retrieving the experiments.',
      });
    });
};

exports.find = (req, res) => {
  Experiment.findById(req.params.expId, { __v: 0 })
    .then((experiment) => {
      if (!experiment) {
        res.status(404).send({
          message: `Experiment not found with id ${req.params.expId}`,
        });
      }
      res.send(experiment);
    }).catch((err) => {
      res.status(400).send({
        message: err.message || 'Some error occurred while retrieving the experiments.',
      });
    });
};

/*
exports.delete = (req, res) => {

};
*/
