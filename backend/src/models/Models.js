const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['admin', 'user', 'driver'], required: true }
}, { timestamps: true });

const DriverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  idProof: { type: String, required: true }
}, { timestamps: true });

const BusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  route: {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    stops: [{ type: String, required: true }]
  },
  schedule: {
    time: { type: Date, required: true },
    availableSeats: { type: Number, required: true }
  },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required:true }
}, { timestamps: true });

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busId: { type: String, required: true }, 
  bookingDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  fare: { type: Number, required: true },
  paymentStatus: { type: Boolean, default: false },
  isUsed: { type: Boolean, default: false },
  
  passengers: [
    {
      passengerId: { type: String, required: true }, 
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, enum: ['Male', 'Female'], required: true }
    }
  ]
}, { timestamps: true });



const NotificationSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); 

module.exports = {
  User: mongoose.model('User', UserSchema),
  Driver: mongoose.model('Driver', DriverSchema),
  Bus: mongoose.model('Bus', BusSchema),
  Booking: mongoose.model('Booking', BookingSchema),
  Notification: mongoose.model('Notification', NotificationSchema)
};
