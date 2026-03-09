/**
 * seed.js — Run once to populate NGOs in MongoDB
 * Usage:  node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Ngo      = require("./models/Ngo");

const ngos = [
  // ── Bangalore ──────────────────────────────────────────
  { name: "Helping Hands NGO",        location: "Bangalore", phone: "9876543210", type: "NGO" },
  { name: "Hope Orphanage",           location: "Bangalore", phone: "9123456789", type: "Orphanage" },
  { name: "Annadaata Foundation",     location: "Bangalore", phone: "9845123456", type: "NGO" },
  { name: "Seva Bharathi Bangalore",  location: "Bangalore", phone: "9741256300", type: "NGO" },
  { name: "Akshaya Patra Foundation", location: "Bangalore", phone: "8022941008", type: "NGO" },
  { name: "Robin Hood Army BLR",      location: "Bangalore", phone: "9900123456", type: "Volunteer Group" },
  { name: "Smile Foundation BLR",     location: "Bangalore", phone: "9743001122", type: "NGO" },

  // ── Mumbai ─────────────────────────────────────────────
  { name: "Roti Bank Mumbai",         location: "Mumbai",    phone: "9820001234", type: "Food Bank" },
  { name: "Robin Hood Army Mumbai",   location: "Mumbai",    phone: "9833445566", type: "Volunteer Group" },
  { name: "Seva Meals Mumbai",        location: "Mumbai",    phone: "9821334455", type: "NGO" },
  { name: "Ummeed Child Dev Centre",  location: "Mumbai",    phone: "9967556677", type: "NGO" },

  // ── Delhi ──────────────────────────────────────────────
  { name: "Feeding India Delhi",      location: "Delhi",     phone: "9810001122", type: "NGO" },
  { name: "No Food Waste Delhi",      location: "Delhi",     phone: "9711223344", type: "Volunteer Group" },
  { name: "Goonj Delhi",              location: "Delhi",     phone: "9810334455", type: "NGO" },
  { name: "Helpage India HQ",         location: "Delhi",     phone: "9312456789", type: "NGO" },

  // ── Chennai ────────────────────────────────────────────
  { name: "Exnora International",     location: "Chennai",   phone: "9444123456", type: "NGO" },
  { name: "No Food Waste Chennai",    location: "Chennai",   phone: "9500112233", type: "Volunteer Group" },
  { name: "Akshaya Trust Chennai",    location: "Chennai",   phone: "9840556677", type: "NGO" },

  // ── Hyderabad ──────────────────────────────────────────
  { name: "Hyderabad Food Bank",      location: "Hyderabad", phone: "9848001234", type: "Food Bank" },
  { name: "Robin Hood Army HYD",      location: "Hyderabad", phone: "9912334455", type: "Volunteer Group" },
  { name: "Amala Cancer Hospital NGO",location: "Hyderabad", phone: "9866123456", type: "NGO" },

  // ── Pune ───────────────────────────────────────────────
  { name: "Pune Food Bank",           location: "Pune",      phone: "9822001234", type: "Food Bank" },
  { name: "Seva Sahayog Pune",        location: "Pune",      phone: "9766112233", type: "NGO" },
  { name: "Magic Bus Pune",           location: "Pune",      phone: "9823334455", type: "NGO" },

  // ── Kolkata ────────────────────────────────────────────
  { name: "Bhookha Haath Kolkata",    location: "Kolkata",   phone: "9831001234", type: "Volunteer Group" },
  { name: "Missionaries of Charity",  location: "Kolkata",   phone: "9330112233", type: "NGO" },

  // ── Mysore ─────────────────────────────────────────────
  { name: "Arogya Sahaya Mysore",     location: "Mysore",    phone: "9880001234", type: "NGO" },
  { name: "Vidyartha Sahaya Mysore",  location: "Mysore",    phone: "9743445566", type: "NGO" },

  // ── Mangalore ──────────────────────────────────────────
  { name: "Sneha Charitable Trust",   location: "Mangalore", phone: "9448001234", type: "NGO" },
  { name: "Sanjeevini Care Mangalore",location: "Mangalore", phone: "9980223344", type: "NGO" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const deleted = await Ngo.deleteMany({});
    console.log(`🗑  Cleared ${deleted.deletedCount} existing NGOs`);

    const inserted = await Ngo.insertMany(ngos);
    console.log(`🌱 Inserted ${inserted.length} NGOs`);

    await mongoose.disconnect();
    console.log("✅ Done — MongoDB disconnected");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
