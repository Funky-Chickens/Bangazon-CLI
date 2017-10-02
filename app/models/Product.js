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


let postNewProduct = (prodObj) => {
    return new Promise( (resolve, reject) => {
        db.run(`INSERT INTO products VALUES (null, ${prodObj.product_type_id}, ${prodObj.seller_id}, "${prodObj.product_name}", "${prodObj.description}", ${prodObj.quantity_avail}, ${prodObj.price})`, function(err) {
                if(err) return reject(err);
                resolve(this.lastID);
        });
    });
};

let getAllProducts = () => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT products.product_id, products.seller_id, products.product_name AS "Name" FROM products
        `, (err, prods) => {
            if (err) return reject(err);
            if (prods[0]) {
                resolve(prods);
            } else {
                console.log("no products available");
            }
        });
    });
}

let deletableProducts = (id) => {
    return new Promise( (resolve, reject) => {
        db.all(`SELECT products.product_id, products.product_name FROM users 
            LEFT JOIN products ON users.user_id = products.seller_id
            LEFT JOIN productOrders ON products.product_id = productOrders.prod_id
            LEFT JOIN orders ON productOrders.order_id = orders.order_id
            WHERE orders.order_id IS NULL AND products.product_id IS NOT NULL AND users.user_id = ${id}`, function(err, deleteArr) {
                if(err) return reject(err);
                //  if (deleteArr[0] && deleteArr[0].seller_id) {
                //     console.log("array", deleteArr);
                //     // resolve(deleteArr);
                // } else {
                //     console.log("no products available to be deleted");
                // }
                resolve(deleteArr)
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

let getSellerProduct  = ( id) => {
        return new Promise( (resolve, reject) => {//select product by product id
            db.get(`SELECT *
                FROM products
                WHERE seller_id = ${id} AND product_id = 2`, (err, user)=>{
                    if (err) return reject(err);
                    resolve(user);
                });
        });
};

module.exports = { getAllUserProducts, getAllProducts, postNewProduct, deletableProducts, deleteProduct, getSellerProduct};
