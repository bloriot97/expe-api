const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');
const expressJWT = require('express-jwt');
// const cors = require('cors');


const app = express();

const api = require('./routes/api_v1.routes');
const db = require('./db/db');


// var cors = require('cors')


// Conection a la db //
db.connect();


// authoriser le cross origine pour communiquer avec l'app
// app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// authentifaication bar web tocken
app.use('/api/v1', expressJWT({ secret: config.jwt.secret })
  .unless({ path: ['/api/v1/auth/login', '/api/v1/auth/signup'] }), api);

app.use('/api/v1', api);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).send('Home page!');
});

// catch Authorization errors
app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ status: 'error', msg: 'Jeton invalide', url: req.url });
  }
});


const server = app.listen(3001, () => {
  console.log('App running on port.', server.address().port);
});


module.exports = app; // for testing
