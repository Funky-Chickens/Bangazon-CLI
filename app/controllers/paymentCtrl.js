'use strict';

const prompt = require('prompt');
const { getActiveCustomer } = require('../activeCustomer');
const { postPaymentOption, getUsersPaymentOptions, addPaymentToOrder } = require('../models/PaymentOption');



let createPaymentPrompt = () => {
    return new Promise( (resolve, reject) => {
      prompt.get([{
        name: 'payment_option_name',
        description: "Enter the payment option name",
        type: 'string',
        required: true
      },
      {
        name: 'account_number',
        description: "Enter the account number",
        type: 'number',
        required: true
      }], function(err, results) {
        if (err) return reject(err);
        resolve(results);
      })
    });
  };

  let getPayment = (userid) => {
      return new Promise ( ( resolve, reject) => {
          createPaymentPrompt().then((results) => {  
            postPaymentOption(userid, results.payment_option_name, results.account_number);
            resolve();
          });
      });
  }

module.exports= { getPayment };