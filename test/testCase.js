const chai = require('chai');
const mocha = require('mocha');

const { describe, it } = mocha;


const chaiHttp = require('chai-http');
const server = require('../app.js');

describe('Inserting data to database', () => {
  it('Inserted Successfully', (done) => {
   const payload = {
    name:"Soujanya"
   }
    chai.request(server)
      .post('/users')
      .send(payload)
      .end((_error, response) => {
        console.log(response);
        response.should.have.status(200);
        response.should.be.a('object');
        done();
      });
  });
});  

chai.should();

chai.use(chaiHttp);