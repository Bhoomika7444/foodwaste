const User = require("../models/User");

// Middleware: Check if user is superadmin
const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can access this" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/requests — Get pending admin requests
const getPendingRequests = async (req, res) => {
  try {
    const requests = await User.find({ role: "admin", status: "pending" })
      .select("name email role status createdAt");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/approve/:id — Approve admin request
const approveAdminRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { status: "approved", role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "Admin request approved", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/reject/:id — Reject admin request
const rejectAdminRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { status: "rejected", role: "user" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "Admin request rejected", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/dashboard — Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalDonations = await require("../models/Food").countDocuments();
    const totalServings = await require("../models/Food").aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    const uniqueDonors = await require("../models/Food").distinct("donorId");
    const uniqueLocations = await require("../models/Food").distinct("location");

    res.json({
      totalDonations,
      totalServings: totalServings[0]?.total || 0,
      uniqueDonors: uniqueDonors.filter(d => d).length,
      uniqueLocations: uniqueLocations.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  isSuperAdmin,
  getPendingRequests,
  approveAdminRequest,
  rejectAdminRequest,
  getDashboardStats
};
