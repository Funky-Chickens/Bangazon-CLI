'use strict';

const { assert: {equal, isFunction, isNull, isNumber, isObject} } = require('chai');
const { checkForOpenOrders, openOrderPost, getOneOrder } = require('../app/models/Order.js');
const { buildOrdersDB, buildProductOrdersDB } = require('../db/build-db.js');


describe('Check for open orders', () => {
  before( function(done) {
    buildOrdersDB()
    .then( () => done()); 
  });
    it('should be a function', () => isFunction(checkForOpenOrders, 'Function?'));
    it('should be a number', () => {
        return checkForOpenOrders(2)
        .then( (orderCheckResult) => {
            isNumber(orderCheckResult);
        });
    });
});

describe('Open Order Post', () => {
  before( function(done) {
    buildOrdersDB()
    .then( () => {
    return buildProductOrdersDB()
    })
    .then( () => done()); 
  });
    it('should be a function', () => isFunction(openOrderPost, 'Function?'));
    it('should have the product that was posted', () => {
        return openOrderPost(1, 8)
        .then( (data) => {
            return getOneOrder(1)
            .then( (order) => {
                equal(order[order.length -1].prod_id, 8);
            });
        });
    });
});