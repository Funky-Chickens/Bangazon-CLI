  'use strict';

const prompt = require('prompt');

//make sure the name of each property matches the object properties passed to the function using this data object
module.exports.promptNewCustomer = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'first_name',
      description: 'Enter customer first name',
      type: 'string',
      required: true
    }, {
      name: 'last_name',
      description: 'Enter customer last name',
      type: 'string',
      required: true
    }, {
      name: 'street_address',
      description: 'Enter street address',
      type: 'string',
      required: true
    }, {
      name: 'city',
      description: 'Enter city',
      type: 'string',
      required: true
    }, {
      name: 'state',
      description: 'Enter state (KY)',
      type: 'string',
      required: true
    }, {
      name: 'postal_code',
      description: 'Enter postal code',
      type: 'string',
      required: true
    }, {
      name: 'phone',
      description: 'Enter phone number (xxx-yyy-zzzz)',
      type: 'string',
      required: true
    }, {
      name: 'email',
      description: 'Enter email address',
      type: 'string',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results); //resolves back to ui.js - crgmel
    })
  });
};
