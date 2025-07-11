const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  locations: [
    {
      name:{type:String,required:true},
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      status: { type: String, default: "pending" } 
    }
  ],
  isAccident: { type: Boolean, default: false } 
});

module.exports = mongoose.model("Location", LocationSchema);
