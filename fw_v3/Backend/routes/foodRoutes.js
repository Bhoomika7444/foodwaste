const express = require("express");
const router  = express.Router();
const { donateFood, addFood, getFoods } = require("../controllers/foodController");

router.get("/all",       getFoods);    // GET before POST, specific before param
router.post("/donate",   donateFood);  // NEW — save food + return NGOs
router.post("/addFood",  addFood);     // legacy

module.exports = router;
