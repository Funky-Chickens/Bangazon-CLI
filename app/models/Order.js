'use strict';

const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);

//if there is an open order, will resolve the ID of that order. If no order or if only closed orders, will return -0

//for adding a product to an order, if no order open, start new order
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
            WHERE orders.order_id = ${id}`, (err, order) => {
                if (err) return reject(err);
                if (order.length) resolve(order[0]);
                else return reject("No such ID");
            });
    });
}


let postOrder = (order_date, buyer_id) => {
    return new Promise( (resolve, reject) => {
        db.run(`INSERT INTO orders VALUES (null,"${order_date}", null, ${buyer_id}
        )`, function(err) {
            if (err) return reject(err);
            resolve(this.lastID)
        });
    });
}

module.exports = { checkForOpenOrders, postOrder, getOneOrder };