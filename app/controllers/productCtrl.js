'use strict';

const {red, magenta, blue} = require("chalk");
const prompt = require('prompt');
const { getAllUserProducts, getAllProducts, postNewProduct, deletableProducts, deleteProduct, getSellerProduct, updateProduct }= require('../models/Product');
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
        if(productToDelete) {
          deleteProduct(productToDelete)
          .then( (lastID) => {
              console.log("Product deleted");
              resolve();
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

module.exports.showAllProducts = (userId) => {
  return new Promise( (resolve, reject) => {
      getAllUserProducts(userId)
      .then( (prodObjs) => {
        resolve(prodObjs);
      });
  });
}

module.exports.selectProduct = (selection, prodObjs, userId) => {
  return new Promise( (resolve, reject) => {
    let productIds = getProductIds(prodObjs);
    let prodUpdate = productSelectMatch(prodObjs, selection);
    resolve(prodUpdate)
  })
}

module.exports.productUpdateMenu = (prodObj) => {
  return new Promise( (resolve, reject) => {
    console.log(`
      ${magenta('1.')} Product Name "${prodObj.Name}"
      ${magenta('2.')} Product Description "${prodObj.description}"
      ${magenta('3.')} Product Price "${prodObj.price}"
      ${magenta('4.')} Product Type Id "${prodObj.product_type_id}"
      ${magenta('5.')} Quantity Available "${prodObj.quantity_avail}"
      ${magenta('6.')} Return to Customer Menu`)
    prompt.get([{
    name:'choice',
    description:'Select a number:',
    type:'number',
    required:true
  }], function(err, results){
    if (err) return reject(err);
    resolve(results); //resolves choice #
 })
})
}

module.exports.productNamePrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'productName',
      description: "Enter the new product name",
      type: 'string',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

module.exports.productDescPrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'productDesc',
      description: "Enter the new product description",
      type: 'string',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

module.exports.productPricePrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'productPrice',
      description: "Enter the new product price",
      type: 'string',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

module.exports.productTypePrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'productType',
      description: "Enter the new product type id",
      type: 'number',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

module.exports.productQtyPrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'productQty',
      description: "Enter the new product quantity",
      type: 'number',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

module.exports.updateProductPrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'choice',
      description: 'Please make a selection'
    }], function(err, results){
      if (err) return reject (err)
        resolve(results);
    })
  })
}

module.exports.productUpdate= updateProduct; //use as intermediary between model and controller

