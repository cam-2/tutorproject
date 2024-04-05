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
    it('positive : /register', done => {
        chai
            .request(server)
            .post('/register')
            .send({
                subject_id: 1,
                review_id: 1,
                username: 'johndoe',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@colorado.edu',
                password: 'password123',
                year: 2,
                major: 'Computer Science'
            })
            .end((err, res) => {
                // expect(res).to.have.status(200); - needs to be worked on
                // expect(res).to.redirectTo('/login'); - needs to be worked on
                expect(res.body.message).to.equals('Registered!');
                done();
            });
    });
});

describe('Testing Register API', () => {
    it('negative : /register. Checking duplicate username', done => {
        chai
            .request(server)
            .post('/register')
            .send({
                subject_id: 1,
                review_id: 1,
                username: 'johndoe',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@colorado.edu',
                password: 'password123',
                year: 2,
                major: 'Computer Science'
            })
            .end((err, res) => {
                // expect(res).to.have.status(400); - needs to be worked on
                // expect(res).to.redirectTo('/register'); - needs to be worked on
                expect(res.body.message).to.equals('Invalid registration!');
                done();
            });
    });
});

// ********************************************************************************