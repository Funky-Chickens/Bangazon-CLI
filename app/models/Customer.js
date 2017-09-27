'use strict';
const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);

//select user by user id and see user name instead of user id -el/gm
let getOneUser = (id) => {//call in ui.js in .then -el/gm
    return new Promise( (resolve, reject) => {
        db.get(`SELECT *
            FROM users
            WHERE user_id = ${id}`, (err, user) => {
                if (err) return reject(err);
                resolve(user);
        });
    });
};

//injects the user's data -jmr
let postUserObj = (userObj) => {
    return new Promise( (resolve, reject) => {
        db.run(`INSERT INTO users VALUES (null, 
            "${userObj.first_name}", 
            "${userObj.last_name}", 
            "${userObj.start_date}", 
            "${userObj.street_address}", 
            "${userObj.city}", 
            "${userObj.state}", 
            ${userObj.postal_code}, 
            "${userObj.phone}", 
            "${userObj.email}"
        )`, function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
};

module.exports = { getOneUser, postUserObj };