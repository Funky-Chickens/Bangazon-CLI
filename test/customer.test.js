'use strict';

const { assert: {eventually, equal, isNumber, exists, isFunction, isObject, isEqual, deepEqual} } = require('chai');
const { getOneUser, postUserObj } = require('../app/models/Customer.js');
const { functionThatCreatesTables, insertRows } = require('../db/build-db.js');

describe('POST function', () => {
  before( (done) => {
    functionThatCreatesTables()
    .then( () => done());
  });
  it('should be a function', () => {
    isFunction(postUserObj, "postUserObj is a function");
  });
  it('should return "lastID"', () => {
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
    postUserObj(testObj)
      .then( (results) => isNumber(results));
    });
});

// Pro Tip: Remember, we are testing features, not functions. Require whichever modules you need to test a feature
