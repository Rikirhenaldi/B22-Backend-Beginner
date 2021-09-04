/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const authControler = require('../src/controllers/auth')
const sinon = require('sinon')
const { expect } = require('chai')
const should = require('chai').should

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('auth register', () => {
  it('phone number length less than 10', (done) => {
    const req = {
      body: {
        email: 'joy@gmail.com',
        password: '123456',
        phoneNumber: '081791876'
      }
    }
    const res = mockingResponse()
    authControler.register(req, res).then((userData) => {
      userData.json.args[0][0].success.should.to.be.equal(false)
      userData.json.args[0][0].message.should.to.be.equal('input format number is wrong, digit number must be greater than 10')
      userData.status.args[0][0].should.to.be.equal(400)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('password length less than 5', (done) => {
    const req = {
      body: {
        email: 'joy@gmail.com',
        password: '1234',
        phoneNumber: '08179187686'
      }
    }

    const res = mockingResponse()
    authControler.register(req, res).then((userData) => {
      userData.json.args[0][0].success.should.to.be.false
      userData.json.args[0][0].message.should.to.be.equal('password must be greater than 6')
      userData.status.args[0][0].should.to.be.equal(400)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('Register successfully', (done) => {
    const req = {
      body: {
        email: 'joy@gmail.com',
        password: '123456',
        phoneNumber: '08179187686'
      }
    }

    const res = mockingResponse()
    authControler.register(req, res).then((userData) => {
      expect(userData.json.args[0][0].success).to.be.true
      userData.json.args[0][0].message.should.to.be.equal('Register Succsessfully')
      userData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})

describe('Auth Login', () => {
  it('Wrong email or password', (done) => {
    const req = {
      body: {
        email: 'joy@gmail.com',
        password: '12345'
      }
    }
    const res = mockingResponse()
    authControler.login(req, res).then((userData) => {
      expect(userData.json.args[0][0].success).to.be.false
      userData.json.args[0][0].message.should.to.be.equal('Wrong email or password!')
      userData.status.args[0][0].should.to.be.equal(401)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
  it('login successfully', (done) => {
    const req = {
      body: {
        email: 'joy@gmail.com',
        password: '123456'
      }
    }
    const res = mockingResponse()
    authControler.login(req, res).then((userData) => {
      expect(userData.json.args[0][0].success).to.be.true
      userData.json.args[0][0].message.should.to.be.equal('Login SuccessFully')
      userData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})
