// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// const mongoose = require("mongoose");

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');

chai.should();

const Auth = require('../auth/auth');
const Experiment = require('../models/experiment.model');
const server = require('../app');

let token = '';
let connectedUser = {};

chai.use(chaiHttp);
// Our parent block
describe('Experiment 🔬', () => {
  beforeEach((done) => { // Before each test we empty the database
    Experiment.remove({}, (err) => {
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
    describe('/GET experiments', () => {
      it('should GET the experiment\'s list', (done) => {
        chai.request(server)
          .get('/api/v1/experiments')
          .set('authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
      });
      it('should GET the experiment info', (done) => {
        const experiment = new Experiment(
          {
            name: 'name',
            user: {
              username: connectedUser.username,
              email: connectedUser.email,
            },
          },
        );
        experiment.save((expErr, expRes) => {
          chai.request(server)
            .get(`/api/v1/experiments/${expRes.id}`)
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              // eslint-disable-next-line dot-notation
              res.body['_id'].should.eql(expRes.id);
              done();
            });
        });
      });
    });

    describe('/POST experiments', () => {
      it('should POST an experiment', (done) => {
        const name = 'exp';
        chai.request(server)
          .post('/api/v1/experiments')
          .send({ name })
          .set('authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.be.a('object');
            res.body.data.user.username.should.eql(connectedUser.username);
            // eslint-disable-next-line dot-notation
            res.body.data['_id'].should.be.a('string');
            res.body.data.name.should.eql(name);
            done();
          });
      });
    });
    describe('/PUT & /PATCH', () => {
      it('should PUT the results to the experiment', (done) => {
        const experiment = new Experiment(
          {
            name: 'expe',
            user: {
              username: connectedUser.username,
              email: connectedUser.email,
            },
          },
        );
        experiment.save((expErr, expRes) => {
          const results = {
            res1: 'some results',
            res2: {
              thing1: 2,
              thing2: '//',
            },
          };
          chai.request(server)
            .put(`/api/v1/experiments/${expRes.id}/results`)
            .send(results)
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.message.should.eql('Experiment updated!');
              res.body.data.results.should.be.a('object');
              res.body.data.results.should.have.property('res1');
              res.body.data.results.should.have.property('res2');
              done();
            });
        });
      });
      it('should PATCH (add) one or many result to the experiment', (done) => {
        const experiment = new Experiment(
          {
            name: 'expe',
            user: {
              username: connectedUser.username,
              email: connectedUser.email,
            },
            results: {
              res1: 'some results',
            },
          },
        );
        experiment.save((expErr, expRes) => {
          const results = {
            res2: {
              thing2: 'new',
            },
          };
          chai.request(server)
            .patch(`/api/v1/experiments/${expRes.id}/results`)
            .send(results)
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.message.should.eql('Experiment updated!');
              res.body.data.results.should.be.a('object');
              res.body.data.results.should.have.property('res1');
              res.body.data.results.should.have.property('res2');
              res.body.data.results.res2.should.have.property('thing2');
              res.body.data.results.res2.thing2.should.eql('new');
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
  });
});
