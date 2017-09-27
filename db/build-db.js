const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname+'/bangazon.sqlite');
let {readFileSync} = require("fs");

let productContent = JSON.parse(readFileSync("./data/products.json"));
let paymentContent = JSON.parse(readFileSync("./data/paymentOptions.json"));
let productOrdersContent = JSON.parse(readFileSync("./data/productOrders.json"));
let productTypesContent = JSON.parse(readFileSync("./data/productTypes.json"));
let orderContent = JSON.parse(readFileSync("./data/orders.json"));
let userContent = JSON.parse(readFileSync("./data/users.json"));

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
        last_login TEXT NOT NULL,
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

    //productOrders
productOrdersContent.forEach( (lineItemObj) => {
    db.run(`INSERT INTO productOrders VALUES (${lineItemObj.order_id}, ${lineItemObj.product_id}, null)`)
    });
//products
productContent.forEach( (prodObj) => {
    db.run(`INSERT INTO products VALUES (null, ${prodObj.product_type_id}, ${prodObj.seller_id}, "${prodObj.product_name}", "${prodObj.description}", ${prodObj.quantity_avail}, ${prodObj.price})`);
});
    userContent.forEach( (userObj) => {
        db.run(`INSERT 
            INTO users 
            VALUES 
        (null, "${userObj.first_name}", 
        "${userObj.last_name}", 
        "${userObj.start_date}", 
        "${userObj.last_login}", 
        "${userObj.street_address}", 
        "${userObj.city}", 
        "${userObj.state}", 
        ${userObj.postal_code}, 
        "${userObj.phone}", 
        "${userObj.email}")`);
    });
//product types
productTypesContent.forEach( (prodTypeObj) => {
        db.run(`INSERT INTO productTypes (label) VALUES ("${prodTypeObj.label}")`)
    });
// payment_types
    paymentContent.forEach( (payObj) => {
        db.run(`INSERT INTO paymentOptions VALUES (null, ${payObj.buyer_id}, '${payObj.payment_option_name}', ${payObj.account_number})`);
    });
// orders
    orderContent.forEach((orderObj)  => {
        db.run(`INSERT INTO orders VALUES (null, "${orderObj.order_date}", ${orderObj.payment_type}, 
            ${orderObj.buyer_id})`);
    });
});