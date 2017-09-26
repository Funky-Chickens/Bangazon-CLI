//                  STATEMENT TO GET ALL USERS WITH THEIR ID'S (TASK #2)
//  SELECT user.user_id, users.first_name || ' ' || users.last_name AS "Name" FROM users


//                  STATEMENT TO POST A NEW PAYMENT TYPE (TASK #3)
//  INSERT into paymentOptions VALUES (null, ${buyerId}, "VISA", "77788890")


//                  STATEMENT TO POST NEW PROUDCT INFO (TASK #4)
//  INSERT INTO products VALUES (null, ${prodObj.type_id}, ${prodObj.seller_id},"${prodObj.product_name}", 
//    "${prodObj.description}", ${prodObj.quantity_avail}, ${prodObj.price


//                  STATEMENT TO GET A CUSTOMER'S SPECIFIC PRODUCT (TASK #5) - returns user ID ad the name of their products
//  SELECT products.seller_id, products.product_name AS "Name" FROM users 
//  JOIN products where products.seller_id = users.user_id AND products.seller_id = 3


//                  STATEMENT TO CHECK IF USER HAS OPEN ORDER - IF RETURNED ARRAY HAS LENGTH > 0, 
//                    THEN ORDER IS OPEN, AND OBJECT WILL CONTAIN THE ORDER ID (TASK #5)
//  SELECT orders.order_id, orders.payment_type, orders.buyer_id FROM orders 
//  WHERE orders.buyer_id = ${userId} AND orders.payment_type IS NULL


//                  STATEMENT TO POST A PRODUCT TO A PRODUCTORDER. IF OPEN ORDER: (TASK #5)
//  INSERT INTO productOrders VALUES (${orderId}, ${productId}, NULL)


//                  STATEMENT TO POST A PRODUCT TO A PRODUCTORDER. IF NO ORDER EXISTS (TASK #5):   
//  INSERT INTO orders VALUES (null,"${orderObj.order_date}", null, ${orderObj.buyer_id})     
//  INSERT INTO productOrders VALUES (${this.LastId}, ${productId}, NULL)           
//  **** This.LastID needs to be run in the call back with no fat arrow. ****


//                  STATEMENT TO ADD PAYMENT TO ORDER ()