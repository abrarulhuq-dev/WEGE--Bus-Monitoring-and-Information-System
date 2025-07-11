const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/NotificationController");

// Route for accident notification
router.post("/accident", notificationController.sendAccidentNotification);

module.exports = router;
