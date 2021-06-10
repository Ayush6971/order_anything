# order_anything

--

# Your New Text Editor - VS Code

[VS Code Install](https://code.visualstudio.com/docs/setup/setup-overview)

## Install VS Code Extensions

- dbaeumer.vscode-eslint
- esbenp.prettier-vscode
- waderyan.nodejs-extension-pack

## VS Code Settings

Navigate: File -> Preferences -> Settings
Set:

- "editor.formatOnSave": true, (recommended)
- "prettier.eslintIntegration": true,
- "eslint.autoFixOnSave": true (recommended)

---

# NodeVersion:14.15.4

# install dependencies

`npm install`

# Project Directory Structure

## ./

The index.js file initializes the Node Express app and sets up the routes folder to handle all further routing.

## /routes

All route handling to direct traffic to the correct controller

## /controllers

Handles all incoming requests and serves the resulting view and information. Data requests are sent to the Models directory and page layout are sent to the Views Folder

## /models

The models are driven by the sequelize node package. Each model represents either a table or a view in the kilobyte database. Models can be generated with the sequelize-auto node package. A few edits are needed after the code is generated:

- Field names to match data name.
- File and Model name to match table name.
- Timestamps set to false OR find fields to match createdAT and updatedAT fields.
- Make sure there is a primaryKey set.

## /middlewares

Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
in this project middleware is in r-index file.

# /config

## It have the database connection credentials.

--

# Admin Credentials

## phoneNo: 012345678

## password: admin123

--

# API's

## Auth

1.GET /signUp: to get the signUp page and parameters to signUp.
2.POST /signUp: to signUp using parameters phoneNo password confirmPassword roleID.
3.POST /login: to login with credential like phoneNo and password.
4.GET /signOut: to signOut at any point.

## Cart and Place Order

1.POST /cart/addToCart:to add item to cart (one item at a time) with parameters itemID and quantity.
2.GET /cart/getMyCart:to get all the items from customers cart.
3.POST /cart/placeOrder:to place order for all the items present in your cart
4.GET /getOrderById:to get the status of order for customer.
5.POST /cancelOrder:to cancel the order

## Delivery and assign delivery person

1.POST /delivery/assignDeliveryperson:to assign Delivery Person for "Task Created" order
2.GET /delivery/getOrderByFilter:to get order by 'filter' parameter and choose the value form this: [
"Task Created",
"Reached Store",
"Items Picked",
"Enroute",
"Delivered",
"Canceled",
],
3.POST /delivery/updateOrderStage:to update the status of the order by deliveryPerson with parameters orderID and orderstage from these values:[
"Task Created",
"Reached Store",
"Items Picked",
"Enroute",
"Delivered",
"Canceled",
],
4.GET /delivery/getOrdersAndDeliveryPersonList:to get list of all the orders and deliverypersons.

--
