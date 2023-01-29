const controller = require("../controllers/messages-controller");
const express = require("express");
const router = express.Router();

router.route("/").get(controller.getAllMessages).post(controller.sendMessage);
router.route("/:message_id").get(controller.getMessages);

module.exports = router;
