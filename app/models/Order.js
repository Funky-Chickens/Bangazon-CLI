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
                if(!order || order.payment_type) {
                    resolve(-0);
                } else {
                    resolve(order.order_id);
                };
            });
    });
}

let getOneOrder = (id) => {
    return new Promise( (resolve, reject) => {//select order by order id and see order name
        db.all(`SELECT *
            FROM orders
            LEFT JOIN productOrders ON orders.order_id = productOrders.order_id 
            LEFT JOIN products ON products.product_id = productOrders.prod_id
            WHERE orders.order_id = ${id}`, (err, order) => {
                if (err) return reject(err);
                if (order.length) resolve(order);
                else return reject("No such ID");
            });
    });
}

let openOrderPost = (orderId, productId) => {
    return new Promise( (resolve, reject) => {
        db.run(`INSERT INTO productOrders VALUES (${orderId}, ${productId}, NULL
        )`, (err) => {
            if (err) return reject(err);
            resolve()
        });
    });
}

module.exports = { checkForOpenOrders, openOrderPost, getOneOrder };