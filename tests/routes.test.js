// const request = require('supertest');
// const app = require('../src/server');
const chai = require('chai');
const expect = chai.expect;
const url = `http://localhost:4000/graphql`;
const request = require('supertest')(url);

describe('Endpoints', () => {
    it('Returns all authors', (done) => {
        request.post('/graphql')
        .send({ query: '{ authors { id firstName lastName } }' })
        .expect(200)
        .end((err, res) => {
            // res will contain array of all users
            if (err) return done(err);
            console.log(res.body.data.authors);
            res.body.data.authors.should.have.lengthOf(4);
        })  
    })
})