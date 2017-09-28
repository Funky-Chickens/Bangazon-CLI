'use strict';
require('dotenv').config();
let TIMEOUT = process.env.TIMEOUT;
// const chai = require("chai");
// const chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const { assert: {property, eventually, equal, isNumber, exists, isFunction, isArray, isObject, isEqual, deepEqual} } = require('chai');
const { getOneUser, postUserObj } = require('../app/models/Customer.js');
const { buildUsersDB } = require('../db/build-db.js');

//global before() drops old and creates new tables before tests begin in any file -jmr
describe('Customer', () => {
  before( function(done) {
    buildUsersDB()
    .then( () => done()); 
  });
  describe('POST new user function', () => {
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
    it('should be a function', () => isFunction(postUserObj, "postUserObj is a function"));
    it('should return "lastID"', () => {
      return postUserObj(testObj)
      .then( (results) => {
        isNumber(results);
      });
    });
    it('should get the userObject that was just input', () => {
      return getOneUser(1)
        .then( (oneUser) => {
          property(oneUser, 'last_name');
      });
    });
  });
})

// Pro Tip: Remember, we are testing features, not functions. Require whichever modules you need to test a feature -JS
