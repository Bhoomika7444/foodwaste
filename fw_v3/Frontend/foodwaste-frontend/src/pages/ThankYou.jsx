import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "../services/apiService";

const quotes = [
  { text: "No act of kindness, however small, is ever wasted.", author: "Aesop" },
  { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
  { text: "Kindness is the language which the deaf can hear and the blind can see.", author: "Mark Twain" },
];

export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: "Friend" });
  const [ngos, setNgos] = useState([]);
  const [donationLocation, setDonationLocation] = useState("");
  const [loadingNgos, setLoadingNgos] = useState(false);
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    const stored = localStorage.getItem("fw_user");
    if (stored) setUser(JSON.parse(stored));

    // Get donation location from navigation state or localStorage
    const locState = location.state?.donationLocation || localStorage.getItem("fw_last_donation_location") || "";
    setDonationLocation(locState);

    // Fetch NGOs for the donation location
    if (locState) {
      fetchNgos(locState);
    }
  }, [location]);

  const fetchNgos = async (city) => {
    setLoadingNgos(true);
    try {
      const response = await apiService.getNgosByLocation(city);
      setNgos(response || []);
    } catch (error) {
      setNgos([]);
    } finally {
      setLoadingNgos(false);
    }
  };

  return (
    <div className="thanks-bg">
      <div className="thanks-orb thanks-orb1" />
      <div className="thanks-orb thanks-orb2" />

      <div className="thanks-card fade-up">
        {/* Checkmark */}
        <div className="thanks-check">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="thanks-title">Thank You, {user.name?.split(" ")[0]}! 🎉</h1>
        <p className="thanks-sub">Your donation has been received. You're making the world a better place, one meal at a time.</p>

        {/* Divider */}
        <div className="thanks-divider" />

        {/* Quote */}
        <div className="quote-box">
          <div className="quote-mark">"</div>
          <p className="quote-text">{quote.text}</p>
          <p className="quote-author">— {quote.author}</p>
        </div>

        <div className="thanks-divider" />

        <p className="thanks-impact">💚 Every contribution brings us closer to a hunger-free world</p>

        {/* NGO Recommendations Section */}
        {donationLocation && (
          <div className="thanks-ngos-section">
            <h3 className="thanks-ngos-title">🤝 Partner NGOs in {donationLocation}</h3>
            {loadingNgos ? (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", padding: "1.5rem" }}>
                <span className="spinner" style={{ marginRight: "0.5rem" }} /> Loading NGOs...
              </div>
            ) : ngos && ngos.length > 0 ? (
              <div className="thanks-ngos-grid">
                {ngos.slice(0, 4).map((ngo, idx) => (
                  <div key={idx} className="ngo-card">
                    <div className="ngo-header">
                      <span className="ngo-icon">🏢</span>
                      <span className="ngo-name">{ngo.name || ngo.location}</span>
                    </div>
                    <div className="ngo-details">
                      {ngo.email && <div className="ngo-detail">📧 {ngo.email}</div>}
                      {ngo.phone && <div className="ngo-detail">📱 {ngo.phone}</div>}
                      {ngo.location && <div className="ngo-detail">📍 {ngo.location}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", margin: "1rem 0" }}>
                No partner NGOs found for this location yet. We're expanding our network!
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="thanks-actions">
          <button className="btn-home" onClick={() => navigate("/home")}>
            ← Back to Home
          </button>
          <button className="btn-donate-again" onClick={() => navigate("/home")}>
            Donate Again 🍱
          </button>
        </div>
      </div>

      <style>{`
        .thanks-ngos-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .thanks-ngos-title {
          text-align: center;
          color: #a3e635;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .thanks-ngos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.8rem;
          margin-top: 1rem;
        }
        .ngo-card {
          background: rgba(163, 230, 53, 0.05);
          border: 1px solid rgba(163, 230, 53, 0.2);
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.8);
          transition: all 0.3s ease;
        }
        .ngo-card:hover {
          background: rgba(163, 230, 53, 0.08);
          border-color: rgba(163, 230, 53, 0.4);
          transform: translateY(-2px);
        }
        .ngo-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #a3e635;
        }
        .ngo-icon {
          font-size: 1rem;
        }
        .ngo-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ngo-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .ngo-detail {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: rgba(255,255,255,0.6);
        }
        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(163, 230, 53, 0.2);
          border-top-color: #a3e635;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
