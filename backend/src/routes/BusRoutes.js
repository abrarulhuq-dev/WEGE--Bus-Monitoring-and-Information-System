const express = require("express");
const router = express.Router();
const busController = require("../controllers/BusController");

// Add a new bus
router.post("/add", busController.addBus);

// Update an existing bus
router.put("/update/:busId", busController.updateBus);

// Delete a bus
router.delete("/delete/:busId", busController.deleteBus);

module.exports = router;
