'use strict';

const {red, magenta, blue} = require("chalk");
const prompt = require('prompt');
const { deleteProduct } = require('../models/Product')
const { checkForOpenOrders, getOrders } = require('../models/Order')
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

module.exports.displayDeletableProducts = (prodObjs) => {
  let headerDivider = `${magenta('*********************************************************')}`
  console.log(`
  ${headerDivider}
  ${magenta(`**  Bangazon Products  **`)}
  ${headerDivider}`);
  prodObjs.forEach( (prod, i) => {
      console.log(`${magenta(`${i + 1}. `)}${prod.product_name}`)
  });
}

module.exports.deleteFromSeller = (selection, prodObjs, userId) => {
    return new Promise( (resolve, reject) => {
        let prodIds = getProductIds(prodObjs)
        let productToDelete = productSelectMatch(prodIds, selection);
        // console.log("get orders", getOrders(productToDelete));
        if(productToDelete) {
            // console.log(getOrders(productToDelete));
            getOrders(productToDelete)
            .then( (result) => {
              console.log("here", result);
              console.log("or here", productToDelete);
                if(result == false) {
                    deleteProduct(productToDelete.productId)
                    .then( (lastID) => {
                        console.log("Product deleted");
                        resolve();
                    });
                } else {
                            console.log("this item cannot be deleted");
                            resolve();
                };
            });
        } else {
            console.log("Invalid Product");
            resolve();
        }
    });
}

//matches the user's selection to the appropriate product ID -jmr
let productSelectMatch = (prodIds, selection) => {
    let productToAdd = prodIds[selection -1];
    if (productToAdd) return productToAdd
}



//take an array of product objects and pull out just an array of ID's -jmr
let getProductIds = (prodObjs) => {
    let prodIds = prodObjs.map( (prod) => {
        return prod.product_id;
    });
    return prodIds
}

// module.exports.selectProduct = (selection, prodObjs, userId) => {
//   return new Promise( (resolve, reject) => {
//     let productIds = getProductIds(prodObjs);
//     let prodUpdate = productSelectMatch(prodObjs, selection);
//     resolve(prodUpdate)
//   })
// }

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