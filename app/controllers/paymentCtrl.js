'use strict'; 

const prompt = require('prompt');
const { getActiveCustomer } = require('../activeCustomer');
const { postPaymentOption, getUsersPaymentOptions, addPaymentToOrder, checkForOpenOrderToAddPayment } = require('../models/PaymentOption');



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


  let completeOrderPrompt = (userid) => {
    getUsersPaymentOptions(userid)
    .then( (pymOpts) => {
      for (let i=1; i<pymOpts.length+1; i++) {
      console.log("Payment option", i, pymOpts[i-1].payment_option_name, "ID:", pymOpts[i-1].payment_id);
      }
    })
    return new Promise( (resolve, reject) => {
      prompt.get([{
        name: 'paymentId',
        description: "Enter the payment Id",
        type: 'number',
        required: true
      }], function(err, results) {
        if (err) return reject(err);
        addPaymentToOrder(results.paymentId, userid)
        resolve(results);
      })
    });
  };

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

module.exports= { getPayment,completeOrderWithPayment, completeOrderPrompt, calcOrderTotal };