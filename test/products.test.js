'use strict';

const { assert: {equal, deepEqual, isFunction, isObject, isArray, isNumber, notExists} } = require('chai');
const { getAllUserProducts, getAllProducts, postNewProduct, deletableProducts, deleteProduct, getSellerProduct, UpdateProduct } = require('../app/models/Product.js');
const { productUpdate } = require('../app/controllers/productCtrl');
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
    describe('Gets All Products', () => {
        it('should be a function', () => isFunction(getAllProducts, 'Function?'));
        it('should return an array', () => {
            return getAllProducts(3)
            .then( (prods) => {
                isArray(prods);
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
        });
        it('Should not be able to retrieve deleted product', () => {
            return getSellerProduct(2, 6)
            .then( (result) => {
                notExists(result);
            });
        });
    });
    describe('Update Products for seller', () => {
        let value = "random string";
        let tableString = "description"
        it('should be a function', () => isFunction(productUpdate, 'Function?'));
        it('it should return product obj', () => {
            return productUpdate(tableString, value, 1, 1)
            .then( (results) => {
                return getSellerProduct(1,1)
                .then( (sellerprod) =>{
                    equal(sellerprod.description, value);
                })
            });
        });
    });
});
