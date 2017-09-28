'use strict';

const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);

let getAllUserProducts = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT products.seller_id, products.product_name AS "Name" FROM users 
        JOIN products where products.seller_id = users.user_id AND products.seller_id = ${id}
    `, (err, prods) => {
            if (err) return reject(err);
            if (prods[0].seller_id) {
                resolve(prods);
            } else {
                console.log("no products available");
            }
        });
    });

};

let postNewProduct = (prodObj) => {
    return new Promise( (resolve, reject) => {
        db.run(`INSERT INTO products VALUES (null, ${prodObj.product_type_id}, ${prodObj.seller_id}, "${prodObj.product_name}", "${prodObj.description}", ${prodObj.quantity_avail}, ${prodObj.price})`, function(err) {
                if(err) return reject(err);
                resolve(this.lastID);
        });
    });
};

let deletableProducts = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT product_id, product_name FROM products as p WHERE NOT EXISTS (SELECT * FROM productOrders as po WHERE p.product_id = po.product_id) AND p.seller_id = ${id}`, function(err, deleteArr) {
                if(err) return reject(err);
                resolve(deleteArr);
        });     
    });
};

let deleteProduct = (productId) => {
    return new Promise( (resolve, reject) => {
        db.run(`DELETE FROM products WHERE product_id = ${productId}`, function(err) {
            if(err) return reject(err);
            resolve(this.changes);
        });
    });
};

module.exports = { getAllUserProducts, postNewProduct, deletableProducts, deleteProduct };