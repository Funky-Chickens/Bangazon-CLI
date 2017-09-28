'use strict';

const { assert: {equal, property, isFunction, isArray, isObject} } = require('chai');
const { getOneUser, postUserObj, getAllUsers } = require('../app/models/Customer.js');

describe('Customer', () => {//model
  //TODO before hook?
  describe('Get One Customer', () => {//feature
    it('should be a function', () => isFunction(getOneUser, 'Function?'));
    it('should return an object', () => {
      getOneUser(1) //call function that returns a resolved result -el/gm
      .then( (result) => isObject(result));
    });
    it('should get a user', () => {
      getOneUser(1)
      .then( (result) => property(result, 'last_name'));
    });
  });
  describe('GetAllCustomers',() =>{
    it('should get all userObjects in an array', () =>{
      return getAllUsers()
      .then( (allUsers) =>{
        isArray(allUsers);
      })
    })
  })
});