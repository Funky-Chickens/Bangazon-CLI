'use strict';

const { assert: {equal, isFunction, isObject, isArray, isNumber, notExists} } = require('chai');
const { getAllUserProducts, postNewProduct, deletableProducts, deleteProduct, getSellerProduct } = require('../app/models/Product.js');
const { buildProductsDB } = require('../db/build-db.js');

describe('Product', () => {
  before( function(done) {
    buildProductsDB()
    .then( () => done()); 
  });
    describe('Get User Products', () => {
        it('should be a function', () => isFunction(getAllUserProducts, 'Function?'));
        it('should return an array', () => {
            return getAllUserProducts(3)
            .then( (prods) => {
                isArray(prods);
            });
        });
        it('should have the correct seller', () => {
            return getAllUserProducts(3)
            .then( (user) => {
                equal(user[0].seller_id, 3);
            });
        });
    });
    describe('Post Products for seller', () => {
        let testObj = {
                product_type_id: 4,
                product_name: "test",
                seller_id: 6,
                description: "test",
                price: 5,
                quantity_avail: 3
            }
        it('should be a function', () => isFunction(postNewProduct, 'Function?'));
        it('it should return a number', () => {
            return postNewProduct(testObj)
            .then( (results) => {
                isNumber(results);
            });
        });
    });
    describe('Delete Products for seller', () => {
        it('Should be a function', () => isFunction(deleteProduct, 'Function?'));
        it('Should be a function', () => isFunction(deletableProducts, 'Function?'));
        it('Should return 1', () => {
            return deleteProduct(2)
            .then( (result) => {
                equal(result, 1);
            });
        })
        it('Should not be able to retrieve deleted product', () => {
            return getSellerProduct(2, 6)
            .then( (result) => {
                notExists(result);
            });
        }) 
    })
    
})
