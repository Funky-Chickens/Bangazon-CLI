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
const { getPayment, selectPayment, getPaymentTypes, completeOrderWithPayment, completeOrderPrompt, calcOrderTotal, PaymentAddToOrder } = require('./controllers/paymentCtrl')
const { newProductPrompt, deleteProdPrompt, showAllProducts, productUpdateMenu, selectProduct, productUpdate } = require('./controllers/productCtrl')
const { getAllUserProducts, getAllProducts, postNewProduct, deletableProducts, deleteProduct, getSellerProduct } = require('./models/Product')
const db = new Database(path.join(__dirname, '..', 'db', 'bangazon.sqlite'));

let date = new Date;


prompt.start();

module.exports.displayWelcome = () => {//first menu
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
  if(userInput.choice == '1') {
    promptNewCustomer() //in customerCtrl.js
    .then( (custData) => {
      custData.start_date = date;
      //save customer to db - cr
      postUserObj(custData) //in Customer.js
      .then( (result) => {
        console.log("This new customer was saved with the ID: ", result);
        module.exports.displayWelcome();//back to first menu
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

let printAllCustomers = () => {//main menu
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

let customerMenuHandler = (err, userInput) => {//handles main menu input
  if(userInput.choice == '1') {
    getPayment(Number(getActiveCustomer().id))
    .then( (paymentData) => {
      console.log('payment type Added!');
      printAllCustomers();
      //run post payment function and return to menu
    }).catch( (err) => {
      console.log("errormagherd", err);
    }); 

  } else if (userInput.choice == '2') {
    addToCartStart()//add product to shopping cart
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
    } else if (userInput.choice == '3') {//complete order
      module.exports.displayOrder();
    } else if (userInput.choice == '4') {//add product to sell
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

  } else if (userInput.choice == '5') {//update seller product information
    showAllProducts(getActiveCustomer().id)//from productCtrl, show all of active user's products
    .then( (prodObjs) => {//if user has products, display them, if not, display error and take back to handler
     if(prodObjs) {
      displayProducts(prodObjs);
      updateProductPrompt()//prompt user to choose what product to modify from a numbered list (doesn't necessarily correspond to id of product object)
      .then( (results) => {
        selectProduct(results.choice, prodObjs, getActiveCustomer().id)//use user input, the product object, and the active customer id to
        // select that product by matching its id rather than just using user input number(see controller)
        .then( (productObj) => {
          console.log(`You selected product ${productObj.product_id}, ${productObj.Name}`);
          console.log('Please choose what you would like to change:')
          productUpdateMenu(productObj)//see controller- this uses the product object to populate menu of choices of what property to change
          //on that object
          .then( (propertyToUpdate) =>{//propertyToUpdate = user input on what to change
            productMenuHandler(propertyToUpdate, productObj)//brings up productMenuHandler in this file that takes over from here
          });
        });
      });
    } else {
        printAllCustomers();
    }
  });
      //  console.log('these changes have been made to the product:', updatedProd);
      //run function to update product information
  } else if (userInput.choice == '6') {//delete a seller product
    deletableProducts(Number(getActiveCustomer().id))
    .then( (results) => {
      results.forEach( (item) => {
        console.log("Deletable products: ");
        console.log(item.product_id, item.product_name);
      })
      deleteProdPrompt()
      .then( (productObj) => {
        deleteProduct(productObj.productId)
        .then( (result) => {
         console.log('This product has been deleted.');
         printAllCustomers();
        })
        .catch((err) => {
         console.log("delete product error", err)
        })
      //run function to get popularity of entered product
    })
    })
    .catch((err) => {
      console.log("deletable products error", err);
    })
  } else if (userInput.choice == '7') {
    productPopPrompt()
    .then( (productPop) => {
      console.log('the popularity for', productPop, 'is:');
      //run function to get popularity of entered product
    })
  } else if (userInput.choice == '8') {
    module.exports.displayWelcome();
  } else if (userInput.choice == '9') {
    console.log('Thank you for visiting Bangazon.  Goodbye.')
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

//edited to call functions in correct order to get the calculated order total - el/cm
module.exports.displayOrder = () => {
  let uid = Number(getActiveCustomer().id);
  completeOrderWithPayment(uid)
  .then ( (results) => {
    if (results){

    let total = calcOrderTotal(results);
  console.log(`Your order total is $${total}.   Ready to purchase? (Y/N), 3 to exit  **`);
    prompt.get([{
      name: 'choice',
      description: 'Please make a selection'
    }], orderMenuHandler );
  } else {
    printAllCustomers();
  }
  });
};

let displayPayments = (paymentOpts) => {
  return new Promise ( (resolve, reject) => {
    let headerDivider = `${magenta('*********************************************************')}`
    console.log(`
    ${headerDivider}
    ${magenta(`**  Your Payment Options  **`)}
    ${headerDivider}`);
    paymentOpts.forEach( (paymentOpts, i) => {
        console.log(`${magenta(`${i + 1}. `)}${paymentOpts.payment_option_name}`)
    });
    resolve();
  })
}



let orderMenuHandler = (err, userInput) => {
  let paymentOptions = null;
  let uid = Number(getActiveCustomer().id)
  console.log("user input", userInput);
  // This could get messy quickly. Maybe a better way to parse the input?
  if(userInput.choice == 'Y') {
    //Before we can launch complete order prompt, we need to display all the user's payment options
    getPaymentTypes(uid) 
    .then( (paymentTypes) => {
      paymentOptions = paymentTypes
      return displayPayments(paymentTypes)
    })
    .then(() => {
      return completeOrderPrompt()
    })
    .then( (selection) => {
      return selectPayment(selection, paymentOptions, uid)
    })
    .then( (paymentIDtoAdd) => {
      return PaymentAddToOrder(paymentIDtoAdd, uid)
    })
    .then( (result) => {
      console.log("This order has been completed.");
      printAllCustomers()
    }); 
  } else if (userInput.choice == 'N') {
    activeCustomerPrompt()
    .then( (activeCustomer) => {
      console.log('This customer is now active:', activeCustomer)
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '3') {
    prompt.stop();
  }
};

let productMenuHandler = (userInput, prodObj) => {

  console.log("user input product menu", userInput, prodObj);
  if(userInput.choice == '1') {
    let prodName = "product_name";
    productNamePrompt() //prompts user to enter a new product name
    .then( (newProdName) => {
      //productUpdate takes args of column to change in the table, value to insert, product id, seller id and changes that one property on the db
      productUpdate(prodName, newProdName.productName, prodObj.product_id, prodObj.seller_id)
      .then( ()=>{
        console.log('This product name has been updated:', newProdName.productName);
        printAllCustomers();//return to main menu
      })
    });
  } else if (userInput.choice == '2'){
    let prodDesc = "description";
    productDescPrompt()
    .then( (newProdDescription) => {
      productUpdate(prodDesc, newProdDescription.productDesc, prodObj.product_id, prodObj.seller_id)
      .then( ()=>{
        console.log('This product description has been updated:', newProdDescription.productDesc);
        printAllCustomers();
      })
    });
  } else if (userInput.choice == '3'){
    let prodPrice = "price";
    productPricePrompt()
    .then( (newProductPrice) => {
      productUpdate(prodPrice, newProductPrice.productPrice, prodObj.product_id, prodObj.seller_id)
      console.log('This product price has been updated:', newProductPrice.productPrice)
      printAllCustomers();
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '4'){
    let prodType = "product_type_id";
    productTypePrompt()
    .then( (newProductType) => {
      productUpdate(prodType, newProductType.productType, prodObj.product_id, prodObj.seller_id)
      console.log('This product type has been updated:', newProductType.productType)
      printAllCustomers();
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '5'){
    let prodQty = "quantity_avail";
    productQtyPrompt()
    .then( (newProductQty) => {
      productUpdate(prodQty, newProductQty.productQty, prodObj.product_id, prodObj.seller_id)
      console.log('This product quantity has been updated:', newProductQty.productQty)
      printAllCustomers();
      //run active customer function that opens the customerMenuHandler
    });
  } else if (userInput.choice == '6') {
    printAllCustomers();
    // prompt.stop();//need to return to previous menu here instead of kicking us out
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
      console.log("results product name prompt", results);
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

let updateProductPrompt = () => {
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