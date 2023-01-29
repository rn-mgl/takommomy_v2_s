const controller = require("../controllers/auth-controller");
const express = require("express");
const router = express.Router();

router.route("/reg").post(controller.registerUser);
router.route("/log").post(controller.loginUser);
router.route("/ver/:token").patch(controller.verifyUser);

module.exports = router;
