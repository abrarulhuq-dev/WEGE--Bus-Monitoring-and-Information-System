const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/BookingController");

// Get user tickets
router.get("/:userId", bookingController.getTicket);

// Book a ticket
router.post("/book", bookingController.saveTicket);

// Verify ticket via QR Code
router.post("/verify", bookingController.verifyTicket);

module.exports = router;
