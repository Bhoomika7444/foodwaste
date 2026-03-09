// Predefined NGO data — used to recommend nearby NGOs based on donation location
// No backend needed for this feature

export const NGO_DATABASE = [
  // ── Bangalore / Bengaluru ────────────────────────────────
  { id: "b1", name: "Helping Hands NGO",        location: "Bangalore", area: "Koramangala", phone: "9876543210", type: "NGO",            email: "helpinghands@blr.org" },
  { id: "b2", name: "Hope Orphanage",           location: "Bangalore", area: "Jayanagar",   phone: "9123456789", type: "Orphanage",      email: "hope@blr.org" },
  { id: "b3", name: "Annadaata Foundation",     location: "Bangalore", area: "Indiranagar", phone: "9845123456", type: "NGO",            email: "annadaata@blr.org" },
  { id: "b4", name: "Seva Bharathi Bangalore",  location: "Bangalore", area: "Malleshwaram",phone: "9741256300", type: "NGO",            email: "seva@blr.org" },
  { id: "b5", name: "Akshaya Patra Foundation", location: "Bangalore", area: "Rajajinagar", phone: "8022941008", type: "Food Bank",      email: "akshaya@blr.org" },
  { id: "b6", name: "Robin Hood Army BLR",      location: "Bangalore", area: "BTM Layout",  phone: "9900123456", type: "Volunteer Group",email: "rha@blr.org" },
  { id: "b7", name: "Smile Foundation BLR",     location: "Bangalore", area: "Whitefield",  phone: "9743001122", type: "NGO",            email: "smile@blr.org" },
  { id: "b8", name: "Bangalore Food Bank",      location: "Bangalore", area: "Yelahanka",   phone: "9886001234", type: "Food Bank",      email: "foodbank@blr.org" },

  // ── Mumbai ────────────────────────────────────────────────
  { id: "m1", name: "Roti Bank Mumbai",         location: "Mumbai",    area: "Bandra",       phone: "9820001234", type: "Food Bank",      email: "rotibank@mum.org" },
  { id: "m2", name: "Robin Hood Army Mumbai",   location: "Mumbai",    area: "Andheri",      phone: "9833445566", type: "Volunteer Group",email: "rha@mum.org" },
  { id: "m3", name: "Seva Meals Mumbai",        location: "Mumbai",    area: "Dadar",        phone: "9821334455", type: "NGO",            email: "seva@mum.org" },
  { id: "m4", name: "Ummeed Child Dev Centre",  location: "Mumbai",    area: "Worli",        phone: "9967556677", type: "NGO",            email: "ummeed@mum.org" },
  { id: "m5", name: "Akshaya Patra Mumbai",     location: "Mumbai",    area: "Borivali",     phone: "9820556677", type: "Food Bank",      email: "akshaya@mum.org" },

  // ── Delhi / New Delhi ────────────────────────────────────
  { id: "d1", name: "Feeding India Delhi",      location: "Delhi",     area: "Connaught Place", phone: "9810001122", type: "NGO",         email: "feeding@delhi.org" },
  { id: "d2", name: "No Food Waste Delhi",      location: "Delhi",     area: "Lajpat Nagar",    phone: "9711223344", type: "Volunteer Group", email: "nfw@delhi.org" },
  { id: "d3", name: "Goonj Delhi",              location: "Delhi",     area: "Saket",           phone: "9810334455", type: "NGO",         email: "goonj@delhi.org" },
  { id: "d4", name: "Helpage India HQ",         location: "Delhi",     area: "Vasant Kunj",     phone: "9312456789", type: "NGO",         email: "helpage@delhi.org" },
  { id: "d5", name: "Salam Balak Trust",        location: "Delhi",     area: "Paharganj",       phone: "9810999888", type: "NGO",         email: "sbt@delhi.org" },

  // ── Chennai ───────────────────────────────────────────────
  { id: "c1", name: "Exnora International",     location: "Chennai",   area: "Anna Nagar",  phone: "9444123456", type: "NGO",            email: "exnora@chn.org" },
  { id: "c2", name: "No Food Waste Chennai",    location: "Chennai",   area: "T Nagar",     phone: "9500112233", type: "Volunteer Group",email: "nfw@chn.org" },
  { id: "c3", name: "Akshaya Trust Chennai",    location: "Chennai",   area: "Velachery",   phone: "9840556677", type: "NGO",            email: "akshaya@chn.org" },
  { id: "c4", name: "Karunalaya Chennai",       location: "Chennai",   area: "Perambur",    phone: "9789001122", type: "NGO",            email: "karunalaya@chn.org" },

  // ── Hyderabad ─────────────────────────────────────────────
  { id: "h1", name: "Hyderabad Food Bank",      location: "Hyderabad", area: "Banjara Hills",phone: "9848001234", type: "Food Bank",     email: "hfb@hyd.org" },
  { id: "h2", name: "Robin Hood Army HYD",      location: "Hyderabad", area: "Gachibowli",   phone: "9912334455", type: "Volunteer Group",email: "rha@hyd.org" },
  { id: "h3", name: "Amala Cancer Hospital NGO",location: "Hyderabad", area: "Secunderabad", phone: "9866123456", type: "NGO",           email: "amala@hyd.org" },
  { id: "h4", name: "Akshaya Patra Hyderabad",  location: "Hyderabad", area: "Kukatpally",   phone: "9849556677", type: "Food Bank",     email: "akshaya@hyd.org" },

  // ── Pune ──────────────────────────────────────────────────
  { id: "p1", name: "Pune Food Bank",           location: "Pune",      area: "Kothrud",     phone: "9822001234", type: "Food Bank",      email: "pfb@pune.org" },
  { id: "p2", name: "Seva Sahayog Pune",        location: "Pune",      area: "Hadapsar",    phone: "9766112233", type: "NGO",            email: "seva@pune.org" },
  { id: "p3", name: "Magic Bus Pune",           location: "Pune",      area: "Wakad",       phone: "9823334455", type: "NGO",            email: "magicbus@pune.org" },

  // ── Kolkata ───────────────────────────────────────────────
  { id: "k1", name: "Bhookha Haath Kolkata",    location: "Kolkata",   area: "Park Street",  phone: "9831001234", type: "Volunteer Group",email: "bhookha@kol.org" },
  { id: "k2", name: "Missionaries of Charity",  location: "Kolkata",   area: "Kalighat",     phone: "9330112233", type: "NGO",           email: "moc@kol.org" },
  { id: "k3", name: "Calcutta Food Bank",       location: "Kolkata",   area: "Salt Lake",    phone: "9804556677", type: "Food Bank",     email: "cfb@kol.org" },

  // ── Mysore ────────────────────────────────────────────────
  { id: "my1", name: "Arogya Sahaya Mysore",    location: "Mysore",    area: "Kuvempunagar", phone: "9880001234", type: "NGO",           email: "arogya@mys.org" },
  { id: "my2", name: "Vidyartha Sahaya Mysore", location: "Mysore",    area: "Saraswathipuram",phone: "9743445566", type: "NGO",         email: "vidyartha@mys.org" },

  // ── Mangalore ─────────────────────────────────────────────
  { id: "mg1", name: "Sneha Charitable Trust",  location: "Mangalore", area: "Bejai",       phone: "9448001234", type: "NGO",            email: "sneha@mng.org" },
  { id: "mg2", name: "Sanjeevini Care",         location: "Mangalore", area: "Falnir",      phone: "9980223344", type: "NGO",            email: "sanjeevini@mng.org" },

  // ── Ahmedabad ─────────────────────────────────────────────
  { id: "a1", name: "Robin Hood Army Ahmedabad",location: "Ahmedabad", area: "Navrangpura", phone: "9824001234", type: "Volunteer Group",email: "rha@ahm.org" },
  { id: "a2", name: "Anand Seva Ahmedabad",     location: "Ahmedabad", area: "Satellite",   phone: "9978112233", type: "NGO",            email: "anand@ahm.org" },

  // ── Jaipur ────────────────────────────────────────────────
  { id: "j1", name: "Akshaya Patra Jaipur",     location: "Jaipur",    area: "Vaishali Nagar",phone: "9829001234", type: "Food Bank",    email: "akshaya@jai.org" },
  { id: "j2", name: "Seva Bharathi Jaipur",     location: "Jaipur",    area: "Malviya Nagar", phone: "9828112233", type: "NGO",          email: "seva@jai.org" },
];

