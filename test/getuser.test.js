'use strict';

const { assert: {equal, property, isFunction, isObject} } = require('chai');
const { getOneUser, postUserObj } = require('../app/models/Customer.js');
const { functionThatCreatesTables } = require('../db/build-db.js');

describe('Get Customer', () => {
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