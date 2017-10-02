'use strict';

// 3rd party libs
const {red, magenta, blue} = require("chalk");
const prompt = require('prompt');
const colors = require("colors/safe");
const path = require('path');
const { Database } = require('sqlite3').verbose();
prompt.message = colors.blue("Bangazon Corp");

// app modules
const { promptNewCustomer } = require('./controllers/customerCtrl');
const { postUserObj, getAllUsers } = require('./models/Customer');
const { getActiveCustomer, setActiveCustomer } = require('./activeCustomer');
const { addToCartStart, addToCart } = require('./controllers/orderCtrl');
const { newProductPrompt, deleteProdPrompt, displayDeletableProducts, deleteFromSeller } = require('./controllers/productCtrl')
const { postNewProduct, deletableProducts, deleteProduct } = require('./models/Product')

const db = new Database(path.join(__dirname, '..', 'db', 'bangazon.sqlite'));

let date = new Date;


prompt.start();

module.exports.displayWelcome = () => {
  let headerDivider = `${magenta('*********************************************************')}`
  console.log(`
  ${headerDivider}
  ${magenta('**  Welcome to Bangazon! Command Line Ordering System  **')}
  ${headerDivider}
  ${magenta('1.')} Create a customer account
  ${magenta('2.')} Choose active customer
  ${magenta('3.')} Leave Bangazon!`);
    prompt.get([{
      name: 'choice',
      description: 'Please make a selection'
    }], mainMenuHandler );
};

let mainMenuHandler = (err, userInput) => {
  // This could get messy quickly. Maybe a better way to parse the input?
  if(userInput.choice == '1') {
    promptNewCustomer() //in customerCtrl.js
    .then( (custData) => {
      custData.start_date = date;
      //save customer to db - cr
      postUserObj(custData) //in Customer.js
      .then( (result) => {
        console.log("This new customer was saved with the ID: ", result);
        module.exports.displayWelcome();
      })
      .catch( (err) => {
        console.log("errormagherd", err);
      }); 
      //-ladies
    });
  } else if (userInput.choice == '2'){
    activeCustomerPrompt()
    .then( (activeCustomer) => {
      //get active customer and set active customer
      setActiveCustomer(activeCustomer.customerId);
      console.log(`Customer ${activeCustomer.customerId} is now active.`);
      //run active customer function that opens the customerMenuHandler
      printAllCustomers();
    });
  } else if (userInput.choice == '3') {
    console.log("Thank you for visiting Bangazon.  Goodbye.")
    prompt.stop();
  }
};

let printAllCustomers = () => {
  let headerDivider = `${magenta('*********************************************************')}`
  console.log(`
  ${headerDivider}
  ${magenta(`**  Bangazon Customer Menu  **`)}
  ${headerDivider}
  ${magenta('1.')} Create a payment option
  ${magenta('2.')} Add product to shopping cart
  ${magenta('3.')} Complete an order
  ${magenta('4.')} Add a product to sell
  ${magenta('5.')} Update product information
  ${magenta('6.')} Delete product
  ${magenta('7.')} See product popularity
  ${magenta('8.')} Return to the main menu
  ${magenta('9.')} Leave Bangazon!`);
  prompt.get([{
    name: 'choice',
    description: 'Please make a selection'
  }], customerMenuHandler );
}

let customerMenuHandler = (err, userInput) => {
  console.log(`You are currently working with customer id ${getActiveCustomer().id}`);
  
  // This could get messy quickly. Maybe a better way to parse the input?
  if(userInput.choice == '1') {
    createPaymentPrompt()
    .then( (paymentData) => {
      console.log('payment data to save:', paymentData);
      //run post payment function and return to menu
    });   
  } else if (userInput.choice == '2') {
    addToCartStart()
    .then( (prodObjs) => {
      if(prodObjs.length === 0) {
        console.log("No Products Available")
        printAllCustomers()
      } else {
      displayProducts(prodObjs);
      addToCartPrompt()
      .then( (data) => {
        addToCart(data.Product, prodObjs, getActiveCustomer().id)
        .then( () => {
          printAllCustomers()
        });
      })
    }
    });
    } else if (userInput.choice == '3') {
      module.exports.displayOrder();
    } else if (userInput.choice == '4') {
    newProductPrompt()
    .then( (newProduct) => {
      newProduct.seller_id = Number(getActiveCustomer().id);
      postNewProduct(newProduct)
      .then ( (result) => {
        console.log("This new product was saved with the ID: ", result);
        printAllCustomers();
        //run function to post new product
      })
        .catch ( (err) => {
          console.log("new product error", err);
      });
    });

  } else if (userInput.choice == '5') {
    productPopPrompt()
    .then( (updatedProd) => {
      console.log(`
      ${magenta('1.')} Product Name
      ${magenta('2.')} Product Description
      ${magenta('3.')} Product Price
      ${magenta('4.')} Product Type Id
      ${magenta('5.')} Quantity Available
        ${magenta('6.')} Return to Customer Menu`)
        prompt.get([{
          name: 'choice',
          description: 'Please make a selection'
        }], productMenuHandler );
      // console.log('these changes have been made to the product:', updatedProd);
      //run function to update product information
    })
  } else if (userInput.choice == '6') {
    deletableProducts(Number(getActiveCustomer().id))
    .then( (prodObj) => {
      if(prodObj.length === 0) {
        console.log("no products available to delete");
        printAllCustomers();
      } else {
          displayDeletableProducts(prodObj);
          deleteProdPrompt()
          .then( (data) => {
            deleteFromSeller(data.productId, prodObj, getActiveCustomer().id)
               .then( () => {
                  printAllCustomers();
              })
          })
      }

    //   deleteProdPrompt()
    //   .then( (productObj) => {
    //     deleteProduct(productObj.productId)
    //     .then( (result) => {
    //      console.log('this product has been deleted'); 
    //      printAllCustomers();
    //     })
    //     .catch((err) => {
    //      console.log("delete product error", err)
    //     })
    //   //run function to get popularity of entered product
    // })
    })
  // }
    // .catch((err) => {
    //   console.log("deletable products error", err);
    // })
    
  } else if (userInput.choice == '7') {
    productPopPrompt()
    .then( (productPop) => {
      console.log('the popularity for', productPop, 'is:');
      //run function to get popularity of entered product
    })
  } else if (userInput.choice == '8') {
    module.exports.displayWelcome();
  } else if (userInput.choice == '9') {
    prompt.stop();
  }
};

