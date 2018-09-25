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

  req.body.parameters = ((param) => {
    const parameters = {};
    Object.keys(param).forEach((key) => {
      parameters[key] = {
        value: param[key],
      };
    });
    return parameters;
  })(req.body.parameters);

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

exports.concludeAndUpdateStatus = (req, res) => {
  const { status } = req.body;
  Experiment.findByIdAndUpdate(req.params.expId, { status, finished_at: new Date() }, { new: true })
    .then((experiment) => {
      if (!experiment) {
        res.status(404).send({
          message: `Experiment not found with id ${req.params.expId}`,
        });
      }
      res.send({ message: `Experiment finished with status ${status}`, data: experiment });
    }).catch((err) => {
      res.status(400).send({
        message: err.message || 'Some error occurred while retrieving the experiments.',
      });
    });
};

exports.findAndLockParameter = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'There is no content',
    });
  }

  const path = `parameters.${req.params.paramName}`;
  const query = {};
  query[`${path}.locked`] = true;

  Experiment.findOne(
    { _id: req.params.expId },
  )
    .then((experiment) => {
      if (experiment.parameters.has(req.params.paramName)) {
        Experiment.findOneAndUpdate({ _id: req.params.expId }, { $set: query }, { new: true })
          .then((experimentUpdated) => {
            res.send(experimentUpdated.parameters.get(req.params.paramName));
          })
          .catch((err) => {
            res.status(500).send({
              message: err,
            });
          });
      } else {
        res.status(404).send({
          message: `The experiment ${req.params.expId} has no field named : ${req.params.paramName}`,
        });
      }
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({
          message: `Experiment not found with id ${req.params.expId}`,
        });
      }
      res.status(500).send({
        message: `Experiment updating user with id ${req.params.expId}`,
      });
    });
};

exports.putResults = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'There is no content',
    });
  }

  Experiment.findByIdAndUpdate(req.params.expId, { results: req.body }, { new: true })
    .then((experiment) => {
      if (!experiment) {
        res.status(404).send({
          message: `Experiment not found with id ${req.params.expId}`,
        });
      }
      res.send({ message: 'Experiment updated!', data: experiment });
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({
          message: `Experiment not found with id ${req.params.expId}`,
        });
      }
      res.status(500).send({
        message: `Experiment updating user with id ${req.params.expId}`,
      });
    });
};

exports.updateParamIfNotLocked = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'There is no content',
    });
  }

  const path = `parameters.${req.params.paramName}`;
  const query = {};
  query[`${path}.value`] = req.body.value;

  Experiment.findOne(
    { _id: req.params.expId },
  )
    .then((experiment) => {
      if (experiment.parameters.has(req.params.paramName)) {
        if (experiment.parameters.get(req.params.paramName).locked) {
          res.status(404).send({
            message: `The parameter ${req.params.paramName} of experiment ${req.params.expId} is locked`,
            data: experiment.parameters.get(req.params.paramName),
          });
        } else {
          Experiment.findOneAndUpdate({ _id: req.params.expId }, { $set: query }, { new: true })
            .then((experimentUpdated) => {
              res.send({ message: 'Param updated', data: experimentUpdated.parameters.get(req.params.paramName) });
            })
            .catch((err) => {
              res.status(500).send({
                message: err,
              });
            });
        }
      } else {
        res.status(404).send({
          message: `The experiment ${req.params.expId} has no field named : ${req.params.paramName}`,
        });
      }
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({
          message: `Experiment not found with id ${req.params.expId}`,
        });
      }
      res.status(500).send({
        message: `Experiment updating user with id ${req.params.expId}`,
      });
    });
};

exports.patchResults = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'There is no content',
    });
  }

  const query = {};
  Object.keys(req.body).forEach((key) => {
    query[`results.${key}`] = req.body[key];
  });

  Experiment.findByIdAndUpdate(req.params.expId, { $set: query }, { new: true })
    .then((experiment) => {
      if (!experiment) {
        res.status(404).send({
          message: `Experiment not found with id ${req.params.expId}`,
        });
      }
      res.send({ message: 'Experiment updated!', data: experiment });
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({
          message: `Experiment not found with id ${req.params.expId}`,
        });
      }
      res.status(500).send({
        message: `Experiment updating user with id ${req.params.expId}`,
      });
    });
};
/*
exports.delete = (req, res) => {

};
*/
