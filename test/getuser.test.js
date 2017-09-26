const { assert: {equal, isFunction, isObject} } = require('chai');
const { getOneUser, postUserObj } = require('../app/models/Customer.js');
const { functionThatCreatesTables } = require('../db/build-db.js');



describe('Get Customer', () => {
  it('should be a function', () => {
   isFunction(getOneUser, 'Function?');
  });
  it('should return an object', () => {
    return getOneUser(1) //call function that returns a resolved result
    .then( (result) => {
      isObject(result)
    })
  });
  it('should equal Bahringer',() => {
    return getOneUser(1)
    .then( (result) => {
      equal(result.last_name, 'Bahringer')
    })
  })
});