let activeCustomerPrompt = () => {
  return new Promise( (resolve, reject) => {
    getAllUsers()//GET list of all customer names and ids using customer js model
    .then((allUsers)=>{
      allUsers.forEach((user) => {
        console.log(`${user.user_id}: ${user.Name}`)
      });
        prompt.get([{
          name: 'customerId',
          description: "Enter the customer's Id",
          type: 'string',
          required: true
        }], function(err, results) {
          if (err) return reject(err);
          resolve(results);
        })
      })
    })
  };
  
  let createPaymentPrompt = () => {
    return new Promise( (resolve, reject) => {
      prompt.get([{
        name: 'paymentName',
        description: "Enter the payment option name",
        type: 'string',
        required: true
      },
      {
        name: 'accountNum',
        description: "Enter the account number",
        type: 'number',
        required: true
      }], function(err, results) {
        if (err) return reject(err);
        resolve(results);
      })
  });
};

//DISPLAY PRODUCTS: takes any array of objects and displays them numberically (1, 2, 3...) -jmr
let displayProducts = (prodObjs) => {
  let headerDivider = `${magenta('*********************************************************')}`
  console.log(`
  ${headerDivider}
  ${magenta(`**  Bangazon Products  **`)}
  ${headerDivider}`);
  prodObjs.forEach( (prod, i) => {
      console.log(`${magenta(`${i + 1}. `)}${prod.Name}`)
  });
}

let addToCartPrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'Product',
      description: "Enter the product",
      type: 'number',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

module.exports.displayOrder = (total) => {
  console.log('Your order total is', total, 'Ready to purchase (Y/N)  **');
    prompt.get([{
      name: 'choice',
      description: 'Please make a selection'
    }], orderMenuHandler );
};

let orderMenuHandler = (err, userInput) => {
  console.log("user input", userInput);
  // This could get messy quickly. Maybe a better way to parse the input?
  if(userInput.choice == 'Y') {
      completeOrderPrompt()
    .then( (completeOrder) => {
      console.log('this order is completed:', completeOrder);
      //run post payment to order function
    });
  } else if (userInput.choice == 'N'){
    activeCustomerPrompt()
    .then( (activeCustomer) => {
      console.log('this customer is now active:', activeCustomer)
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '3') {
    prompt.stop();
  }
};

let completeOrderPrompt = () => {
  return new Promise( (resolve, reject) => {
    prompt.get([{
      name: 'paymentId',
      description: "Enter the payment Id",
      type: 'number',
      required: true
    }], function(err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  });
};

let productMenuHandler = (err, userInput) => {
  console.log("user input", userInput);
  // This could get messy quickly. Maybe a better way to parse the input?
  if(userInput.choice == '1') {
      productNamePrompt()
    .then( (productName) => {
      console.log('this product name has been updated:', productName);
      //run post payment to order function
    });
  } else if (userInput.choice == '2'){
    productDescPrompt()
    .then( (productDesc) => {
      console.log('this description has been updated:', productDesc)
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '3'){
    productPricePrompt()
    .then( (productPrice) => {
      console.log('this product price has been updated:', productPrice)
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '4'){
    productTypePrompt()
    .then( (productType) => {
      console.log('this product type has been updated:', productType)
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '5'){
    productQtyPrompt()
    .then( (productQty) => {
      console.log('this product quantity has been updated:', productQty)
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '6') {
    prompt.stop();
  }
};

let productNamePrompt = () => {
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

let productDescPrompt = () => {
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

let productPricePrompt = () => {
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

let productTypePrompt = () => {
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

let productQtyPrompt = () => {
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