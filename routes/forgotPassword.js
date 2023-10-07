const express = require("express");
const router = express.Router();
const forgetController = require("../controllers/forgotPasswordController");

router.post("/", forgetController.handleTwilioForget);
router.post("/reset", forgetController.handleResetPassword);

module.exports = router;
