const busServices = require("../services/BusServices");

// Add a new bus
const addBus = async (req, res, next) => {
  try {
    const { name, route, schedule, driverId } = req.body;

    if (!name || !route || !route.source || !route.destination || !schedule || !driverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await busServices.addBus(req.body);

    if (!result.isSuccess) {
      return res.status(500).json({ message: result.message, error: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Update bus
const updateBus = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const updateData = req.body;

    if (!busId) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    const result = await busServices.updateBus(busId, updateData);

    if (!result.isSuccess) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Delete bus
const deleteBus = async (req, res, next) => {
  try {
    const { busId } = req.params;

    if (!busId) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    const result = await busServices.deleteBus(busId);

    if (!result.isSuccess) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { addBus, updateBus, deleteBus };
