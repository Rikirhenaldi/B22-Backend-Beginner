const assert = require('assert')
// const {expect} = require("chai")
const should = require("chai").should()
let greetings = "hello"


describe("this example test", ()=> {
  it("greeting variable should be hello", ()=> {
    // assert.equal(2+2, 4)
    // expect(2+2).equal(4)
    // expect(true).to.be.true
    greetings.should.to.be.equal("hello")
  })
})