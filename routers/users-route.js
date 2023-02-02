const controller = require("../controllers/users-controller");
const express = require("express");
const router = express.Router();

router.route("/:user_id").get(controller.getUser).patch(controller.updateUser);

module.exports = router;
