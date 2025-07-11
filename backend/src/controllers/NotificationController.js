const Location = require("../models/LocationSchema");
const { sendIncidentMessage } = require("../utils/socketUtils");

const sendAccidentNotification = async (req, res) => {
  try {
    const { message } = req.body;
    console.log(message ,"is");
    
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Update the single location document to mark an accident
    const location = await Location.findOne(
      {},
      { isAccident: true },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({ error: "Location document not found." });
    }

    // Notify users and admins
    sendIncidentMessage(message,);

    return res.status(200).json({ message: "Accident reported successfully", location });
  } catch (error) {
    console.error("Error reporting accident:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports={sendAccidentNotification}