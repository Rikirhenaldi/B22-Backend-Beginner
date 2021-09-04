const categoryControler = require('../src/controllers/categories')
const sinon = require('sinon')
const supertest = require('supertest')
const { APP_URL } = process.env
const { expect, assert } = require('chai')
const should = require('chai').should

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('create category', () => {
  it('request errors', (done) => {
    const req = {
      body: {
        catego: 'new menu'
      }
    }
    const res = mockingResponse()
    categoryControler.createCategories(req, res).then((categoryData) => {
      categoryData.json.args[0][0].success.should.to.be.equal(false)
      categoryData.json.args[0][0].message.should.to.be.equal('request body erorrs')
      categoryData.status.args[0][0].should.to.be.equal(500)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('category name length more than or equal 3', (done) => {
    const req = {
      body: {
        category: 'de'
      }
    }
    const res = mockingResponse()
    categoryControler.createCategories(req, res).then((categoryData) => {
      expect(categoryData.json.args[0][0].success).to.be.false
      categoryData.json.args[0][0].message.should.to.be.equal('name of category must be specifict')
      categoryData.status.args[0][0].should.to.be.equal(400)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('create category successfully', (done) => {
    const req = {
      body: {
        category: 'new menu'
      }
    }
    const res = mockingResponse()
    categoryControler.createCategories(req, res).then((categoryData) => {
      expect(categoryData.json.args[0][0].success).to.be.true
      categoryData.json.args[0][0].message.should.to.be.equal('Category Created Succsessfully')
      categoryData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})

describe('get category', () => {
  it('get all category', (done) => {
    let req = {
      body: {
      }
    }
    const res = mockingResponse()
    categoryControler.getCategories(req, res).then((categoryData) => {
      categoryData.json.args[0][0].success.should.to.be.equal(true)
      categoryData.json.args[0][0].message.should.to.be.equal('List of Category')
      categoryData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})

describe('update category', () => {
  it('update category not exist on database', (done) => {
    const req = {
      params: {
        id: 50
      },
      body: {
        category: "dessert"
      }
    }
    let res = mockingResponse()
    categoryControler.updateCategory(req, res).then((categoryData) => {
      categoryData.json.args[0][0].success.should.to.be.equal(false)
      categoryData.json.args[0][0].message.should.to.be.equal('Cant update item cause item not found')
      categoryData.status.args[0][0].should.to.be.equal(404)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('update Category successfully', (done) => {
    const req = {
      params: {
        id: 11
      },
      body: {
        variant: "dessert"
      }
    }
    let res = mockingResponse()
    categoryControler.updateCategory(req, res).then((categoryData) => {
      categoryData.json.args[0][0].success.should.to.be.equal(true)
      categoryData.json.args[0][0].message.should.to.be.equal('Category updated succsessfuly')
      categoryData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})

describe('delete category', () => {
  it('delete category not exist on database', (done) => {
    const req = {
      params: {
        id: 800
      }
    }
    let res = mockingResponse()
    categoryControler.deleteCategory(req, res).then((categoryData) => {
      categoryData.json.args[0][0].success.should.to.be.equal(false)
      categoryData.json.args[0][0].message.should.to.be.equal('Category not found')
      categoryData.status.args[0][0].should.to.be.equal(404)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })

  it('delete category successfully', (done) => {
    const req = {
      params: {
        id: 20
      }
    }
    let res = mockingResponse()
    categoryControler.deleteCategory(req, res).then((categoryData) => {
      categoryData.json.args[0][0].success.should.to.be.equal(true)
      categoryData.json.args[0][0].message.should.to.be.equal('Category has been Deleted')
      categoryData.status.args[0][0].should.to.be.equal(200)
    }).catch((err) => {
      console.log(err)
    })
    done()
  })
})