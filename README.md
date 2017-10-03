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
- dotenv: version 4.0.0

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

```
#### Create a Customer Account Menu (#1)
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
When all of the information is entered, the user will get a confirmation message saying "This new customer was saved with the ID of [userId]."  The database will automatically assign a userId.

#### Choose Active Customer Menu (#2)
Buyers and sellers will be able to access the following prompt to choose the active customer by pressing 2:
```
Which customer will be active?
1. John Q. Public
2. Svetlana Z. Herevazena
>
```
A success message will appear on press of Enter saying "Customer [userId] is now active."

### Customer Menu
Once the user has either entered their information and/or selected an active user, the following menu will appear:
```
 *********************************************************
  **  Bangazon Customer Menu  **
  *********************************************************
1. Create a payment option
2. Add product to shopping cart
3. Complete an order
4. Add a product to sell
5. Update product information
6. Delete Product
7. Return to the Main Menu
8. Leave Bangazon!
>
```
#### Create a Payment Option Menu (#1)
Buyers will be able to access the following prompt to add a payment option by pressing 1:
```
Enter payment type (e.g. AmEx, Visa, Checking)
>

Enter account number
>
```
A success message will appear when the user's payment information is saved.

#### Add Product to Shopping Cart Menu (#2)
Buyers will be able to access the following prompt to add a product to their shopping cart by pressing 2:
```
1. Diapers
2. Case of Cracking Cola
3. Bicycle
4. AA Batteries
...
9. Done adding products
```
If the user has no open orders, a new cart will be started with the success message "New Order Started With the Selected Product."

If the user has an open order, each product will be added to the cart with the success message "Product Added To Cart."

Each time a new item is added to the cart, the customer menu will continue to pop up until the user takes a different action or ends the session.

#### Complete an Order Menu (#3)
Buyers will be able to access the following prompt to complete an order by pressing 3:

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
#### Add Product to Sell Menu (#4)
Sellers will be able to access the following prompt to add a product to sell by pressing 4:

```
Enter the product name:

Enter the product's price:

Enter the product description:

Enter the product type id:

Enter the quantity available:

```
A success message of "This new product was saved with the ID: [productId] will appear when the information is entered and saved.


#### Update Product Information Menu (#5)
Sellers will be able to access the following prompt to update the information for a product by pressing 5:
```
Select a product to update:(All the seller's products)
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
#### Delete Product Menu (#6)
Sellers will be able to access the following prompt to delete a product from their offerings by pressing 6:
```
Choose product to delete:
1. Kite
2. Marbles
3. Refrigerator
>
```

Success message: "This product has been successfully deleted."

#### Return to the Main Menu(#7)
This will return the user to the choices to enter a new user's information or choose active user.

#### Leave Bangazon(#8)
This ends the session and exits the Bangazon Ordering System with a thank you message.

