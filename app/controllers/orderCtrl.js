'use strict';

const prompt = require('prompt');
const { checkForOpenOrders, postOrder, getOneOrder } = require('../models/Order');
const { postProdOrder } = require('../models/ProductOrder');
const { getAllUserProducts } = require('../models/Product');
const { getActiveCustomer, setActiveCustomer } = require('../activeCustomer');


let addToCartStart = (userId) => {
    return new Promise( (resolve, reject) => {
        getAllUserProducts(userId)
        .then( (prodObjs) => {
            resolve(prodObjs);
        });
    });
}

let addToCart = (selection, prodObjs, userId) => {
    return new Promise( (resolve, reject) => {
        console.log("args from add to cart", selection, prodObjs);
        let prodIds = getProductIds(prodObjs)
        let productToAdd = productSelectMatch(prodIds, selection);
        checkForOpenOrders(userId)
        .then( (result) => {
            console.log("add to cart result", result)
            if(result) {
                postProdOrder(result, productToAdd)
                .then( (lastID) => resolve());
            }
        })
    });
}

let productSelectMatch = (prodIds, selection) => {
    console.log("prod select", prodIds, selection )
    let productToAdd = prodIds[selection -1];
    console.log("add prod?", productToAdd);
    if (productToAdd) return productToAdd
}



//take an array of product objects and pull out just an array of ID's
let getProductIds = (prodObjs) => {
    let prodIds = prodObjs.map( (prod) => {
        return prod.product_id;
    });
    return prodIds
}
//take an array of product objects and display them in a numbered list.


module.exports = { addToCartStart, addToCart }