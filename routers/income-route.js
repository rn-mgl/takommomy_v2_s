const controller = require("../controllers/income-controller");
const express = require("express");
const router = express.Router();

router.route("/").get(controller.getIncome).patch(controller.updateIncome);

module.exports = router;
