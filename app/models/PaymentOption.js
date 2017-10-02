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
                resolve();
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
                resolve();
        });
    });
};

let checkForOpenOrder = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT buyer_id, payment_type FROM orders
        WHERE payment_type IS NULL AND buyer_id = ${id}`, function (err, object){
            if (err) return reject(err);
            if (object.length > 0){
            resolve(object);
            }
            else {
                console.log("Sorry, you dont have any open orders");
                resolve(err);
            }
        });
    });
}

let getOrderTotal = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT `)
    })
}


module.exports = { postPaymentOption, getUsersPaymentOptions, addPaymentToOrder, checkForOpenOrder };