// ********************** Initialize server **********************************

const server = require('../index.js'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
    // Sample test case given to test / endpoint.
    it('Returns the default welcome message', done => {
        chai
            .request(server)
            .get('/welcome')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals('success');
                assert.strictEqual(res.body.message, 'Welcome!');
                done();
            });
    });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************
describe('Testing Register API', () => {
    it('positive : /register. For tutor', done => {
        chai
            .request(server)
            .post('/register')
            .redirects(0)
            .send({
                username: 'johndoe',
                password: 'password123',
                tutor_student_rad: 'tutor'
            })
            .end((err, res) => {
                res.should.have.status(302);
                res.should.redirectTo('/registerInfoTutor');
                done();
            });
    });
});

describe('Testing Register API', () => {
    it('negative : /register. No username.', done => {
        chai
            .request(server)
            .post('/register')
            .redirects(0)
            .send({
                password: 'password123',
                tutor_student_rad: 'tutor'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.equal('Missing required field');
                done();
            });
    });
});

describe('Testing Login API', () => {
    it('positive : /login. Valid credentials', done => {
        chai
            .request(server)
            .post('/login')
            .redirects(0)
            .send({
                username: 'johndoe',
                password: 'password123',
                tutor_student_rad: 'tutor'
            })
            .end((err, res) => {
                res.should.have.status(302);
                res.should.redirectTo('/discover');
                done();
            });
    });
});

describe('Testing Login API', () => {
    it('negative : /login. Invalid username', done => {
        chai
            .request(server)
            .post('/login')
            .redirects(0)
            .send({
                username: 'invalid',
                password: 'password123',
                tutor_student_rad: 'tutor'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.include('Username not found! Register here.');
                done();
            });
    });
});
