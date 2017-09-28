const { assert: {property, eventually, equal, isNumber, exists, isFunction, isArray, isObject, isEqual, deepEqual} } = require('chai');
const { postProdOrder, getProdOrder } = require('../app/models/ProductOrder.js');
const { buildProductOrdersDB } = require('../db/build-db.js');

describe('Product Orders', () => {
    before( function(done) {
        buildProductOrdersDB()
        .then( () => done()); 
    });
    describe('Get Product Order', () => {
        it('should be a function', () => isFunction(getProdOrder, 'Function?'));
        it('should be an object', () => {
            return getProdOrder(1)
            .then( (prodOrder) => {
                isObject(prodOrder);
            });
        });
        it('should get a product order', () => {
            return getProdOrder(1)
            .then( (prodOrder) => property(prodOrder, 'line_item_id'));
        });
    });
    describe('Post Product Order', () => {
        it('should be a function', () => isFunction(postProdOrder, 'Function?'));
        it('should have the product that was posted', () => {
            return postProdOrder(1, 5)
            .then( (data) => {
                return getProdOrder(data)
                .then( (order) => {
                    equal(order.line_item_id, data)
                });
            });
        });
    })
})