'use strict';

const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);

let getAllUserProducts = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT products.product_id, products.seller_id, products.product_name AS "Name" FROM users 
        JOIN products where products.seller_id = users.user_id AND products.seller_id = ${id}
    `, (err, prods) => {
            if (err) return reject(err);
            if (prods[0] && prods[0].seller_id) {
                resolve(prods);
            } else {
                console.log("no products available");
            }
        });
    });

};

module.exports = { getAllUserProducts };