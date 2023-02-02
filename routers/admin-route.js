const controller = require("../controllers/admin-controller");
const express = require("express");
const router = express.Router();

router.route("/rcvd_orders").get(controller.getAllOrders);
router.route("/users").get(controller.getAllUsers);
router.route("/users/:user_id").get(controller.getUser).patch(controller.updateReputation);
router.route("/messages/:user_id").get(controller.getAllMessages);
router
  .route("/rcvd_orders/:order_id")
  .get(controller.getOrder)
  .patch(controller.orderResponse)
  .delete(controller.cancellationResponse);

module.exports = router;
