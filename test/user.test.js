// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// const mongoose = require("mongoose");

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');

chai.should();

const Auth = require('../auth/auth');
const User = require('../models/user.model');
const server = require('../app');

let token = '';
let connectedUser = {};

chai.use(chaiHttp);
// Our parent block
describe('Users 👥', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.remove({}, (err) => {
      if (!err) {
        done();
      }
    });
  });

  describe('User', () => {
    beforeEach((done) => { // Before each test we empty the database
      connectedUser = config.users.benjamin;
      token = Auth.encodeToken(connectedUser);
      done();
    });

    /*
    * Test the /GET route
    */
    describe('/GET users', () => {
      it('should GET the user\'s information', (done) => {
        const user = new User(connectedUser);
        user.save(() => {
          chai.request(server)
            .get('/api/v1/users/me')
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('username');
              res.body.should.have.property('email');
              res.body.should.not.have.property('password');
              done();
            });
        });
      });

      /*
      * Test the /GET route
      */
      describe('/GET/:id user', () => {
        it('should GET the user by id', (done) => {
          const user = new User({
            username: 'Benjamin',
            email: 'benji@gmail.com',
            password: 'sgdgf',
          });
          user.save((userSaveErr, userSaveRes) => {
            chai.request(server)
              .get(`/api/v1/users/${userSaveRes.id}`)
              .send(userSaveRes)
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('username');
                res.body.should.have.property('email');
                res.body.should.not.have.property('password');
                res.body.should.have.property('_id').eql(userSaveRes.id);
                done();
              });
          });
        });
      });
    });
    describe('/PUT/:id', () => {
      it('should not UPDATE a user given the id', (done) => {
        const user = new User({
          username: 'benjamin',
          email: 'benji@gmail.com',
          password: 'password',
        });
        user.save((userSaveErr, userSaveRes) => {
          chai.request(server)
            .put(`/api/v1/users/${userSaveRes.id}`)
            .send({ password: 'new', email: 'new@email.com' })
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('error');
              done();
            });
        });
      });
    });
    describe('/PUT/me', () => {
      it('should UPDATE his information', (done) => {
        const user = new User(connectedUser);
        user.save(() => {
          chai.request(server)
            .put('/api/v1/users/me')
            .send({ password: 'new', email: 'new@email.com' })
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('User updated!');
              res.body.data.should.have.property('password').eql('new');
              done();
            });
        });
      });
    });
  });

  describe('Admin', () => {
    beforeEach((done) => {
      connectedUser = config.users.admin;
      token = Auth.encodeToken(connectedUser);
      done();
    });
    describe('/PUT/:id', () => {
      it('should UPDATE a user given the id', (done) => {
        const user = new User({
          username: 'benjamin',
          email: 'benji@gmail.com',
          password: 'password',
        });
        user.save((userSaveErr, userSaveRes) => {
          chai.request(server)
            .put(`/api/v1/users/${userSaveRes.id}`)
            .send({ password: 'new', email: 'new@email.com' })
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('User updated!');
              res.body.data.should.have.property('password').eql('new');
              done();
            });
        });
      });
    });
    describe('/PUT/:id', () => {
      it('should not UPDATE the username given the id', (done) => {
        const user = new User({
          username: 'benjamin',
          email: 'benji@gmail.com',
          password: 'password',
        });
        user.save((userSaveErr, userSaveRes) => {
          chai.request(server)
            .put(`/api/v1/users/${userSaveRes.id}`)
            .send({ username: 'new' })
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('error');
              done();
            });
        });
      });
    });
  });
});
