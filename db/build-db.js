'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname+'/bangazon.sqlite');
let { readFileSync } = require("fs");

let productContent = JSON.parse(readFileSync("./data/products.json"));
let paymentContent = JSON.parse(readFileSync("./data/paymentOptions.json"));
let productOrdersContent = JSON.parse(readFileSync("./data/productOrders.json"));
let productTypesContent = JSON.parse(readFileSync("./data/productTypes.json"));
let orderContent = JSON.parse(readFileSync("./data/orders.json"));
let userContent = JSON.parse(readFileSync("./data/users.json"));

//Resets the database -jmr
let functionThatCreatesTables = () => {
    return new Promise ( (resolve, reject) => {
        db.serialize( () => {
            db.run(`DROP TABLE IF EXISTS users`);
            db.run(`DROP TABLE IF EXISTS paymentOptions`);
            db.run(`DROP TABLE IF EXISTS orders`);
            db.run(`DROP TABLE IF EXISTS products`);
            db.run(`DROP TABLE IF EXISTS productOrders`);
            db.run(`DROP TABLE IF EXISTS productTypes`);
            db.run(`CREATE TABLE IF NOT EXISTS users(
                user_id INTEGER PRIMARY KEY NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                start_date TEXT NOT NULL,
                street_address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                postal_code INTEGER NOT NULL,
                phone TEXT NOT NULL,
                email TEXT NOT NULL
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS paymentOptions(
                payment_id INTEGER PRIMARY KEY NOT NULL,
                buyer_id INTEGER NOT NULL,
                payment_option_name TEXT NOT NULL,
                account_number INTEGER NOT NULL
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS orders(
                order_id INTEGER PRIMARY KEY NOT NULL,
                order_date TEXT NOT NULL,
                payment_type INTEGER,
                buyer_id INTEGER NOT NULL
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS products(
                product_id INTEGER PRIMARY KEY NOT NULL,
                product_type_id INTEGER NOT NULL,
                seller_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                description TEXT NOT NULL,
                quantity_avail INTEGER NOT NULL,
                price REAL NOT NULL
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS productOrders(
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                line_item_id INTEGER PRIMARY KEY NOT NULL
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS productTypes(
                type_id INTEGER PRIMARY KEY NOT NULL,
                label TEXT NOT NULL
            )`, () => {
                Promise.all([insertUserRows(), insertProductOrderRows(), insertProductTypesRows(), insertProductRows(), insertOrderRows(), insertPaymentsRows()])
                .then ( () => {
                    resolve(); //Resolves when tables are ready to be tested -jmr
                })
            });
        });
    });
}

//This compartmentalizes JUST the users DB functions to rebuild just that table rather than the whole database. - the ladies
function buildUsersDB () {
    db.serialize( () => {
        db.run(`DROP TABLE IF EXISTS users`);
        db.run(`CREATE TABLE IF NOT EXISTS users(
                user_id INTEGER PRIMARY KEY NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                start_date TEXT NOT NULL,
                street_address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                postal_code INTEGER NOT NULL,
                phone TEXT NOT NULL,
                email TEXT NOT NULL
            )`);
        insertUserRows();
    })
}

//Populates the database -jmr
function insertUserRows() {
    return new Promise ( (resolve, reject) => {
        Promise.all(userContent.map( ({user_id, first_name, last_name, start_date, street_address, city, state, postal_code, phone, email}) => {
            return new Promise( (resolve, reject) => {
                db.run(`INSERT 
                    INTO users 
                    VALUES 
                    (null, "${first_name}", 
                    "${last_name}", 
                    "${start_date}", 
                    "${street_address}", 
                    "${city}", 
                    "${state}", 
                    ${postal_code}, 
                    "${phone}", 
                    "${email}"
                )`, function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                });
            });
        }))
        .then( (arrayOfIds) => {
            console.log("last IDs", arrayOfIds);
            resolve();
        })
        .catch( (err) => {
            reject(err);
        })
    });
}
    //productOrders -el/gm
function insertProductOrderRows () {
    return new Promise ( (resolve, reject) => {
        Promise.all(productOrdersContent.map( ({order_id, product_id}) => {
            return new Promise( (resolve, reject) => {
                db.run(`INSERT INTO productOrders VALUES (${order_id}, ${product_id}, null)`, function (err) {
                    if (err) return reject (err);
                    resolve(this.lastID);
                });
            });
        }))
        .then( (stuff) => {
            resolve();
        })
        .catch( (err) => {
            reject(err);
        })
    });
}
    //products -el/gm
function insertProductRows () {
    return new Promise( (resolve, reject) => {
        Promise.all(productContent.map( ({product_type_id, seller_id, product_name, description, quantity_avail, price}) => {
            return new Promise( (resolve, reject) => {
                db.run(`INSERT INTO products VALUES (null, ${product_type_id}, ${seller_id}, "${product_name}", "${description}", ${quantity_avail}, ${price})`, function (err) {
                    if (err) return reject (err);
                    resolve(this.lastID);
                });
            });
        }))
        .then( (stuff) => {
            resolve();
        })
        .catch( (err) => {
            reject(err);
        })
    })
}
    //product types -el/gm
function insertProductTypesRows () {
    return new Promise( (resolve, reject) => {
        Promise.all(productTypesContent.map( ({label}) => {
            return new Promise( (resolve, reject) => {
                db.run(`INSERT INTO productTypes VALUES (null, "${label}")`, function (err) {
                    if (err) return reject (err);
                    resolve(this.lastID);
                });
            });
        }))
        .then( (stuff) => {
            resolve();
        })
        .catch( (err) => {
            reject(err);
        })
    })
}
    // payment_types -el/gm
function insertPaymentsRows () {
    return new Promise( (resolve, reject) => {
        Promise.all(paymentContent.map( ({buyer_id, payment_option_name, account_number}) => {
            return new Promise( (resolve, reject) => {
                db.run(`INSERT INTO paymentOptions VALUES (null, ${buyer_id}, '${payment_option_name}', ${account_number})`, function (err) {
                    if (err) return reject (err);
                    resolve(this.lastID);
                });
            });
        }))
      .then( (stuff) => {
          resolve();
      })
      .catch( (err) => {
          reject(err);
      })          
    })
}
    // orders -el/gm
function insertOrderRows () {
    return new Promise( (resolve, reject) => {
        Promise.all(orderContent.map( ({order_date, payment_type, buyer_id}) => {
            return new Promise( (resolve, reject) => {
                db.run(`INSERT INTO orders VALUES (null, "${order_date}", ${payment_type}, ${buyer_id})`, function (err) {
                    if (err) return reject (err);
                    resolve(this.lastID);
                });     
            });
        }))
        .then( (stuff) => {
              resolve();
          })
          .catch( (err) => {
              reject(err);
          })  
    })
}

module.exports = { functionThatCreatesTables, buildUsersDB };