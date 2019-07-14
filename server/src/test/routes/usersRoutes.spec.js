const chai = require('chai')
const chaiHttp = require('chai-http')
chai.should()
const server = require('../../index')

chai.use(chaiHttp);
describe('Users routes', () => {
    it('it should GET all users', (done) => {
        chai.request(server)
        .get('/api/users/all')
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eql(2);
            done()
        })
    })
})