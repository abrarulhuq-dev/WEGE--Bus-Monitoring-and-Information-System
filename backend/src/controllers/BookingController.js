const bookingServices = require("../services/BookingServices");

// 🚀 Get tickets for a user
const getTicket = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await bookingServices.getUserTickets(userId);

        if (!result.isSuccess) {
            return res.status(401).json({ message: result.message, error: result.error });
        }

        res.status(200).json({ tickets: result.tickets });
    } catch (error) {
        next(error);
    }
};

// 🚀 Save a new ticket
const saveTicket = async (req, res, next) => {
    try {
        let { userId, busId, fare, bookingDate, passengers } = req.body;

        console.log("📥 Incoming Booking Data:", req.body);

        // 🛑 Validate Required Fields
        if (!userId || !busId || !fare || !bookingDate || !passengers || passengers.length === 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 🔥 Call Booking Service to Save
        const result = await bookingServices.saveTicket(userId, busId, fare, bookingDate, passengers);

        if (!result.isSuccess) {
            return res.status(500).json({ message: "Failed to save in DB", error: result.error });
        }

        res.status(201).json({ 
            message: "Ticket booked successfully", 
            ticketId: result.ticketId, 
            qrCode: result.qrCode 
        });

    } catch (error) {
        console.error("❌ Booking API Error:", error);
        next(error);
    }
};

// 🚀 Verify Ticket (QR Code Scanning)
const verifyTicket = async (req, res, next) => {
    try {
        const { scannedQRCode } = req.body;

        if (!scannedQRCode) {
            return res.status(400).json({ message: "QR Code is required" });
        }

        // 🔥 Call Booking Service to verify ticket
        const result = await bookingServices.verifyTicket(scannedQRCode);

        if (!result.isSuccess) {
            return res.status(400).json({ message: result.message });
        }

        res.status(200).json({ message: "✅ Ticket verified successfully!", ticket: result.ticket });
    } catch (error) {
        console.error("❌ Ticket Verification Error:", error);
        res.status(500).json({ message: "Failed to verify ticket", error: error.message });
    }
};

module.exports = { getTicket, saveTicket, verifyTicket };
