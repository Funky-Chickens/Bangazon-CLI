//const chai = require('chai');
const { assert: {eventually, equal, isNumber, exists, isFunction, isObject, isEqual, deepEqual} } = require('chai');
const { getOneUser, postUserObj } = require('../app/models/Customer.js');
const { functionThatCreatesTables, insertRows } = require('../db/build-db.js');
// const chaiAsPromised = require('chai-as-promised');

// chai.use(chaiAsPromised);//to deal with promises for future testing

describe('POST function', () => {
  // before( function() {
  //   this.timeout(10000);
  //   return functionThatCreatesTables()
  //   });
  it('should be a function', () => {
    isFunction(postUserObj, "postUserObj is a function");
  });
  it('should return a confirmation and "lastID"', () => {
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
    return postUserObj(testObj)
      .then( (results) => {
        console.log('What is the result of postUserObj', results)
        isNumber(results);
      })
  })
});

// Pro Tip: Remember, we are testing features, not functions. Require whichever modules you need to test a feature
