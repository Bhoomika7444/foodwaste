const express  = require("express");
const router   = express.Router();
const { register, login, requestAdminAccess } = require("../controllers/authController");

router.post("/register", register);
router.post("/login",    login);
router.post("/request-admin", requestAdminAccess);

// Test route to confirm auth router is mounted
router.get("/ping", (req, res) => res.json({ ok: true, route: "auth" }));

module.exports = router;
