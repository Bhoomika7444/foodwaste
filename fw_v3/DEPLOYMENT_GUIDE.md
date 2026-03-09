# FoodBridge - Deployment & Demo Guide

## Overview
FoodBridge is a food donation and NGO matching platform with:
- **Backend**: Node.js/Express on Render
- **Frontend**: React/Vite on Vercel
- **Database**: MongoDB Atlas
- **Super Admin**: bhoomika7444@gmail.com

---

## DEPLOYMENT INSTRUCTIONS

### Backend (Node.js + Express + MongoDB)

#### Local Setup
```bash
cd Backend
npm install
```

Create or update `.env` file:
```
PORT=5000
MONGO_URI=mongodb+srv://bhoomika7444_db_user:12345@cluster0.x68bzcd.mongodb.net/?appName=Cluster0
NODE_ENV=development
```

Run locally:
```bash
npm run dev      # with nodemon (watch mode)
npm start        # production start
npm run seed     # seed database with test NGOs
```

#### Deploy to Render
1. Connect GitHub repo to Render
2. Create new "Web Service" from branch
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: 5000
   - `NODE_ENV`: production
6. Deploy!
7. Copy your Render URL: `https://your-service.onrender.com`

---

### Frontend (React + Vite)

#### Local Setup
```bash
cd Frontend/foodwaste-frontend
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

Run locally:
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

#### Deploy to Vercel
1. Connect GitHub repo to Vercel
2. Select `Frontend/foodwaste-frontend` as root directory
3. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-service.onrender.com`)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy!

---

## DATABASE SETUP

### MongoDB Atlas (Already Connected)
Your MongoDB is already configured at:
```
mongodb+srv://bhoomika7444_db_user:12345@cluster0.x68bzcd.mongodb.net/?appName=Cluster0
```

**Collections needed:**
- `users` - User accounts
- `foods` - Food donations
- `ngos` - NGO database

### Initial Seed (Optional)
To populate NGOs in database:
```bash
cd Backend
npm run seed
```

Or manually insert NGO data via MongoDB Atlas console.

---

## IMPORTANT FEATURES (FOR DEMO)

### 1. Super Admin Access (Bhoomika Only)
- Email: `bhoomika7444@gmail.com`
- Can approve/reject admin requests
- Can manage all admins
- Can view all donations
- Can edit donor names

**Test Access:**
1. Sign up as Bhoomika (bhoomika7444@gmail.com)
2. Go to `/admin` - you'll have super-admin access automatically

### 2. Admin Approval System
- Regular users can request admin access
- Only super-admin can approve requests
- Approved admins can:
  - View all donations
  - Edit donor information
  - Approve/reject other admin requests (Super Admin only)
  - Revoke admin access (Super Admin only)

### 3. Food Donation with NGO Matching
- Users donate food with:
  - Food name
  - Quantity (servings)
  - Type (Veg/Non-Veg)
  - Location (city/area)
  - Donor name
- System automatically recommends nearby NGOs
- Shows NGOs in list or map view
- Contact info for direct coordination

### 4. NGO Database
- 40+ NGOs across 10 Indian cities
- Includes location, phone, email, type
- Backend provides PostgreSQL storage
- Frontend has fallback local database

---

## DEMO CHECKLIST ✓

### Core Features
- [x] User Registration & Login
- [x] Food Donation Form
- [x] NGO Recommendation System
- [x] Admin Dashboard
- [x] Admin Approval System
- [x] Super Admin Controls

### Quality
- [x] Responsive UI (mobile/tablet/desktop)
- [x] Smooth animations
- [x] Error handling with fallback systems
- [x] Cross-platform compatibility

### Technical Setup
- [x] Environment variables configured
- [x] CORS properly configured
- [x] MongoDB connection verified
- [x] API routes tested
- [x] Frontend-backend integration complete

---

## SAMPLE TEST DATA

### Test User Accounts
```
Email: test@example.com
Password: Test@123

Email: bhoomika7444@gmail.com
Password: admin123
```

### Test Donation
```
Food Name: Rice & Dal
Quantity: 50
Type: Veg
Location: Koramangala, Bangalore
Donor Name: Test Donor
```

Expected: System recommends NGOs in Bangalore

---

## TROUBLESHOOTING

### API Connection Issues
- Check `VITE_API_URL` in frontend `.env`
- Ensure backend is running
- Check CORS settings in server.js
- Verify MongoDB connection string

### NGO Not Showing
- Check location name matches city mapping
- Verify NGOs exist in database
- Fallback to local NGO_DATABASE works
- Check browser console for errors

### Admin Access Denied
- Verify Bhoomika email: `bhoomika7444@gmail.com`
- Clear localStorage: `localStorage.clear()`
- Refresh page after login

### Deployment Stuck
- Check Render/Vercel build logs
- Verify all environment variables set
- Ensure node_modules in `.gitignore`
- Check package.json for correct scripts

---

## MONITORING (POST-DEPLOYMENT)

### Render Dashboard
- View logs: https://dashboard.render.com
- Check for errors during requests
- Monitor memory/CPU usage

### Vercel Dashboard
- Check build logs: https://vercel.com
- Monitor page performance
- View analytics

### Database Monitoring
- MongoDB Atlas Dashboard
- Check connection metrics
- Monitor storage usage

---

## VIVA DEMO SCRIPT

### 1. Show Login (2 min)
- Sign up new user
- Log in
- Navigate to home page

### 2. Demonstrate Food Donation (3 min)
- Fill donation form
- Submit
- Show NGO recommendations
- Toggle between list and map view

### 3. Admin Features (4 min)
- Log in as Bhoomika
- Show admin dashboard
- Show donation statistics
- Request admin access (from different account)
- Approve/reject request as Bhoomika

### 4. NGO Matching System (2 min)
- Try different cities (Bangalore, Mumbai, Delhi)
- Show how system matches by location
- Explain fallback system

### 5. Technical Highlights (2 min)
- Explain deployment architecture
- Show responsive design on mobile
- Highlight smooth animations

**Total Demo Time: ~13 minutes**

---

## File Structure

```
fw_v3/
├── Backend/
│   ├── server.js          # Express server
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   └── ngoController.js
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── Ngo.js
│   ├── routes/            # API endpoints
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   └── ngoRoutes.js
│   ├── package.json
│   └── .env               # Environment variables
│
└── Frontend/foodwaste-frontend/
    ├── src/
    │   ├── App.jsx        # Main app component
    │   ├── App.css        # Global styles
    │   ├── pages/         # Page components
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Home.jsx
    │   │   ├── AdminPanel.jsx
    │   │   └── ThankYou.jsx
    │   ├── services/      # API calls
    │   │   └── apiService.js
    │   ├── utils/         # Utilities
    │   │   └── adminUtils.js
    │   ├── config/        # Configuration
    │   │   └── api.js
    │   └── data/          # Static data
    │       └── ngos.js
    ├── package.json
    └── .env              # Environment variables
```

---

## Version Info
- Node.js: 14+
- React: 19.2.0
- Vite: 7.3.1
- Express: 4.22.1
- MongoDB: Atlas (Cloud)
- Deployment: Render (Backend) + Vercel (Frontend)

---

**Last Updated:** March 2025
**Demo Ready:** ✓ YES
