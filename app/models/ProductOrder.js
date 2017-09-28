'use strict';

const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);

//posts a new product order, using an order ID and product ID -jmr
let postProdOrder = (orderId, prodId) => {
    return new Promise( (resolve, reject) => {
        db.run(`INSERT INTO productOrders VALUES (${orderId}, ${prodId}, NULL)`,
        function(err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
}

// gets a single product order with a line_item_id -jmr
let getProdOrder = (lineItemId) => {
    return new Promise( (resolve, reject) => {
        db.get(`SELECT * FROM productOrders WHERE line_item_id = ${lineItemId}`, (err, prodOrder) => {
            if (err) return reject(err);
            resolve(prodOrder)
        });
    });
}

module.exports = { postProdOrder, getProdOrder };