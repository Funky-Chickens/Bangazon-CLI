'use strict';

const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);

//if there is an open order, will resolve the ID of that order. If no order or if only closed orders, will return -0
let checkForOpenOrders = (id) => {
    return new Promise ( (resolve, reject) => {
        db.get(`SELECT orders.order_id, orders.payment_type, orders.buyer_id FROM orders 
            WHERE orders.buyer_id = ${id} AND orders.payment_type IS NULL
            `, (err, order) => {
                if (err) return reject(err);
                if(order && order.payment_type) {
                    resolve(-0);
                } else {
                    resolve(order.order_id);
                }
            });
    });
}

module.exports = { checkForOpenOrders };