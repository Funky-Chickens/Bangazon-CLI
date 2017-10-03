'use strict'; 
const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);


let postPaymentOption = (buyerId, paymentType, acctNumber) => {
    return new Promise( (resolve, reject) => {
        db.run(`INSERT into paymentOptions VALUES (null, ${buyerId}, "${paymentType}", ${acctNumber})`, function (err) {
                if (err) return reject(err);
                resolve(this.changes);
        });
    });
};

let getUsersPaymentOptions = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT * from paymentOptions where paymentOptions.buyer_id = ${id} `, function (err, payments) {
                if (err) return reject(err);
                resolve(payments);
        });
    });
};

let addPaymentToOrder = (paymentId, id) => {
   return new Promise( (resolve, reject) => {
        db.run(`UPDATE orders set payment_type = ${paymentId} where buyer_id = ${id} AND payment_type is NULL`, function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
        });
    });
};

//want to get the prices of all the products on a user's open order only - el/cm
let checkForOpenOrderToAddPayment = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT price from products, productOrders, orders
            WHERE products.product_id = productOrders.prod_id
            AND orders.order_id = productOrders.order_id
            AND orders.payment_type IS NULL 
            AND orders.buyer_id = ${id}`, function (err, prodsArr){
            if (err) return reject(err);
            if (prodsArr.length > 0){
            resolve(prodsArr);
            }
            else {
                resolve();
            }
        });
    });
}



let getOrderTotal = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT `)
    })
}


module.exports = { postPaymentOption, getUsersPaymentOptions, addPaymentToOrder, checkForOpenOrderToAddPayment };