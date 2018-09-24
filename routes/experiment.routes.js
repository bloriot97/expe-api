const Experiment = require('../controllers/experiment.controller.js');


module.exports = (router) => {
  router.get('/experiments', Experiment.findMine);
  router.get('/experiments/:expId', Experiment.find);
  router.get('/experiments/:expId/parameters/:paramName', Experiment.findAndLockParameter);
  router.post('/experiments', Experiment.create);
  router.put('/experiments/:expId/results', Experiment.putResults);
  router.patch('/experiments/:expId/results', Experiment.patchResults);
};
