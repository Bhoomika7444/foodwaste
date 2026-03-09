# 🌱 FoodBridge — Complete Setup Guide

## ⚡ Root Cause of "Registration Failed" Bug
The original project used **Express v5** (`^5.2.1`) which has breaking changes.
This version is fixed to **Express v4** (`^4.21.2`) — the stable LTS version.

---

## 🚀 Setup (Two Terminals)

### Terminal 1 — Backend
```bash
cd FoodWaste/Backend

# 1. Install dependencies (Express v4, Mongoose v8, etc.)
npm install

# 2. Seed 30 NGOs into MongoDB (run ONCE)
npm run seed

# 3. Start server
npm run dev
```
✅ Server → http://localhost:5000
✅ Test → http://localhost:5000/api/auth/ping  (should return `{"ok":true}`)

---

### Terminal 2 — Frontend
```bash
cd FoodWaste/Frontend/foodwaste-frontend
npm install
npm run dev
```
✅ App → http://localhost:5173

---

## 🔑 API Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| POST   | /api/auth/register   | Register new user                  |
| POST   | /api/auth/login      | Login                              |
| POST   | /api/food/donate     | Save food + return nearby NGOs ✨  |
| GET    | /api/food/all        | All food donations                 |
| GET    | /api/ngo/:city       | NGOs by city name                  |
| GET    | /api/ngo/all         | All NGOs                           |
| GET    | /api/auth/ping       | Route health check                 |

---

## 🏙️ Supported Cities (after seeding)
Bangalore · Mumbai · Delhi · Chennai · Hyderabad · Pune · Kolkata · Mysore · Mangalore

Any Bangalore suburb (Koramangala, Whitefield, BTM, Indiranagar, etc.)
is automatically matched to Bangalore NGOs.

---

## 🐛 Troubleshooting

| Error | Fix |
|-------|-----|
| "Registration failed" | Backend not running — start with `npm run dev` |
| 404 on /api/auth | You have Express v5 installed — run `npm install` again |
| No NGOs shown | Run `npm run seed` in the Backend folder |
| MongoDB error | Check MONGO_URI in .env |
