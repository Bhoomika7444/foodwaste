# 🌱 FoodBridge — Food Donation Platform

**Version:** 1.0.0 | **Status:** ✅ Demo Ready | **Last Updated:** March 2025

## 📋 Overview

FoodBridge is a comprehensive food donation platform that connects donors with NGOs. Users can donate surplus food and the system intelligently matches them with nearby NGOs based on location.

### Core Features
- ✅ User authentication (register/login)
- ✅ Food donation form with type classification
- ✅ Intelligent NGO recommendation by location
- ✅ Admin dashboard with full controls
- ✅ Super-admin approval system (Bhoomika only)
- ✅ Donations management & editing
- ✅ Interactive map view of NGOs
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Smooth animations & modern UI

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ 
- npm or yarn
- Git
- MongoDB Atlas account (already configured)

### Installation (2 Terminals)

**Terminal 1 - Backend:**
```bash
cd Backend
npm install
npm run dev
```
Runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd Frontend/foodwaste-frontend
npm install
npm run dev
```
Runs on: `http://localhost:5173`

### Verify Setup
- Backend health: `http://localhost:5000/api/auth/ping`
- Frontend: `http://localhost:5173`
- You should see login page

---

## 🔑 Default Test Credentials

### Super Admin (Bhoomika)
```
Email: bhoomika7444@gmail.com
Password: admin123  (or any password - first login automatically makes super-admin)
```

### Regular User (for testing)
```
Email: donate@test.com
Password: Test@1234 (any password)
```

---

## 📱 How It Works

### For Donors
1. **Sign Up:** Create account with name, email, password
2. **Login:** Access home page
3. **Donate:**
   - Enter food name (e.g., "Rice")
   - Enter servings/quantity
   - Select type (Veg/Non-Veg)
   - Enter location/area
   - Enter your name
4. **Match:** System shows 6 nearest NGOs
5. **Connect:** View NGO details and contact them directly

### For Admins
1. **Request Access:** Click "Request Admin" button
2. **Super Admin Approves:** Bhoomika approves in /admin panel
3. **Dashboard Access:** Now can see all donations
4. **Manage:**
   - View all donations in table
   - Edit donor information
   - Sort by quantity, date, type
   - Search donations

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 19 + Vite + CSS3
- **Backend:** Node.js + Express 4
- **Database:** MongoDB Atlas (Cloud)
- **Authentication:** localStorage (client-side sessions)
- **Styling:** Custom CSS with animations

### Project Structure
```
fw_v3/
├── Backend/
│   ├── server.js                 # Express server
│   ├── controllers/
│   │   ├── authController.js     # Register/Login
│   │   ├── foodController.js     # Food donations
│   │   └── ngoController.js      # NGO data
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── Ngo.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   └── ngoRoutes.js
│   ├── package.json
│   ├── .env                      # Configuration
│   └── vercel.json              # For deployment
│
├── Frontend/foodwaste-frontend/
│   ├── src/
│   │   ├── App.jsx              # Main App
│   │   ├── App.css              # Global styles
│   │   ├── pages/               
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Home.jsx         # Donation form
│   │   │   ├── AdminPanel.jsx   # Admin dashboard
│   │   │   └── ThankYou.jsx
│   │   ├── services/
│   │   │   └── apiService.js    # API calls
│   │   ├── utils/
│   │   │   └── adminUtils.js    # Admin helpers
│   │   ├── config/
│   │   │   └── api.js          # API config
│   │   └── data/
│   │       └── ngos.js         # Fallback NGO db
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                    # API URL
│   └── vercel.json            # For deployment
│
├── DEPLOYMENT_GUIDE.md         # Full deployment docs
└── QUICKSTART.md              # Quick reference
```

---

## 🛣️ API Routes

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/ping` | Health check |

### Food Donations
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/food/donate` | Save donation + return NGOs ⭐ |
| GET | `/api/food/all` | Get all donations |
| PUT | `/api/food/:id` | Update donor name |

