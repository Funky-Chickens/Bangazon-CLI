const chai = require('chai');
const { assert: {eventually, equal, isFunction, isObject, isEqual, deepEqual} } = require('chai');
const { getOneUser } = require('../app/models/Customer.js');
// const chaiAsPromised = require('chai-as-promised');

// chai.use(chaiAsPromised);//to deal with promises for future testing

// Placed here to confirm test file runs properly
describe('post', () => {
  describe('Get Customer', () => {
    it('should be a function ', () => {
     chai.assert.isFunction(getOneUser, 'Function?');
    });
    it('should return an object', () => {
      getOneUser(1) //call function that returns a resolved result
      .then( (result) => {
        isObject(result)
      })
      .catch( (err) => {
       console.log('error', err)
      })
    })
    it('should equal Bahringer',() => {
      getOneUser(1)
      .then( (result) => {
        equal(result.last_name, 'Bahringer')
      })
      .catch( (err) => {
        console.log( 'equal error', err)
      })
    })
  });
});

// Pro Tip: Remember, we are testing features, not functions. Require whichever modules you need to test a feature
