'use strict';

const prompt = require('prompt');
const { checkForOpenOrders, postOrder, getOneOrder } = require('../models/Order');
const { postProdOrder } = require('../models/ProductOrder');
const { getAllProducts } = require('../models/Product');

//gets products for display -jmr
let addToCartStart = (userId) => {
    return new Promise( (resolve, reject) => {
        getAllProducts()
        .then( (prodObjs) => resolve(prodObjs));
    });
}

//if a user has an open order, will add product to open cart. if not will open new order and add product to that cart. -jmr
let addToCart = (selection, prodObjs, userId) => {
    return new Promise( (resolve, reject) => {
        let prodIds = getProductIds(prodObjs)
        let productToAdd = productSelectMatch(prodIds, selection);
        if(productToAdd) {
            checkForOpenOrders(userId)
            .then( (result) => {
                if(result) {
                    postProdOrder(result, productToAdd)
                    .then( (lastID) => {
                        console.log("Product Added To Cart");
                        resolve();
                    });
                } else {
                    postOrder(new Date, userId)
                    .then( (lastId) => {
                        postProdOrder(lastId, productToAdd)
                        .then( () => {
                            console.log("New Order Started With the Selected Product");
                            resolve();
                        });
                    });
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


module.exports = { addToCartStart, addToCart }