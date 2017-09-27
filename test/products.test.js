'use strict';

const { assert: {equal, isFunction, isObject, isArray} } = require('chai');
const { getAllUserProducts } = require('../app/models/Product.js');

describe('Get User Products', () => {
    it('should be a function', () => isFunction(getAllUserProducts, 'Function?'));
    it('should return an array', () => {
        getAllUserProducts(3)
        .then( (prods) => {
            isArray(prods);
        });
    });
    it('should have the correct seller', () => {
        getAllUserProducts(3)
        .then( (user) => {
            equal(user[0].seller_id, 3);
        });
    });
});
