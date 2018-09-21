const Experiment = require('../controllers/experiment.controller.js');


module.exports = (router) => {
  router.get('/experiments', Experiment.findMine);
  router.get('/experiments/:expId', Experiment.find);
  router.post('/experiments', Experiment.create);
};
