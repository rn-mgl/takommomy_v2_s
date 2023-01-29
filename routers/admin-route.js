const controller = require("../controllers/admin-controller");
const express = require("express");
const router = express.Router();

router.route("/rcvd_orders").get(controller.getAllOrders);
router
  .route("/updt/:order_id")
  .patch(controller.orderResponse)
  .delete(controller.cancellationResponse);

module.exports = router;
