const jwt = require('jsonwebtoken');
const config = require('config');
const moment = require('moment');
const _ = require('lodash');

const User = require('../models/user.model');

const creditential = {
  filters: {
    User: {
      user: {
        password: 0,
      },
    },
  },
};

function encodeToken(user) {
  return jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.expiresInSeconds });
}

function decodeToken(token, callback) {
  const payload = jwt.decode(token, config.jwt.TOKEN_SECRET);
  const now = moment().unix();
  if (now > payload.exp) {
    callback('Token has expired.');
  } else {
    callback(null, payload);
  }
}

function getFilter(model, user, filter) {
  return _.extend(filter, creditential.filters[model.modelName][user.creditential]);
}

function isAdmin(req, res, next) {
  if (req.user.creditential === 'admin') {
    next();
  } else {
    res.status(401).json({ status: 'error', msg: 'Jeton invalide', url: req.url });
  }
}

function isAdminOrMe(req, res, next) {
  if (req.params.userId === 'me') {
    User.findOne({ username: req.user.username })
      .then((myself) => {
        // eslint-disable-next-line dot-notation
        req.params.userId = myself['_id'];
        next();
      })
      .catch(() => {
        res.status(401).json({ status: 'error', msg: 'Jeton invalide', url: req.url });
      });
  } else if (req.user.creditential === 'admin') {
    next();
  } else {
    res.status(401).json({ status: 'error', msg: 'Jeton invalide', url: req.url });
  }
}

module.exports = {
  encodeToken,
  decodeToken,
  creditential,
  getFilter,
  isAdminOrMe,
  isAdmin,
};
