'use strict';
const { Database } = require('sqlite3').verbose();
const { setActiveCustomer, getActiveCustomer } = require('../activeCustomer');
const path = require('path');
const dbPath = path.resolve(__dirname, '..','..', 'db','bangazon.sqlite');
const db = new Database(dbPath);

console.log(dbPath);

  let getOneUser= (id) => {//call in ui.js in .then
        return new Promise( (resolve, reject) => {//select user by user id and see user name instead of user id
            db.get(`SELECT *
                FROM users
                WHERE user_id = ${id}`, (err, user)=>{
                if (err) return reject(err);
                resolve(user);
                });
        });
    }

module.exports={getOneUser};