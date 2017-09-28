'use strict';
const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);


let postPaymentOption = (buyerId, paymentType, acctNumber) => {
    return new Promise( (resolve, reject) => {
        db.get(`INSERT into paymentOptions VALUES (null, ${buyerId}, ${paymentType}, ${acctNumber})`, (err, user) => {
                if (err) return reject(err);
                resolve(user);
        });
    });
};

module.exports = { postPaymentOption };