### NGO Database
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/ngo/all` | All NGOs in database |
| GET | `/api/ngo/:location` | NGOs by city/location |

---

## 🎯 Key Features Explained

### Admin Approval System
- **Super Admin Only:** `bhoomika7444@gmail.com`
- Regular users request admin access
- Super admin approves/rejects
- Approved admins see dashboard

### NGO Recommendation
- Matches food location to NGO city
- Returns up to 6 nearby NGOs
- Shows name, phone, email, type
- Links to Google Maps
- Fallback system if database empty

### Admin Dashboard
- **Donations Tab:** View all donations in sortable table
- **Requests Tab:** (Super admin) Approve/reject admin requests
- **Admins Tab:** (Super admin) Manage approved admins
- Filter by food type, search by donor/food/location
- Sort by quantity, date

---

## 🌍 Supported Cities

NGOs available for these locations:
- Bangalore (13 NGOs)
- Mumbai (5 NGOs)
- Delhi (5 NGOs)
- Chennai (4 NGOs)
- Hyderabad (4 NGOs)
- Pune (3 NGOs)
- Kolkata (3 NGOs)
- Mysore (2 NGOs)
- Mangalore (2 NGOs)
- Ahmedabad (2 NGOs)
- Jaipur (2 NGOs)

---

## 📦 Database

### MongoDB Collections

**Users**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String,
  role: String (user|admin|super),
  createdAt: Date
}
```

**Foods**
```javascript
{
  _id: ObjectId,
  foodName: String,
  quantity: Number,
  type: String (Veg|Non-Veg|Both),
  location: String,
  donorId: String,
  donorName: String,
  createdAt: Date
}
```

**NGOs**
```javascript
{
  _id: ObjectId,
  name: String,
  location: String,
  area: String,
  phone: String,
  email: String,
  type: String (NGO|Orphanage|Food Bank|etc)
}
```

---

## 🚢 Deployment

### Quick Deploy to Production

**Backend → Render:**
```bash
# 1. Push to GitHub
# 2. Create Render Web Service
# 3. Set build: npm install
# 4. Set start: npm start
# 5. Add MONGO_URI env var
# 6. Deploy!
```

**Frontend → Vercel:**
```bash
# 1. Connect GitHub repo
# 2. Select Frontend/foodwaste-frontend folder
# 3. Add VITE_API_URL env var
# 4. Deploy!
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

---

## ✅ Viva Demo Checklist

- [ ] Backend server running
- [ ] Frontend app running
- [ ] Can register new user
- [ ] Can login as Bhoomika
- [ ] Can donate food
- [ ] NGOs show for Bangalore
- [ ] Can toggle map/list view
- [ ] Can access admin panel as Bhoomika
- [ ] Can approve admin requests
- [ ] Can edit donation donor name
- [ ] Can see donation statistics
- [ ] Responsive on mobile browser

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend can't reach API
- Check `VITE_API_URL` in `.env`
- Backend must be running on port 5000
- Check CORS in `server.js`

### MongoDB connection fails
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Test connection: `mongosh "mongodb+srv://..."`

### Can't access admin panel
- Must login as: `bhoomika7444@gmail.com`
- Clear localStorage: `localStorage.clear()`
- Refresh page after logging in

---

## 📝 Environment Variables

**Backend `.env`:**
```
PORT=5000
MONGO_URI=mongodb+srv://bhoomika7444_db_user:12345@cluster0.x68bzcd.mongodb.net/?appName=Cluster0
NODE_ENV=development
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:5000
```

---

## 📊 Stats (Demo Mode)
- Total NGOs: 45+
- Supported Cities: 11
- Test Users: ∞
- Max Donations: Unlimited
- Admin Power: Full control

---

## 🎨 UI Features

- **Dark Mode:** Beautiful dark background with lime/teal accents
- **Smooth Animations:** FadeUp, ScaleIn, Float effects
- **Responsive:** 100% mobile-friendly
- **Accessible:** Focus states, proper contrast
- **Modern Design:** Glassmorphism, gradients, blur effects

---

## 📜 License
MIT - Open source food donation platform

---

## 🙏 Credits
**Developer:** Bhoomika R
**For:** Viva Presentation
**Status:** ✅ Ready for Demo

---

**Questions?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) and [QUICKSTART.md](./QUICKSTART.md)

Happy donating! 🌱

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
