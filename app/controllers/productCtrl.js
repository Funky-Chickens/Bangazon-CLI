'use strict';

const prompt = require('prompt');
// const { getActiveCustomer } = require('../activeCustomer');

module.exports.newProductPrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'product_name',
      description: "Enter the product name",
      type: 'string',
      required: true
    },
    {
      name: 'price',
      description: "Enter the product's Price",
      type: 'number',
      required: true
    },
    {
      name: 'description',
      description: "Enter the product description",
      type: 'string',
      required: true
    },
    {
      name: 'product_type_id',
      description: "Enter the product type Id",
      type: 'number',
      required: true
    },
    {
      name: 'quantity_avail',
      description: "Enter the quantity available",
      type: 'number',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

module.exports.deleteProdPrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'productId',
      description: "Enter the product Id to be deleted",
      type: 'number',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

let productPopPrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'productId',
      description: "Enter the product Id",
      type: 'number',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};