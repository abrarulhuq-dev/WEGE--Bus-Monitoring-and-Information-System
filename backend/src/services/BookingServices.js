const { Booking } = require("../models/Models");
const { v4: uuidv4 } = require("uuid");
const qrcode = require("qrcode");

// 🚀 Get tickets for a user
const getUserTickets = async (userId) => {
    try {
        const tickets = await Booking.find({ userId });
        return { isSuccess: true, tickets };
    } catch (err) {
        return { isSuccess: false, message: "Failed to retrieve tickets", error: err.message };
    }
};

// 🚀 Save a new ticket (Handles `fare`, assigns `passengerId`, generates QR Code)
const saveTicket = async (userId, busId, fare, bookingDate, passengers) => {
    try {
        console.log("📥 Incoming Booking Data:", { userId, busId, fare, bookingDate, passengers });

        // ✅ Ensure `fare` is a number
        if (typeof fare === "string") {
            fare = parseFloat(fare.replace(/[^0-9.]/g, "")); // Convert "100 Rs" → 100
        }

        if (isNaN(fare) || fare <= 0) {
            return { isSuccess: false, message: "Invalid fare format" };
        }

        // ✅ Assign a unique ID to each passenger
        const updatedPassengers = passengers.map(passenger => ({
            ...passenger,
            passengerId: uuidv4(),
        }));

        // ✅ Save ticket
        const ticket = await Booking.create({
            userId,
            busId,
            fare,
            bookingDate,
            isUsed: false,
            passengers: updatedPassengers,
        });

        // ✅ Generate QR Code dynamically (contains only `ticketId`)
        const qrCode = await qrcode.toDataURL(ticket.id);

        return { isSuccess: true, message: "Booking successful", ticketId: ticket.id, qrCode };
    } catch (err) {
        console.error("❌ Booking Save Error:", err);
        return { isSuccess: false, message: "Failed to save in DB", error: err.message };
    }
};

// 🚀 Verify Ticket (Check QR Code & Mark as Used)
const verifyTicket = async (scannedQRCode) => {
    try {
        // ✅ Decode QR Code (Extract Ticket ID)
        const ticketId = scannedQRCode; // Since QR contains only `ticketId`

        // ✅ Find ticket by `ticketId`
        const ticket = await Booking.findById(ticketId);
        if (!ticket) {
            return { isSuccess: false, message: "Invalid ticket" };
        }

        if (ticket.isUsed) {
            return { isSuccess: false, message: "Ticket already used" };
        }

        // ✅ Mark ticket as used
        ticket.isUsed = true;
        await ticket.save();

        return { isSuccess: true, message: "✅ Ticket verified successfully!", ticket };
    } catch (err) {
        console.error("❌ Ticket Verification Error:", err);
        return { isSuccess: false, message: "Failed to verify ticket", error: err.message };
    }
};

module.exports = { saveTicket, getUserTickets, verifyTicket };
