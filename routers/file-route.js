const controller = require("../controllers/file-controller");
const express = require("express");
const router = express.Router();

router.route("/").post(controller.sendFile);

module.exports = router;
