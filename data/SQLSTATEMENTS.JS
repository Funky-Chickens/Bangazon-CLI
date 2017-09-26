___________________________________________________________________________________________________________________________________
***** TASK 2 *****


//                  STATEMENT TO GET ALL USERS WITH THEIR ID'S 
//  SELECT user.user_id, users.first_name || ' ' || users.last_name AS "Name" FROM users

___________________________________________________________________________________________________________________________________
***** TASK 3 *****


//                  STATEMENT TO POST A NEW PAYMENT TYPE 
//  INSERT into paymentOptions VALUES (null, ${buyerId}, "VISA", "77788890")

___________________________________________________________________________________________________________________________________
***** TASK 4 *****


//                  STATEMENT TO POST NEW PROUDCT INFO 
//  INSERT INTO products VALUES (null, ${prodObj.type_id}, ${prodObj.seller_id},"${prodObj.product_name}", 
//  "${prodObj.description}", ${prodObj.quantity_avail}, ${prodObj.price

___________________________________________________________________________________________________________________________________
***** TASK 5 *****


//                  STATEMENT TO GET A CUSTOMER'S SPECIFIC PRODUCT  - returns user ID ad the name of their products
//  SELECT products.seller_id, products.product_name AS "Name" FROM users 
//  JOIN products where products.seller_id = users.user_id AND products.seller_id = 3



//                  STATEMENT TO CHECK IF USER HAS OPEN ORDER - IF RETURNED ARRAY HAS LENGTH > 0, 
//                    THEN ORDER IS OPEN, AND OBJECT WILL CONTAIN THE ORDER ID 
//  SELECT orders.order_id, orders.payment_type, orders.buyer_id FROM orders 
//  WHERE orders.buyer_id = ${userId} AND orders.payment_type IS NULL



//                  STATEMENT TO POST A PRODUCT TO A PRODUCTORDER. IF OPEN ORDER: 
//  INSERT INTO productOrders VALUES (${orderId}, ${productId}, NULL)



//                  STATEMENT TO POST A PRODUCT TO A PRODUCTORDER. IF NO ORDER EXISTS    
//  INSERT INTO orders VALUES (null,"${orderObj.order_date}", null, ${orderObj.buyer_id})     
//  INSERT INTO productOrders VALUES (${this.LastId}, ${productId}, NULL)           
//  **** This.LastID needs to be run in the call back with no fat arrow. ****

___________________________________________________________________________________________________________________________________
***** TASK 6 *****


//                  STATEMENT TO GET USERS PAYMENTS TO BE ADDED TO ORDER 
//  SELECT * from paymentOptions where paymentOptions.buyer_id = ${id}



//                  STATEMENT TO ADD USERS PAYMENT TO ORDER 
//  DELETE FROM paymentOptions WHERE paymentOptions.buyer__id = ${id}



//                  STATEMENT TO ADD PAYMENT TYPE TO ORDER TO COMPLETE IT
//  UPDATE orders set payment_type = ${selectedId} where buyer_id = ${id}

___________________________________________________________________________________________________________________________________
***** TASK 7 *****


//                  STATEMENT TO GET PRODUCTS THAT BELONG TO A USER THAT CAN BE DELETED A PRODUCT 
//  SELECT product_id, product_name FROM products as p WHERE NOT EXISTS 
//  (SELECT * FROM productOrders as po WHERE p.product_id = po.product_id) AND p.seller_id = ${id}       



//                  STATEMENT TO DELETE A PRODUCT 
//  DELETE FROM products WHERE product_id = ${id}




//                 STATEMT TO GET ALL PRODUCTS THAT BELONG TO A USER 
//  SELECT * FROM products WHERE seller_id = ${id}

___________________________________________________________________________________________________________________________________
***** TASK 8 *****



//                  STATEMENT TO GET EDITABLE PROPERTIES ON SELECTED PRODUCT 
//  SELECT product_name, description, quantity_avail, price FROM products WHERE seller_id = ${id}



//                  STATEMENT TO EDIT PROPERTIES ON A PRODUCT 
// UPDATE products set ${selectedCategoryVariable} = ${selectedCategoryKey} WHERE seller_id = ${sellerId}  AND product_id = ${productID}
// **** set the selectedCategoryVariable based on the users selection, and edit the selectedCategoryKey based on 
//      it's cooresponding key in the previously gotten object.****