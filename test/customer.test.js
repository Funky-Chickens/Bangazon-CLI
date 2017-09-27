use strict';

require('dotenv').config();
let TIMEOUT = process.env.TIMEOUT;

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
// const { assert: {eventually, equal, isNumber, exists, isFunction, isObject, isEqual, deepEqual} } = require('chai');
const { getOneUser, postUserObj } = require('../app/models/Customer.js');
const { functionThatCreatesTables, insertRows } = require('../db/build-db.js');

//global before() drops old and creates new tables before tests begin in any file -jmr
before( function(done) {
  this.timeout(TIMEOUT);
  functionThatCreatesTables()
  .then( () => done()); 
});

describe('POST function', () => {
  let testObj = {
    first_name: "Jason",
    last_name: "Monahajt",
    start_date: new Date,
    street_address: "455 Your Mom Street",
    city: "Nashville",
    state: "TN",
    postal_code: 37222,
    phone: "555-555-5555",
    email: "json@js.com"
  };
  it('should be a function', () => chai.assert.isFunction(postUserObj, "postUserObj is a function"));
  // it('should return "lastID"', () => {
  //   return postUserObj(testObj)
  //   .then( (results) => {
  //     console.log("last ID", results);
  //     chai.assert.isNumber(results);
  //   });
  // });
  it('should get the userObject that was just input', () => {
    // console.log("test Obj", testObj);
    return postUserObj(testObj)
    .then( (results) => {
      console.log('results of postUserObj', results)
      return getOneUser(16)
    })
    .then( (oneUser) => {
      console.log("results of getOneUser", oneUser);
      chai.assert.eventually.equal(oneUser.last_name, 'Monahajt')
    });
  })
});

// Pro Tip: Remember, we are testing features, not functions. Require whichever modules you need to test a feature -JS
