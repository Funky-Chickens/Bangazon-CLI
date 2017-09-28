'use strict';

const { buildUsersDB, buildOrdersDB, buildPaymentsDB, buildProductsDB, buildProductTypeDB, buildProductOrdersDB } = require('../db/build-db.js');

buildUsersDB(); 
buildOrdersDB();
buildPaymentsDB();
buildProductsDB();
buildProductTypeDB();
buildProductOrdersDB();