const express = require("express");
const router  = express.Router();
const { getNgoByLocation, getAllNgos } = require("../controllers/ngoController");

router.get("/all",       getAllNgos);          // must be BEFORE /:location
router.get("/:location", getNgoByLocation);

module.exports = router;
