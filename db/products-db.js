// generate a bunch of products and types with Faker
'use strict';

const productsDb = require('products.json');

module.exports.generateProdTypes = () => {
  let prodTypes = [];

  for (let i = 0; i < 12; i++) {
    let label = faker.commerce.department();

    prodTypes.push({
      label
    });
  }
  return prodTypes;
};

module.exports.generateProducts = () => {
  
  return productsDb;
};


// to get it into the DB we need to insert them into... 
//but then also each one needs to correlate to a dept number