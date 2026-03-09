const Food = require("../models/Food");
const Ngo  = require("../models/Ngo");

// Enhanced city mapping with more variations
const CITY_MAP = {
  bangalore: "Bangalore", bengaluru: "Bangalore",
  indiranagar: "Bangalore", whitefield: "Bangalore",
  koramangala: "Bangalore", btm: "Bangalore",
  jayanagar: "Bangalore", yelahanka: "Bangalore",
  malleshwaram: "Bangalore", rajajinagar: "Bangalore",
  "electronic city": "Bangalore", marathahalli: "Bangalore",
  hebbal: "Bangalore", banashankari: "Bangalore",
  yelachenahalli: "Bangalore", kengeri: "Bangalore",
  "kumaraswamy layout": "Bangalore", basavanagudi: "Bangalore",
  "sanjay nagar": "Bangalore", vijayanagar: "Bangalore",
  "hosur road": "Bangalore", "bannerghatta road": "Bangalore",
  tataguni: "Bangalore", "kudlu gate": "Bangalore",
  attibele: "Bangalore", hennur: "Bangalore",
  "rajarajeshwari nagar": "Bangalore", dasarahalli: "Bangalore",
  kumbalgodu: "Bangalore", nagarbhavi: "Bangalore",
  varthur: "Bangalore", hoodi: "Bangalore",
  doddakallasandra: "Bangalore", chikkabanavara: "Bangalore",
  mumbai: "Mumbai", bandra: "Mumbai", andheri: "Mumbai",
  delhi: "Delhi", "new delhi": "Delhi",
  chennai: "Chennai", hyderabad: "Hyderabad",
  pune: "Pune", kolkata: "Kolkata",
};

function resolveCity(raw) {
  if (!raw) return "";
  const key  = raw.trim().toLowerCase();
  const key2 = key.split(/[\s,]+/)[0];
  return CITY_MAP[key] || CITY_MAP[key2] || raw.trim();
}

// POST /api/food/donate — save food + return nearby NGOs
const donateFood = async (req, res) => {
  try {
    const { foodName, quantity, type, location, donorId } = req.body;

    if (!foodName || !quantity || !location) {
      return res.status(400).json({ message: "foodName, quantity and location are required" });
    }

    // Save food with donor reference (use ObjectId)
    const food = new Food({ 
      foodName, 
      quantity, 
      type, 
      location,
      donorId: donorId || null
    });
    await food.save();

    // Populate donor info
    const populatedFood = await food.populate("donorId", "name email");

    // Resolve city and fetch NGOs
    const city = resolveCity(location);
    let ngos = [];
    
    try {
      ngos = await Ngo.find({
        location: { $regex: city, $options: "i" },
      }).limit(10);
    } catch (ngoError) {
      ngos = [];
    }

    res.status(201).json({ 
      success: true,
      food: populatedFood, 
      ngos, 
      city,
      message: "Food donation recorded successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error recording donation" });
  }
};

// POST /api/food/addFood — legacy endpoint
const addFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    const populatedFood = await food.populate("donorId", "name email");
    res.status(201).json({ success: true, food: populatedFood });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/food/all — Get all donations with donor names
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("donorId", "name email")
      .sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { donateFood, addFood, getFoods };
