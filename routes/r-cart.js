const router = require("express").Router();
const Cart = require("../controller/CustomerController");

router.post("/addToCart", Cart.addToCart);
router.get("/getMyCart", Cart.getMyCart);
router.post("/placeOrder", Cart.placeOrder);
router.get("/getOrderById", Cart.getOrderById);
router.post("/cancelOrder", Cart.cancelOrder);

module.exports = router;
