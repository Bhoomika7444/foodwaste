const Ngo = require("../models/Ngo");

// GET /api/ngo/:location
const getNgoByLocation = async (req, res) => {
  try {
    const location = req.params.location;
    const ngos = await Ngo.find({
      location: { $regex: location, $options: "i" }
    }).limit(10);
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/ngo/all
const getAllNgos = async (req, res) => {
  try {
    const ngos = await Ngo.find().sort({ location: 1 });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNgoByLocation, getAllNgos };
