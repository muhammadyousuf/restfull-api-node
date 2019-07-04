process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let product = require('../../../api/models/product');


let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../../app');
let should = chai.should();


chai.use(chaiHttp);
describe('Product', () => {
  
  describe('/GET product', () => {
      it('it should GET all the product', (done) => {
        chai.request(app)
            .get('/product')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object')
                  done()
                  
            })
            
      });
  });

});