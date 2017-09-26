const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname+'/bangazon.sqlite');
let { readFileSync } = require("fs");

let productContent = JSON.parse(readFileSync("./db/products.json"));
let paymentContent = JSON.parse(readFileSync("./db/paymentOptions.json"));
let productOrdersContent = JSON.parse(readFileSync("./db/productOrders.json"));
let productTypesContent = JSON.parse(readFileSync("./db/productTypes.json"));
let orderContent = JSON.parse(readFileSync("./db/orders.json"));
let userContent = JSON.parse(readFileSync("./db/users.json"));

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
        )`);
    });
    resolve(insertRows());
    reject(err);
    });
};

function insertRows() {
    Promise.all(userContent.map( ({first_name, last_name, start_date, street_address, city, state, postal_code, phone, email}) => {
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
            "${email}")`, function (err) {
              if (err) return reject(err);
              resolve(this.lastID);
            });
        })
    }));
         //productOrders
    Promise.all(productOrdersContent.map( ({order_id, product_id}) => {
        return new Promise( (resolve, reject) => {
            db.run(`INSERT INTO productOrders VALUES (${order_id}, ${product_id}, null)`, function (err) {
                if (err) return reject (err);
                resolve(this.lastID);
            })
        })
    }));
    //products
    Promise.all(productContent.map( ({product_type_id, seller_id, product_name, description, quantity_avail, price}) => {
        return new Promise( (resolve, reject) => {
            db.run(`INSERT INTO products VALUES (null, ${product_type_id}, ${seller_id}, "${product_name}", "${description}", ${quantity_avail}, ${price})`, function (err) {
                if (err) return reject (err);
                resolve(this.lastID);
            });
        })
    }));
    //product types
    Promise.all(productTypesContent.map( ({label}) => {
        return new Promise( (resolve, reject) => {
            db.run(`INSERT INTO productTypes VALUES (null, "${label}")`, function (err) {
                if (err) return reject (err);
                resolve(this.lastID);
            })
        });
    }))
    // payment_types
    Promise.all(paymentContent.map( ({buyer_id, payment_option_name, account_number}) => {
        return new Promise( (resolve, reject) => {
            db.run(`INSERT INTO paymentOptions VALUES (null, ${buyer_id}, '${payment_option_name}', ${account_number})`, function (err) {
                if (err) return reject (err);
                resolve(this.lastID);
            });
        })
    }));

    // orders
    Promise.all(orderContent.map( ({order_date, payment_type, buyer_id}) => {
        return new Promise( (resolve, reject) => {
            db.run(`INSERT INTO orders VALUES (null, "${order_date}", ${payment_type}, ${buyer_id})`, function (err) {
                if (err) return reject (err);
                resolve(this.lastID);
            });     
        })
    }));
}

functionThatCreatesTables();

module.exports = { functionThatCreatesTables, insertRows }