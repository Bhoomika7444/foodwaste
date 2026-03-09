const User = require("../models/User");

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: "Email already registered. Please sign in." });
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // plain text — fine for this project; use bcrypt in production
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/request-admin — User requests admin access
const requestAdminAccess = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "admin", status: "pending" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Admin access request sent. Waiting for approval from superadmin.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, requestAdminAccess };
