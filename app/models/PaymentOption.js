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

module.exports = { postPaymentOption };