// Area-to-city mapping so users can type a neighbourhood and we find the right city
const AREA_TO_CITY = {
  // Bangalore suburbs
  koramangala: "Bangalore", indiranagar: "Bangalore", whitefield: "Bangalore",
  btm: "Bangalore", "btm layout": "Bangalore", jayanagar: "Bangalore",
  yelahanka: "Bangalore", malleshwaram: "Bangalore", rajajinagar: "Bangalore",
  "electronic city": "Bangalore", marathahalli: "Bangalore", hebbal: "Bangalore",
  banashankari: "Bangalore", kengeri: "Bangalore", basavanagudi: "Bangalore",
  "sanjay nagar": "Bangalore", vijayanagar: "Bangalore", varthur: "Bangalore",
  hoodi: "Bangalore", hennur: "Bangalore", nagarbhavi: "Bangalore",
  "kr puram": "Bangalore", "kr market": "Bangalore", shivajinagar: "Bangalore",
  "mg road": "Bangalore", "brigade road": "Bangalore", "church street": "Bangalore",
  "ulsoor": "Bangalore", "frazer town": "Bangalore", "richmond town": "Bangalore",
  "jp nagar": "Bangalore", "hsr layout": "Bangalore", "sarjapur": "Bangalore",
  "bellandur": "Bangalore", "kadubeesanahalli": "Bangalore", "mahadevapura": "Bangalore",
  bengaluru: "Bangalore", bangalore: "Bangalore",

  // Mumbai suburbs
  bandra: "Mumbai", andheri: "Mumbai", borivali: "Mumbai", dadar: "Mumbai",
  worli: "Mumbai", juhu: "Mumbai", powai: "Mumbai", thane: "Mumbai",
  navi: "Mumbai", "navi mumbai": "Mumbai", kurla: "Mumbai", dharavi: "Mumbai",
  "lower parel": "Mumbai", "goregaon": "Mumbai", "malad": "Mumbai",
  "kandivali": "Mumbai", "versova": "Mumbai", "lokhandwala": "Mumbai",
  bombay: "Mumbai", mumbai: "Mumbai",

  // Delhi NCR
  "connaught place": "Delhi", "cp": "Delhi", "lajpat nagar": "Delhi",
  "saket": "Delhi", "karol bagh": "Delhi", "paharganj": "Delhi",
  "vasant kunj": "Delhi", "hauz khas": "Delhi", "south ex": "Delhi",
  "south extension": "Delhi", noida: "Delhi", gurgaon: "Delhi",
  gurugram: "Delhi", faridabad: "Delhi", "new delhi": "Delhi", delhi: "Delhi",

  // Chennai
  "anna nagar": "Chennai", "t nagar": "Chennai", velachery: "Chennai",
  perambur: "Chennai", adyar: "Chennai", "guindy": "Chennai",
  "mylapore": "Chennai", "kodambakkam": "Chennai", tambaram: "Chennai",
  chennai: "Chennai",

  // Hyderabad
  "banjara hills": "Hyderabad", gachibowli: "Hyderabad", secunderabad: "Hyderabad",
  kukatpally: "Hyderabad", "madhapur": "Hyderabad", kondapur: "Hyderabad",
  ameerpet: "Hyderabad", "jubilee hills": "Hyderabad", hyderabad: "Hyderabad",

  // Pune
  kothrud: "Pune", hadapsar: "Pune", wakad: "Pune", "hinjewadi": "Pune",
  "viman nagar": "Pune", "baner": "Pune", "kharadi": "Pune", pune: "Pune",

  // Kolkata
  "park street": "Kolkata", kalighat: "Kolkata", "salt lake": "Kolkata",
  "howrah": "Kolkata", "dum dum": "Kolkata", "ballygunge": "Kolkata", kolkata: "Kolkata",

  // Others
  mysore: "Mysore", mysuru: "Mysore",
  mangalore: "Mangalore", mangaluru: "Mangalore",
  ahmedabad: "Ahmedabad", amdavad: "Ahmedabad",
  jaipur: "Jaipur",
};

