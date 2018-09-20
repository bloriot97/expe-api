const router = require('express').Router();


// const config = require('config');

require('./user.routes.js')(router);


router.get('/', (req, res) => {
  res.status(200).send('Expe API v1');
});


module.exports = router;
