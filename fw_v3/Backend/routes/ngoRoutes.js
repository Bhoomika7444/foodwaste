const express = require("express");
const router  = express.Router();
const { getNgoByLocation, getAllNgos } = require("../controllers/ngoController");

// CRITICAL: Must define /all BEFORE /:location or "all" will match as a location
router.get("/all", getAllNgos);
router.get("/:location", getNgoByLocation);

module.exports = router;
