# FoodBridge - Quick Start

## What is FoodBridge?
A web platform connecting food donors with NGOs that need food donations. Users can donate surplus food and get matched with nearby NGOs for pickup.

## Key Features
✅ User registration & secure login
✅ Food donation with location-based NGO matching
✅ Admin dashboard for managing donations
✅ Admin approval system (regulated by super-admin)
✅ Interactive NGO location map
✅ Responsive design (mobile, tablet, desktop)
✅ Beautiful animations & modern UI

## Quick Start (Local Development)

### Prerequisites
- Node.js 14+ installed
- npm or yarn
- Git

### 1. Clone and Install Backend
```bash
cd Backend
npm install
```

### 2. Setup MongoDB
Copy `.env.example` to `.env` and add your MongoDB URI:
```
MONGO_URI=mongodb+srv://bhoomika7444_db_user:12345@cluster0.x68bzcd.mongodb.net/?appName=Cluster0
PORT=5000
```

### 3. Start Backend
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### 4. Install Frontend Dependencies
```bash
cd Frontend/foodwaste-frontend
npm install
```

### 5. Setup Frontend API URL
Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

### 6. Start Frontend
```bash
npm run dev
```
Open http://localhost:5173 in your browser

## Testing the App

### Test User Credentials
```
Email: bhoomika7444@gmail.com
Password: admin123
```

### Test Flow
1. Sign up or login
2. Go to Home page
3. Fill donation form:
   - Food name: "Rice"
   - Quantity: "100"
   - Type: "Veg"
   - Location: "Bangalore" or "Koramangala"
   - Donor name: "Your name"
4. See recommended NGOs
5. View map or list of NGOs
6. (Super Admin) Go to /admin to view all donations

##API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Food
- POST `/api/food/donate` - Donate food + get NGOs
- GET `/api/food/all` - Get all donations
- PUT `/api/food/:id` - Update donor name

### NGO
- GET `/api/ngo/all` - Get all NGOs
- GET `/api/ngo/:location` - Get NGOs by location

## Admin Features

### Super Admin (Bhoomika only)
Email: `bhoomika7444@gmail.com`

Access `/admin` to:
- View all donations in a table
- Edit donor information
- Approve/reject admin requests
- Manage approved admins
- Revoke admin access

### Regular Users
Can request admin access via the request system. Super admin approves them.

## Folder Structure

```
fw_v3/
├── Backend/              # Node.js server
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
│
└── Frontend/
    └── foodwaste-frontend/
        ├── src/
        │   ├── pages/     # React pages
        │   ├── components/
        │   ├── services/  # API calls
        │   └── App.jsx
        └── package.json
```

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions for:
- Render (Backend)
- Vercel (Frontend)  
- MongoDB Atlas

## Troubleshooting

**Issue: Can't connect to MongoDB**
- Check MONGO_URI in .env is correct
- Ensure IP is whitelisted in MongoDB Atlas

**Issue: Frontend can't reach backend API**
- Check VITE_API_URL in frontend/.env
- Ensure backend server is running
- Check CORS is enabled in server.js

**Issue: Can't access admin panel**
- Must be logged in as: bhoomika7444@gmail.com
- Check localStorage for fw_user token

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Support
For issues or questions, check DEPLOYMENT_GUIDE.md for more details.

---

**Happy Donating!** 🌱
