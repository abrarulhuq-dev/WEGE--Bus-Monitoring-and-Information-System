const Notification = require("../models/Notification");

// Add a new notification
const addNotification = async (busId, driverId, message) => {
  try {
    const notification = await Notification.create({ busId, driverId, message });

    return { isSuccess: true, message: "Notification added successfully", notification };
  } catch (error) {
    return { isSuccess: false, message: "Failed to add notification", error: error.message };
  }
};

module.exports = { addNotification };