/**
 * Given a raw location string, return matching NGOs (up to maxResults).
 * Tries to match by city name, then by area/suburb.
 */
export function findNearbyNGOs(rawLocation, maxResults = 6) {
  if (!rawLocation) return [];

  const lower = rawLocation.trim().toLowerCase();

  // Try direct city match
  let city = AREA_TO_CITY[lower];

  // Try splitting by comma/space to get individual tokens
  if (!city) {
    const tokens = lower.split(/[\s,]+/);
    for (const token of tokens) {
      if (AREA_TO_CITY[token]) { city = AREA_TO_CITY[token]; break; }
    }
  }

  // If still no city, try substring match
  if (!city) {
    for (const [key, val] of Object.entries(AREA_TO_CITY)) {
      if (lower.includes(key) || key.includes(lower)) { city = val; break; }
    }
  }

  if (!city) return [];

  return NGO_DATABASE
    .filter(n => n.location.toLowerCase() === city.toLowerCase())
    .slice(0, maxResults);
}

export function resolveCity(rawLocation) {
  if (!rawLocation) return rawLocation;
  const lower = rawLocation.trim().toLowerCase();

  let city = AREA_TO_CITY[lower];
  if (!city) {
    const tokens = lower.split(/[\s,]+/);
    for (const token of tokens) {
      if (AREA_TO_CITY[token]) { city = AREA_TO_CITY[token]; break; }
    }
  }
  if (!city) {
    for (const [key, val] of Object.entries(AREA_TO_CITY)) {
      if (lower.includes(key) || key.includes(lower)) { city = val; break; }
    }
  }
  return city || rawLocation.trim();
}
