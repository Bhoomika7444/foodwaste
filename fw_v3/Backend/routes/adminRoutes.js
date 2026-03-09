const express = require("express");
const router = express.Router();
const {
  isSuperAdmin,
  getPendingRequests,
  approveAdminRequest,
  rejectAdminRequest,
  getDashboardStats
} = require("../controllers/adminController");

// Middleware to verify JWT/user (create simple userId from session)
const authenticateUser = (req, res, next) => {
  // For now, userId comes from frontend localStorage
  // In production, use JWT verification
  req.userId = req.headers["user-id"];
  next();
};

// GET /api/admin/requests — Get all pending admin requests (superadmin only)
router.get("/requests", authenticateUser, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.userId);
    if (!user || user.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can access this" });
    }
    const requests = await User.find({ role: "admin", status: "pending" }).select("_id name email status createdAt");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/approve/:id — Approve admin request (superadmin only)
router.post("/approve/:id", authenticateUser, async (req, res) => {
  try {
    const User = require("../models/User");
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can approve admin requests" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
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
});

// POST /api/admin/reject/:id — Reject admin request (superadmin only)
router.post("/reject/:id", authenticateUser, async (req, res) => {
  try {
    const User = require("../models/User");
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can reject admin requests" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
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
});

// GET /api/admin/dashboard — Get dashboard statistics
router.get("/dashboard", async (req, res) => {
  try {
    const Food = require("../models/Food");
    const totalDonations = await Food.countDocuments();
    const totalServingsAgg = await Food.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    const uniqueDonors = await Food.distinct("donorId");
    const uniqueLocations = await Food.distinct("location");

    res.json({
      totalDonations,
      totalServings: totalServingsAgg[0]?.total || 0,
      uniqueDonors: uniqueDonors.filter(d => d).length,
      uniqueLocations: uniqueLocations.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
