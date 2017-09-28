'use strict';

const { assert: {equal, isFunction, property, isNull, isNumber, isObject} } = require('chai');
const { checkForOpenOrders, postOrder, getOneOrder } = require('../app/models/Order.js');
const { buildOrdersDB, buildProductOrdersDB } = require('../db/build-db.js');

describe('Orders', () => {
    before( function(done) {
        buildOrdersDB()
        .then( () => {
            return buildProductOrdersDB()
        })
        .then( () => done()); 
    });
    describe('Get One Order', () => {
        it('should be a function', () => isFunction(getOneOrder, 'Function?'));
        it('should get an order', () => {
            return getOneOrder(1)
              .then( (OneOrder) => {
                property(OneOrder, 'order_date');
            });
          });
    });
    describe('Check for Open Orders', () => {
        it('should be a function', () => isFunction(checkForOpenOrders, 'Function?'));
        it('should be a number', () => {
            return checkForOpenOrders(2)
            .then( (orderCheckResult) => {
                isNumber(orderCheckResult);
            });
        });
    });
    describe('Post Order', () => {
        it('should be a function', () => isFunction(postOrder, 'Function?'));
        it('should have the order that was posted', () => {
            return postOrder(new Date, 8)
            .then( (data) => {
                return getOneOrder(data)
                .then( (order) => {
                    equal(data, order.order_id);
                });
            });
        });
    });
});