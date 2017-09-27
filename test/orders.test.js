'use strict';

const { assert: {equal, isFunction, isNull, isNumber, isObject} } = require('chai');
const { checkForOpenOrders } = require('../app/models/Order.js');

describe('Check for open orders', () => {
    it('should be a function', () => isFunction(checkForOpenOrders, 'Function?'));
    it('should be a number', () => {
        checkForOpenOrders(2)
        .then( (orderCheckResult) => {
            isNumber(orderCheckResult);
        });
    });
});