const controller = require("../controllers/deliveries-controller");
const express = require("express");
const router = express.Router();

router.route("/").get(controller.getAllDelivery);
router
  .route("/:order_id")
  .get(controller.getDelivery)
  .patch(controller.updateDelivery)
  .delete(controller.removeDelivery);

module.exports = router;
