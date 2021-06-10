const router = require("express").Router();
const Delivery = require("../controller/DeliveryController");

router.post("/assignDeliveryperson", Delivery.assignDeliveryperson);
router.get("/getOrderByFilter", Delivery.getOrderByFilter);
router.post("/updateOrderStage", Delivery.updateOrderStage);
router.get(
  "/getOrdersAndDeliveryPersonList",
  Delivery.getOrdersAndDeliveryPersonList
);

module.exports = router;
