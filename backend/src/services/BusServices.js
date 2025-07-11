const { Bus } = require("../models/Models");

// Add a new bus
const addBus = async (busData) => {
  try {
    const newBus = await Bus.create(busData);
    return { isSuccess: true, message: "Bus added successfully", bus: newBus };
  } catch (error) {
    return { isSuccess: false, message: "Failed to add bus", error: error.message };
  }
};

// Update bus details
const updateBus = async (busId, updateData) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(busId, updateData, { new: true });

    if (!updatedBus) {
      return { isSuccess: false, message: "Bus not found" };
    }

    return { isSuccess: true, message: "Bus updated successfully", bus: updatedBus };
  } catch (error) {
    return { isSuccess: false, message: "Failed to update bus", error: error.message };
  }
};

// Delete a bus
const deleteBus = async (busId) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(busId);

    if (!deletedBus) {
      return { isSuccess: false, message: "Bus not found" };
    }

    return { isSuccess: true, message: "Bus deleted successfully" };
  } catch (error) {
    return { isSuccess: false, message: "Failed to delete bus", error: error.message };
  }
};

module.exports = { addBus, updateBus, deleteBus };
