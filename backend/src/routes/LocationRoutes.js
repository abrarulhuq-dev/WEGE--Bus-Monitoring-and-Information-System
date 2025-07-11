const express = require("express");
const router = express.Router();
const Location = require("../models/LocationSchema");
const socketUtils=require("../utils/socketUtils")

// Route to add/update locations
router.post("/add", async (req, res) => {
  try {
    const { locations } = req.body;

    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: "Locations array is required" });
    }

    // Ensure only one document exists; replace old with new
    await Location.deleteMany({}); // Remove the existing array
    const newLocation = new Location({ locations });
    await newLocation.save();

    res.status(201).json({ message: "Locations updated successfully", locations: newLocation });
  } catch (error) {
    console.error("Error saving locations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get stored locations
router.get("/", async (req, res) => {
  try {
    const savedLocations = await Location.findOne();
    if (!savedLocations) {
      return res.status(404).json({ message: "No locations found" });
    }
    res.json(savedLocations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Update location status when a driver reaches a stop
router.post("/update-status", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Location ID is required" });
    }

    // Find the stored locations
    const locationData = await Location.findOne({ "locations._id": id });

    if (!locationData) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Find the specific stop
    const stopIndex = locationData.locations.findIndex((loc) => loc._id.toString() === id);
    
    if (stopIndex === -1) {
      return res.status(404).json({ message: "Stop not found in location data" });
    }

    // Update the stop status
    locationData.locations[stopIndex].status = "reached";

    await locationData.save();

    // Prepare the cleaned stop object for WebSocket update
    const updatedStop = {
      _id: locationData.locations[stopIndex]._id.toString(),
      latitude: locationData.locations[stopIndex].latitude,
      longitude: locationData.locations[stopIndex].longitude,
      status: locationData.locations[stopIndex].status,
    };

    console.log("✅ Updated stop object:", updatedStop);

    // Emit WebSocket update
    socketUtils.sendStopUpdateToUsers(updatedStop);

    res.status(200).json({
      message: "Location status updated successfully",
      updatedStop,
    });

  } catch (error) {
    console.error("❌ Error updating location status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
