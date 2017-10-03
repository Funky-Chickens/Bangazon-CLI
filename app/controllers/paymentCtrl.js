'use strict'; 

const prompt = require('prompt');
const { getActiveCustomer } = require('../activeCustomer');
const { postPaymentOption, getUsersPaymentOptions, addPaymentToOrder, checkForOpenOrderToAddPayment } = require('../models/PaymentOption');

let PaymentAddToOrder = addPaymentToOrder;

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


let getPaymentIds = (paymentOptions) => {
    let paymentIdsArray = paymentOptions.map( (PO) => {
      return PO.payment_id;
    })
  return paymentIdsArray;
}

let paymentSelectMatch = (paymentIds, selection) => {
  let payment = paymentIds[selection -1];
  if (payment) return payment
}

let selectPayment = (selection, paymentObjs, userId) => {
  return new Promise( (resolve, reject) => {
    let paymentIdsArr = getPaymentIds(paymentObjs);
    let payment = paymentSelectMatch(paymentIdsArr, selection);
    resolve(payment);
  })
}


  let completeOrderPrompt = () => {
    return new Promise( (resolve, reject) => {
      prompt.get([{
        name: 'paymentId',
        description: "Enter the payment selection",
        type: 'number',
        required: true
      }], function(err, results) {
        if (err) return reject(err);
        resolve(results.paymentId);
      })
    });
  };

  let getPaymentTypes = getUsersPaymentOptions;

  let completeOrderWithPayment = (userid) => { //this is called by ui.js line 265-ish
    return new Promise( (resolve, reject) => {
      checkForOpenOrderToAddPayment(userid) //from the PaymentOption.js model, which gets an array of objects with prices of all items in the open order
      .then( (results) => {
        if (results) {
          let prices = []; //result is an array of objects with prices inside them
          results.forEach( (object) => {
            prices.push(object.price);
          })
          resolve(prices);
          } else {
            console.log("Sorry, you don't have any open orders.");
            resolve();
          }
        })
    })
  }

//to add up all the prices in the array - el
  let calcOrderTotal = (pricesArr) => {
    let total = pricesArr.reduce(function (sum, value) {
      return sum + value;
    }, 0);
  return total;
  }

module.exports= { getPayment,completeOrderWithPayment, completeOrderPrompt, calcOrderTotal, getPaymentTypes, selectPayment, PaymentAddToOrder };