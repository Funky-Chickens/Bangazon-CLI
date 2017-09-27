# Bangazon Ordering System Interface

This ordering system allows a buyer to create an account, add payment options, add or remove products in a shopping cart, and complete an order.  Sellers can create an account, add products to sell, and update product information.

## Getting Started

These instructions will get the Bangazon Ordering System up and running on your local machine.

### Prerequisites
Clone this repository to your local machine with ```git clone git@github.com:Funky-Chickens/Bangazon-CLI.git```.
Download node.js and npm, then install the following packages from the package.json by running ```npm install``` :

### Dependencies
- chalk: version 1.1.3
- prompt: version 1.0.0
- sqlite3: version 3.1.8

### Developer Dependencies
- chai: version 4.1.2
- chai-as-promised: version 7.1.1
- mocha: version 3.5.3

### Starting the System
Build the database with ```npm run db:reset```.
Run ```npm start``` on the command line.  The main menu will appear as shown below:

### Main Menu
```bash
*********************************************************
**  Welcome to Bangazon! Command Line Ordering System  **
*********************************************************
1. Create a customer account
2. Choose active customer
3. Create a payment option
4. Add product to sell
5. Add product to shopping cart
6. Complete an order
7. Remove customer product
8. Update product information
9. Show stale products
10. Show customer revenue report
11. Show overall product popularity
12. Leave Bangazon!
>
```
### Create a Customer Account Menu (#1)
Buyers and sellers will be able to access this prompt to enter their account information by pressing 1:
```
Enter customer name
>

Enter street address
>

Enter city
>

Enter state
>

Enter postal code
>

Enter phone number
>
```

### Choose Active Customer Menu (#2)
Buyers and sellers will be able to access the following prompt to choose the active customer by pressing 2:
```
Which customer will be active?
1. John Q. Public
2. Svetlana Z. Herevazena
>
```

### Create a Payment Option Menu (#3)
Buyers will be able to access the following prompt to add a payment option by pressing 3:
```
Enter payment type (e.g. AmEx, Visa, Checking)
>

Enter account number
>
```

### Add Product to Sell Menu (#4)
Sellers will be able to access the following prompt to add a product to sell by pressing 4:



### Add Product to Shopping Cart Menu (#5)
Buyers will be able to access the following prompt to add a product to their shopping cart by pressing 5:
```
1. Diapers
2. Case of Cracking Cola
3. Bicycle
4. AA Batteries
...
9. Done adding products
```
### Complete an Order Menu (#6)
Buyers will be able to access the following prompt to complete an order by pressing 6:

If no products have been selected yet:
```
Please add some products to your order first. Press any key to return to main menu.
```
If there are current products in an order:
```
Your order total is $149.54. Ready to purchase
(Y/N) >
```
If user entered Y:
```
Choose a payment option
1. Amex
2. Visa
>
```

### Remove Customer Product Menu (#7)
Sellers will be able to access the following prompt to delete a product by pressing 7:
```
Choose product to delete:
1. Kite
2. Marbles
3. Refrigerator
>
```

### Update Product Information Menu (#8)
Sellers will be able to access the following prompt to update the information for a product by pressing 8:
```
Select a product to update:
1. Kite
2. Marbles
3. Refrigerator
>
```
ex. If the user chooses option 3, another menu will appear with options for properties to change:

```
1. Change title "Refrigerator"
2. Change description "It keeps things cold"
3. Change price "149.99"
4. Change quantity "1"
>
```
If the user chooses option 3:
```
Enter new price:
>
```


