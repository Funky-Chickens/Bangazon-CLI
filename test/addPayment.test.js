'use strict';
require('dotenv').config();
let TIMEOUT = process.env.TIMEOUT;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { assert: {property, eventually, equal, isNumber, exists, isFunction, isObject, isEqual, deepEqual} } = require('chai');
const { postPaymentOption } = require('../app/models/PaymentOption.js');
const { buildPaymentsDB } = require('../db/build-db.js');


describe('POST function', () => {
    let testPayment = {
        buyer_id: 49,
        payment_option_name: "Visa",
        account_number: "77788899"
    }; 
    it('should be a function', () => isFunction(postPaymentOption, "postPaymentOption is a function"));
it('should post the payment object the user created', () => {
    return postPaymentOption(49, "visa", 77788899).then( () => {
        console.log("yo");
    }
        );
    });
});