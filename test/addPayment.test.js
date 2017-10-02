'use strict'; 
require('dotenv').config();
let TIMEOUT = process.env.TIMEOUT;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { assert: {property, eventually, isBoolean, equal, isNumber, exists, isFunction, isUndefined, isObject, isEqual, deepEqual,isArray} } = require('chai');
const { postPaymentOption, getUsersPaymentOptions, addPaymentToOrder, checkForOpenOrderToAddPayment} = require('../app/models/PaymentOption.js');
const { getOneOrder } = require('../app/models/Order.js');
const { buildPaymentsDB } = require('../db/build-db.js');


describe('PaymentOptions', () => {
    before( function(done) {
        buildPaymentsDB()
        .then( () => done()); 
      });
    describe('POST function', () => {
        let testPayment = {
            buyer_id: 49,
            payment_option_name: "Visa",
            account_number: "77788899"
        }; 
        it('should be a function', () => isFunction(postPaymentOption, "postPaymentOption is a function"));
        it('should post the payment object the user created', () => {
            return postPaymentOption(49, "visa", 77788899)
            .then( (changes) => {
                equal(changes, 1);
            }); 
        });
    });
    describe('CHECK function', () => {
        it('Should be a function', () => isFunction(checkForOpenOrderToAddPayment, 'Function?'));
        it('Should be able to retrieve an order with no payment type', () => {
            return checkForOpenOrderToAddPayment(2)
            .then( (result) => {
                isArray(result);
            });
        });
    });
    describe('GET function', () => {
        it('should be a function', () => isFunction(getUsersPaymentOptions, "getUsersPaymentOptions is a function"));
        it('should get an array containing users payment options', () => {
        return getUsersPaymentOptions(2)
        .then( (results) => { 
            isArray(results);
            }); 
        });
    });
    describe('POST function', () => {
        it('should be a function', () => isFunction(addPaymentToOrder, "addPaymentToOrder is a function"));
        it('should post the selected payment option to the customers open order', () => {
        return addPaymentToOrder(2,2)
        .then( (getback) => { 
            isNumber(getback);
            }); 
        });
    });
});

 