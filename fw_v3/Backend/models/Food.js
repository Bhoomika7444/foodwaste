const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["Veg", "Non-Veg"]
  },
  location: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Food", foodSchema);