import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { findNearbyNGOs, resolveCity, NGO_DATABASE } from "../data/ngos";
import { isAdmin, isSuperAdmin, ensureSuperAdmin } from "../utils/adminUtils";
import apiService from "../services/apiService";

/* ── City → approx coords map ── */
const CITY_COORDS = {
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  mumbai:    { lat: 19.0760, lng: 72.8777 },
  delhi:     { lat: 28.6139, lng: 77.2090 },
  chennai:   { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  pune:      { lat: 18.5204, lng: 73.8567 },
  kolkata:   { lat: 22.5726, lng: 88.3639 },
  mysore:    { lat: 12.2958, lng: 76.6394 },
  mangalore: { lat: 12.9141, lng: 74.8560 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur:    { lat: 26.9124, lng: 75.7873 },
  surat:     { lat: 21.1702, lng: 72.8311 },
};

function getNGOMapUrl(ngos, city) {
  const cityKey = city.toLowerCase();
  const coords = CITY_COORDS[cityKey] || { lat: 20.5937, lng: 78.9629 };
  // Build an OpenStreetMap embed with markers via iframe
  const markers = ngos.slice(0, 5).map((_, i) => {
    const offset = (i - 2) * 0.012;
    return `${coords.lat + offset},${coords.lng + offset}`;
  });
  return `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.08}%2C${coords.lat - 0.06}%2C${coords.lng + 0.08}%2C${coords.lat + 0.06}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;
}

export default function Home() {
  const navigate = useNavigate();
  const ngoRef   = useRef(null);
  const formRef  = useRef(null);

  const [user, setUser]           = useState({ name: "Friend", email: "" });
  const [form, setForm]           = useState({ foodName: "", quantity: "", type: "", location: "", donorName: "" });
  const [ngos, setNgos]           = useState([]);
  const [allFoods, setAllFoods]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [donated, setDonated]     = useState(false);
  const [errors, setErrors]       = useState({});
  const [donatedCity, setDonatedCity] = useState("");
  const [donationCount, setDonationCount] = useState(0);
  const [showMap, setShowMap]     = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);

  useEffect(() => {
    ensureSuperAdmin();
    const stored = localStorage.getItem("fw_user");
    if (!stored) { navigate("/"); return; }
    setUser(JSON.parse(stored));
    const count = parseInt(localStorage.getItem("fw_donation_count") || "0", 10);
    setDonationCount(count);
  }, []);

  useEffect(() => {
    if (ngos.length > 0 && ngoRef.current) {
      setTimeout(() => ngoRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [ngos]);

  // Fetch all foods from backend to get accurate donation count
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foods = await apiService.getAllFoods();
        if (foods && foods.length > 0) {
          setAllFoods(foods);
          setDonationCount(foods.length);
          localStorage.setItem("fw_donation_count", foods.length.toString());
        }
      } catch (error) {
        // Fall back to localStorage count
        const count = parseInt(localStorage.getItem("fw_donation_count") || "0", 10);
        setDonationCount(count);
      }
    };
    fetchFoods();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.foodName.trim()) e.foodName = "Food name is required";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) e.quantity = "Enter a valid quantity";
    if (!form.type)            e.type     = "Select food type";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.donorName.trim()) e.donorName = "Donor name is required";
    return e;
  };

  const donateFood = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    setNgos([]);
    setDonatedCity("");
    setErrors({});
    setTimeout(async () => {
      try {
        // Call backend API to donate food with donor info
        const response = await apiService.donateFood({
          foodName: form.foodName,
          quantity: Number(form.quantity),
          type: form.type,
          location: form.location,
          donorId: user.id,
          donorName: form.donorName.trim(),
        });

        // Update donation count
        const newCount = donationCount + 1;
        localStorage.setItem("fw_donation_count", newCount.toString());
        setDonationCount(newCount);

        // Get nearby NGOs from backend response or fallback to local database
        let nearbyNGOs = response.ngos || [];
        let city = response.city || resolveCity(form.location);
        
        // If backend didn't return NGOs, use fallback method
        if (!nearbyNGOs || nearbyNGOs.length === 0) {
          nearbyNGOs = findNearbyNGOs(form.location, 6);
        }
        
        setNgos(nearbyNGOs);
        setDonatedCity(city);
        setForm({ foodName: "", quantity: "", type: "", location: "", donorName: "" });
        setDonated(true);
        setShowMap(false);
      } catch (error) {
        // Try fallback method when API fails
        try {
          const fallbackNGOs = findNearbyNGOs(form.location, 6);
          const city = resolveCity(form.location);
          setNgos(fallbackNGOs);
          setDonatedCity(city);
          setForm({ foodName: "", quantity: "", type: "", location: "", donorName: "" });
          setDonated(true);
          setShowMap(false);
        } catch (fallbackError) {
          setErrors({ submit: "Failed to process donation. Please try again." });
        }
      } finally {
        setLoading(false);
      }
    }, 900);
  };

  const inp = (field) => ({
    value: form[field],
    onChange: (ev) => {
      setForm(f => ({ ...f, [field]: ev.target.value }));
      setErrors(er => ({ ...er, [field]: "" }));
    },
  });

  const signOut = () => {
    localStorage.removeItem("fw_user");
    navigate("/");
  };

  const donateAgain = () => {
    setDonated(false);
    setNgos([]);
    setDonatedCity("");
    setShowMap(false);
    setSelectedNGO(null);
    setForm({ foodName: "", quantity: "", type: "", location: "", donorName: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalDonations = parseInt(localStorage.getItem("fw_donation_count") || "0", 10);

  // Build map URL for a city
  const mapUrl = donatedCity ? getNGOMapUrl(ngos, donatedCity) : "";

  return (
    <div className="home-bg">
      <div className="home-orb home-orb1" />
      <div className="home-orb home-orb2" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-leaf">🌱</span>
          <span className="nav-title">FoodBridge</span>
        </div>
        <div className="nav-right">
          {isAdmin(user.email)
            ? <button className="nav-admin-btn" onClick={() => navigate("/admin")}>{isSuperAdmin(user.email) ? "👑" : "🛡️"} Admin</button>
            : <button className="nav-req-btn" onClick={() => navigate("/admin")}>🔑 Request Admin</button>
          }
          <span className="nav-user">👋 {user.name}</span>
          <button className="nav-signout" onClick={signOut}>Sign out</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-particles">
          {["🍛","🥗","🍱","🥘","🍚","🥙","🫕","🍲","🥣","🧆","🫓","🥡"].map((emoji, i) => (
            <span key={i} className="particle" style={{
              "--delay": `${i * 0.4}s`,
              "--x": `${8 + i * 7.5}%`,
              "--size": `${1.4 + (i % 3) * 0.5}rem`,
              "--duration": `${6 + (i % 4) * 2}s`,
            }}>{emoji}</span>
          ))}
        </div>

        <div className="hero-photo-grid">
          <div className="hero-photo hp1" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80')" }} />
          <div className="hero-photo hp2" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80')" }} />
          <div className="hero-photo hp3" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80')" }} />
          <div className="hero-photo hp4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80')" }} />
          <div className="hero-photo-overlay" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Making a difference, one meal at a time
          </div>
          <h1 className="hero-headline">
            On your special day,<br />
            <span className="hero-headline-accent">feed someone's tomorrow</span>
          </h1>
          <p className="hero-tagline">
            Every plate of food you share sparks joy in a child's eyes.<br />
            Join <strong>2,400+</strong> donors who've served <strong>12,000+</strong> meals across India.
          </p>
          <div className="hero-impact-pills">
            {[["🍽️","12,480+","Meals Served"],["🤝","40+","NGO Partners"],["📍","10+","Cities Active"],["⭐","5,000+","Lives Touched"]].map(([icon, val, label]) => (
              <div className="impact-pill" key={label}>
                <span className="impact-pill-icon">{icon}</span>
                <div>
                  <div className="impact-pill-val">{val}</div>
                  <div className="impact-pill-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="hero-cta" onClick={scrollToForm}>
            <span>🍱 Donate Food Now</span>
            <span className="hero-cta-arrow">↓</span>
          </button>
        </div>

        <div className="hero-scroll-hint" onClick={scrollToForm}>
          <div className="scroll-dot" />
          <span>Scroll to donate</span>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        {[
          ["🍽️","Your Donations",`${totalDonations} meal${totalDonations !== 1 ? "s" : ""}`],
          ["🤝","NGO Partners","40+ active"],
          ["⭐","Lives Touched",`${totalDonations * 5}+`],
          ["📍","Cities Covered","10+"],
        ].map(([icon, label, val]) => (
          <div key={label} className="stat-card">
            <span className="stat-icon">{icon}</span>
            <div className="stat-val">{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="home-content" ref={formRef}>

        {/* ── Donation Form ── */}
        {!donated && (
          <div className="donate-card fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="donate-header">
              <h2 className="donate-title">Donate Food 🍱</h2>
              <p className="donate-sub">Fill in the details — we'll find the nearest NGOs for you instantly</p>
            </div>
            <div className="donate-grid">
              <div className="form-group">
                <label className="form-label">Food Name</label>
                <input className={`form-input ${errors.foodName ? "input-error" : ""}`} placeholder="e.g. Rice, Chapati, Biryani" {...inp("foodName")} />
                {errors.foodName && <p className="err-msg">{errors.foodName}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Quantity (servings)</label>
                <input type="number" min="1" className={`form-input ${errors.quantity ? "input-error" : ""}`} placeholder="e.g. 10" {...inp("quantity")} />
                {errors.quantity && <p className="err-msg">{errors.quantity}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Food Type</label>
                <select className={`form-input form-select ${errors.type ? "input-error" : ""}`} value={form.type} onChange={ev => { setForm(f => ({ ...f, type: ev.target.value })); setErrors(er => ({ ...er, type: "" })); }}>
                  <option value="">Select type</option>
                  <option value="Veg">🥦 Veg</option>
                  <option value="Non-Veg">🍗 Non-Veg</option>
                  <option value="Both">🍱 Both</option>
                </select>
                {errors.type && <p className="err-msg">{errors.type}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Your Location</label>
                <input className={`form-input ${errors.location ? "input-error" : ""}`} placeholder="e.g. Koramangala, Bangalore" {...inp("location")} />
                {errors.location && <p className="err-msg">{errors.location}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className={`form-input ${errors.donorName ? "input-error" : ""}`} placeholder="Enter your full name" {...inp("donorName")} />
                {errors.donorName && <p className="err-msg">{errors.donorName}</p>}
              </div>
            </div>
            <p className="location-hint">💡 Try: Koramangala, Indiranagar, Bandra, Andheri, Connaught Place, T Nagar, Banjara Hills…</p>
            {errors.submit && <div className="err-banner" style={{ marginTop: "0.75rem" }}>⚠ {errors.submit}</div>}
            <button className="btn-donate" onClick={donateFood} disabled={loading}>
              {loading ? <span className="btn-loading"><span className="spinner-green" /> Finding NGOs…</span> : "🍱 Donate Food — Find Nearby NGOs"}
            </button>
          </div>
        )}

        {/* ── NGO Results ── */}
        {donated && (
          <div ref={ngoRef} className="ngo-results-wrapper fade-up">

            <div className="donation-success-banner">
              <div className="success-icon-sm">✅</div>
              <div>
                <div className="success-title">Donation Submitted!</div>
                <div className="success-sub">Your food has been recorded. Here are NGOs near <strong>{donatedCity}</strong> — contact them directly to arrange pickup.</div>
              </div>
            </div>

            {ngos.length > 0 ? (
              <>
                <div className="ngo-heading-row">
                  <h3 className="ngo-heading">
                    🤝 Recommended NGOs Near <span style={{ color: "#a3e635" }}>{donatedCity}</span>
                    <span className="ngo-count-badge">{ngos.length} found</span>
                  </h3>
                  <button
                    className={`map-toggle-btn ${showMap ? "map-active" : ""}`}
                    onClick={() => setShowMap(v => !v)}
                  >
                    {showMap ? "🗂️ List View" : "🗺️ View on Map"}
                  </button>
                </div>

                {/* MAP VIEW */}
                {showMap && (
                  <div className="ngo-map-container fade-up">
                    <div className="ngo-map-sidebar">
                      <div className="map-sidebar-title">📍 NGOs in {donatedCity}</div>
                      {ngos.map((ngo, i) => (
                        <div
                          key={ngo.id}
                          className={`map-ngo-item ${selectedNGO?.id === ngo.id ? "map-ngo-active" : ""}`}
                          onClick={() => setSelectedNGO(ngo)}
                        >
                          <div className="map-ngo-num">{i + 1}</div>
                          <div>
                            <div className="map-ngo-name">{ngo.name}</div>
                            <div className="map-ngo-area">📍 {ngo.area}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="ngo-map-frame-wrap">
                      {selectedNGO && (
                        <div className="map-selected-info">
                          <strong>{selectedNGO.name}</strong> · {selectedNGO.area}, {donatedCity}
                          <a
                            href={`https://www.google.com/maps/search/${encodeURIComponent(selectedNGO.name + " " + selectedNGO.area + " " + donatedCity)}`}
                            target="_blank" rel="noreferrer"
                            className="map-open-link"
                          >Open in Google Maps ↗</a>
                        </div>
                      )}
                      <iframe
                        title="NGO Map"
                        className="ngo-map-iframe"
                        src={mapUrl}
                        loading="lazy"
                        allowFullScreen
                      />
                      <div className="map-caption">
                        📌 Map centered on <strong>{donatedCity}</strong>. Click an NGO name to open in Google Maps.
                      </div>
                    </div>
                  </div>
                )}

                {/* LIST VIEW */}
                {!showMap && (
                  <div className="ngo-grid">
                    {ngos.map((ngo, i) => (
                      <div key={ngo.id} className="ngo-card" style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="ngo-avatar">{ngo.name[0]}</div>
                        <div className="ngo-name">{ngo.name}</div>
                        <div className="ngo-detail">📍 {ngo.area}, {ngo.location}</div>
                        <div className="ngo-detail ngo-phone">📞 <a href={`tel:${ngo.phone}`} className="ngo-phone-link">{ngo.phone}</a></div>
                        {ngo.email && <div className="ngo-detail">✉️ <a href={`mailto:${ngo.email}`} className="ngo-phone-link" style={{ fontSize: "0.74rem" }}>{ngo.email}</a></div>}
                        {ngo.type && <div className="ngo-badge">{ngo.type}</div>}
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(ngo.name + " " + ngo.area + " " + ngo.location)}`}
                          target="_blank" rel="noreferrer"
                          className="ngo-map-btn"
                        >🗺️ View on Map</a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-ngo-box">
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
                <p>No NGOs found near <strong>{donatedCity || form.location}</strong>.</p>
                <p style={{ fontSize: "0.78rem", marginTop: "0.75rem", color: "var(--muted)", lineHeight: "1.6" }}>
                  Try: <span style={{ color: "#a3e635" }}>Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune, Kolkata…</span>
                </p>
              </div>
            )}

            <div className="ngo-actions">
              <button className="btn-donate-again-outline" onClick={donateAgain}>🍱 Donate More Food</button>
              <button className="btn-thankyou" onClick={() => {
                localStorage.setItem("fw_last_donation_location", donatedCity);
                navigate("/thankyou", { state: { donationLocation: donatedCity } });
              }}>Continue to Thank You →</button>
            </div>
          </div>
        )}

        {/* ── RECENT DONATIONS SECTION ── */}
        {!donated && (
          <section style={{ marginTop: "3rem", paddingBottom: "2rem" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#a3e635", fontSize: "1.5rem" }}>
              📊 Recent Donations ({allFoods.length})
            </h2>
            {allFoods.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
                padding: "0 1rem"
              }}>
                {allFoods.slice().reverse().slice(0, 12).map((food, idx) => (
                  <div key={food._id || idx} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(163,230,53,0.2)",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    backdropFilter: "blur(10px)",
                    color: "#e0e0e0"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1rem", color: "#a3e635" }}>{food.foodName}</h3>
                      <span style={{ fontSize: "0.75rem", background: "rgba(163,230,53,0.2)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>
                        {food.type || "food"}
                      </span>
                    </div>
                    <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
                      📦 <strong>{food.quantity}</strong> unit{food.quantity > 1 ? "s" : ""}
                    </p>
                    <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
                      📍 {food.location}
                    </p>
                    <p style={{ margin: "0.5rem 0", fontSize: "0.8rem", color: "#999" }}>
                      {new Date(food.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                <p>No donations yet. Be the first to contribute! 🌱</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
