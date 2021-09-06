/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const variantControler = require('../src/controllers/variant')
const sinon = require('sinon')
const supertest = require('supertest')
const { expect, assert } = require('chai')
const should = require('chai').should

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('create variants', () => {
  it('request errors', (done) => {
    const req = {
      body: {
        varia: 'dessert'
      }
    }
    const res = mockingResponse()
    variantControler.createVariants(req, res).then((variantData) => {
      variantData.json.args[0][0].success.should.to.be.equal(false)
      variantData.json.args[0][0].message.should.to.be.equal('request errors')
      variantData.status.args[0][0].should.to.be.equal(400)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('variant name length more than or equal 3', (done) => {
    const req = {
      body: {
        variant: 'de'
      }
    }
    const res = mockingResponse()
    variantControler.createVariants(req, res).then((variantData) => {
      expect(variantData.json.args[0][0].success).to.be.false
      variantData.json.args[0][0].message.should.to.be.equal('name of variant must be specifict')
      variantData.status.args[0][0].should.to.be.equal(400)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('create variant successfully', (done) => {
    const req = {
      body: {
        variant: 'large'
      }
    }
    const res = mockingResponse()
    variantControler.createVariants(req, res).then((variantData) => {
      expect(variantData.json.args[0][0].success).to.be.true
      variantData.json.args[0][0].message.should.to.be.equal('Variant Created Succsessfully')
      variantData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})

describe('get variants', () => {
  it('get all variant', (done) => {
    const req = {
      query: {
        search: ''
      }
    }
    const res = mockingResponse()
    variantControler.getVariants(req, res).then((variantData) => {
      variantData.json.args[0][0].success.should.to.be.equal(true)
      variantData.json.args[0][0].message.should.to.be.equal('list of all variant')
      variantData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('variant not found', (done) => {
    const req = {
      query: {
        search: 'be'
      }
    }
    const res = mockingResponse()
    variantControler.getVariants(req, res).then((variantData) => {
      variantData.json.args[0][0].success.should.to.be.equal(false)
      variantData.json.args[0][0].message.should.to.be.equal('variant not found')
      variantData.status.args[0][0].should.to.be.equal(400)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('get varian by name', (done) => {
    const req = {
      query: {
        search: 'e'
      }
    }
    const res = mockingResponse()
    variantControler.getVariants(req, res).then((variantData) => {
      variantData.json.args[0][0].success.should.to.be.equal(true)
      variantData.json.args[0][0].message.should.to.be.equal(`list of variant from ${req.query.search}`)
      variantData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})

describe('update variants', () => {
  it('update variant not exist on database', (done) => {
    const req = {
      params: {
        id: 50
      },
      body: {
        variant: 'dessert'
      }
    }
    const res = mockingResponse()
    variantControler.updateVariant(req, res).then((variantData) => {
      variantData.json.args[0][0].success.should.to.be.equal(false)
      variantData.json.args[0][0].message.should.to.be.equal('Cant update item cause item not found')
      variantData.status.args[0][0].should.to.be.equal(404)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('update variant successfully', (done) => {
    const req = {
      params: {
        id: 8
      },
      body: {
        variant: 'dessert'
      }
    }
    const res = mockingResponse()
    variantControler.updateVariant(req, res).then((variantData) => {
      variantData.json.args[0][0].success.should.to.be.equal(true)
      variantData.json.args[0][0].message.should.to.be.equal('Variant updated succsessfuly')
      variantData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})

describe('delete variants', () => {
  it('delete variant not exist on database', (done) => {
    const req = {
      params: {
        id: 50
      }
    }
    const res = mockingResponse()
    variantControler.deleteVariant(req, res).then((variantData) => {
      variantData.json.args[0][0].success.should.to.be.equal(false)
      variantData.json.args[0][0].message.should.to.be.equal('variant not found')
      variantData.status.args[0][0].should.to.be.equal(404)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('delete variant successfully', (done) => {
    const req = {
      params: {
        id: 112
      }
    }
    const res = mockingResponse()
    variantControler.deleteVariant(req, res).then((variantData) => {
      variantData.json.args[0][0].success.should.to.be.equal(true)
      variantData.json.args[0][0].message.should.to.be.equal('Variant has been Deleted')
      variantData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})
