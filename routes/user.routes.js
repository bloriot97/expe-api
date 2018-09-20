const user = require('../controllers/user.controller.js');
const Auth = require('../auth/auth');


module.exports = (router) => {
  router.post('/users', user.create);
  router.get('/users/me', user.findMe);
  router.post('/auth/login', user.login);
  router.post('/auth/signup', user.create);
  router.get('/users', user.findAll);
  router.get('/users/:userId', user.findOne);
  router.put('/users/:userId', Auth.isAdminOrMe, user.update);
  // router.delete('/users/:userId', user.delete);
};
