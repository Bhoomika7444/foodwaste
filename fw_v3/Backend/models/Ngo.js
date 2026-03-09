const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String
  }
});

module.exports = mongoose.models.Ngo || mongoose.model("Ngo", ngoSchema);