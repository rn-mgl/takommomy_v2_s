const controller = require("../controllers/orders-controller");
const express = require("express");
const router = express.Router();

router.route("/").post(controller.createOrder).get(controller.getAllOrders);
router.route("/:order_id").get(controller.getOrder).patch(controller.cancelOrder);

module.exports = router;
